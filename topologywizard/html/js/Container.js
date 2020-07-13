(function() {
   
   var util = YAHOO.util;
   var Dom = util.Dom, Event = util.Event, JSON = YAHOO.lang.JSON, CSS_PREFIX = "WireIt-", NMWG_Domain_Prefix = "urn:ogf:network:domain=";
    
/**
 * Visual module that contains terminals. The wires are updated when the module is dragged around.
 * @class Container
 * @namespace WireIt
 * @constructor
 * @param {Object}   options      Configuration object (see options property)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.Container = function(options, layer) {
   
      /**
    * Node Properties
    *  
    */
   
    this.domainid  = null;
    this.nodeid = null;
    this.nodeaddress = null;
   
   
   
   // Set the options
   this.setOptions(options);
   
   /**
    * the WireIt.Layer object that schould contain this container
    * @property layer
    * @type {WireIt.Layer}
    */
   this.layer = layer;
   
   /**
    * List of the terminals 
    * @property terminals
    * @type {Array}
    */
   this.terminals = [];
   
   /**
    * List of all the wires connected to this container terminals
    * @property wires
    * @type {Array}
    */
   this.wires = [];
   
   /**
    * Container DOM element
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;
   
   /**
    * Body element
    * @property bodyEl
    * @type {HTMLElement}
    */
   this.bodyEl = null;
   
   /** 
    * Port - Network Element Properties
    * @property nelProperties
    * @type {HTMLElement}  
   */
   
   this.neleProperties = null;
   
   
   
   this.prev_terminal_dir = null;
   
     
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddWire
    */
   this.eventAddWire = new util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");
   
   /**
    * Event that is fired when a property of the network element property value is changed
    * You can register this event with myTerminal.eventChangedNetElemProps.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventChangedNetElemProps
    */
   this.eventChangedNetElemProps = new util.CustomEvent("eventChangedNetElemProps");
   
   /**
    * Event that is fired when a property of the network element property value is changed
    * You can register this event with myTerminal.eventTerminalSelection.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventChangedNetElemProps    */
    
   this.eventTerminalSelection = new util.CustomEvent("eventTerminalSelection");
   
   
   // Render the div object
   this.render();
   
   this.currentSelectedTerminal = null;
   
   
   // Init the terminals..(deprecated as this will only work for static no. of ports)
   //this.initTerminals(this.options.terminals);
 
  
 
   var ports_undefined = (typeof options.noofports == "undefined") ? true : false ;
      
   //Init dynamic ports
   if(!ports_undefined)
   {
   		this.initPorts(options.noofports);
   }    
    
	// Make the container draggable
	if(this.options.draggable) {
		   
	   if(this.options.resizable) {
      	// Make resizeable   
      	this.ddResize = new WireIt.util.DDResize(this);
      	this.ddResize.eventResize.subscribe(this.onResize, this, true);
	   }
	   
	   // Use the drag'n drop utility to make the container draggable
	   this.dd = new WireIt.util.DD(this.terminals,this.el);
	   
	   // Sets ddHandle as the drag'n drop handle
	   if(this.options.ddHandle) {
   	   this.dd.setHandleElId(this.ddHandle);
	   }
	   
	   // Mark the resize handle as an invalid drag'n drop handle and vice versa
	   if(this.options.resizable) {
   	    this.dd.addInvalidHandleId(this.ddResizeHandle);
      	this.ddResize.addInvalidHandleId(this.ddHandle);
	   }
   }
   
};

WireIt.Container.prototype = {
   
   /**
    * set the options
    * @method setOptions
    */
   setOptions: function(options) {
      
      /**
       * Main options object
       * <ul>
       *    <li>terminals: list of the terminals configuration</li>
       *    <li>draggable: boolean that enables drag'n drop on this container (default: true)</li>
       *    <li>className: CSS class name for the container element (default 'WireIt-Container')</li>
       *    <li>position: initial position of the container</li>
       *    <li>ddHandle: (only if draggable) boolean indicating we use a handle for drag'n drop (default true)</li>
       *    <li>ddHandleClassName: CSS class name for the drag'n drop handle (default 'WireIt-Container-ddhandle')</li>
       *    <li>resizable: boolean that makes the container resizable (default true)</li>
       *    <li>resizeHandleClassName: CSS class name for the resize handle (default 'WireIt-Container-resizehandle')</li>
       *    <li>width: initial width of the container (no default so it autoadjusts to the content)</li>
       *    <li>height: initial height of the container (default 100)</li>
       *    <li>close: display a button to close the container (default true)</li>
       *    <li>closeButtonClassName: CSS class name for the close button (default "WireIt-Container-closebutton")</li>
       *    <li>title: text that will appear in the module header</li>
       *    <li>icon: image url to be displayed in the module header</li>
       *    <li>preventSelfWiring: option to prevent connections between terminals of this same container (default true)</li>
       * </ul>
       * @property options
       * @type {Object}
       */
      this.options = {};
      this.options.terminals = options.terminals || [];
      this.options.draggable = (typeof options.draggable == "undefined") ? true : options.draggable ;
      this.options.position = options.position || [100,100];
      this.options.className = options.className || CSS_PREFIX+'Container';

      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? true : options.ddHandle;
      this.options.ddHandleClassName = options.ddHandleClassName || CSS_PREFIX+"Container-ddhandle";

      this.options.resizable = (typeof options.resizable == "undefined") ? true : options.resizable;
      this.options.resizeHandleClassName = options.resizeHandleClassName || CSS_PREFIX+"Container-resizehandle";

      this.options.width = options.width; // no default
      this.options.height = options.height;

      this.options.close = (typeof options.close == "undefined") ? true : options.close;
      this.options.closeButtonClassName = options.closeButtonClassName || CSS_PREFIX+"Container-closebutton";

      this.options.title = options.title; // no default
      
      this.options.icon = options.icon;
      
      this.options.preventSelfWiring = (typeof options.preventSelfWiring == "undefined") ? true : options.preventSelfWiring;
            
      this.domainid = options.domainid || "testdomain-1";
      
      this.nodeid = options.nodeid || "node-1-";
      
      this.nodeaddress = options.nodeaddress || "10.1.1.";
      
         
   },

   /**
    * Function called when the container is being resized.
    * It doesn't do anything, so please override it.
    * @method onResize
    */
   onResize: function(event, args) {
      var size = args[0];
      WireIt.sn(this.bodyEl, null, {width: (size[0]-10)+"px", height: (size[1]-44)+"px"});
   },

   /**
    * Render the dom of the container
    * @method render
    */
   render: function() {
   
 	    
      // Create the element
      this.el = WireIt.cn('div', {className: this.options.className});
   
      if(this.options.width) {
         this.el.style.width = this.options.width+"px";
      }
      if(this.options.height) {
         this.el.style.height = this.options.height+"px";
      }
   
      // Adds a handler for mousedown so we can notice the layer
    //  Event.addListener(this.el, "mousedown", this.onMouseDown, this, true);
   
      if(this.options.ddHandle) {
         // Create the drag/drop handle
      	this.ddHandle = WireIt.cn('div', {className: this.options.ddHandleClassName});
      	this.el.appendChild(this.ddHandle);
      	
         // Set title
         if(this.options.title) {
            this.ddHandle.appendChild( WireIt.cn('span', null, null, this.options.title) );
         }
         
       // Icon
         if (this.options.icon) {
            var iconCn = WireIt.cn('img', {src: this.options.icon, className: 'WireIt-Container-icon'});
            this.ddHandle.appendChild(iconCn);
         }
         
        // this.ddHandle.appendChild( WireIt.cn('span', null, null, 'icon'));

      }
   
      // Create the body element
      this.bodyEl = WireIt.cn('div', {className: "body"});
      this.el.appendChild(this.bodyEl);
   
      if(this.options.resizable) {
         // Create the resize handle
      	this.ddResizeHandle = WireIt.cn('div', {className: this.options.resizeHandleClassName} );
      	this.el.appendChild(this.ddResizeHandle);
      }
   
      if(this.options.close) {
         // Close button
         this.closeButton = WireIt.cn('div', {className: this.options.closeButtonClassName} );
         this.el.appendChild(this.closeButton);
         Event.addListener(this.closeButton, "click", this.onCloseButton, this, true);
      }
   
      // Append to the layer element
      this.layer.el.appendChild(this.el);
   
   	// Set the position
   	this.el.style.left = this.options.position[0]+ "px";
   	this.el.style.top = this.options.position[1]+"px";
   },

   /**
    * Sets the content of the body element
    * @method setBody
    * @param {String or HTMLElement} content
    */
   setBody: function(content) {
      if(typeof content == "string") {
         this.bodyEl.innerHTML = content;
      }
      else {
         this.bodyEl.innerHTML = "";
         this.bodyEl.appendChild(content);
      }
   },

   /**
    * Called when the user made a mouse down on the container and sets the focus to this container (only if within a Layer)
    * @method onMouseDown
    */
   onMouseDown: function() {
      if(this.layer) {
         if(this.layer.focusedContainer && this.layer.focusedContainer != this) {
            this.layer.focusedContainer.removeFocus();
         }
         this.setFocus();
         this.layer.focusedContainer = this;
      }
   },

   /**
    * Adds the class that shows the container as "focused"
    * @method setFocus
    */
   setFocus: function() {
      Dom.addClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Remove the class that shows the container as "focused"
    * @method removeFocus
    */
   removeFocus: function() {
      Dom.removeClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Called when the user clicked on the close button
    * @method onCloseButton
    */
   onCloseButton: function(e, args) {
      Event.stopEvent(e);
      this.layer.removeContainer(this);
   },

   /**
    * Remove this container from the dom
    * @method remove
    */
   remove: function() {
   
      // Remove the terminals (and thus remove the wires)
      this.removeAllTerminals();
   
      // Remove from the dom
      this.layer.el.removeChild(this.el);
      
      // Remove all event listeners
      Event.purgeElement(this.el);
   },


   /**
    * Call the addTerminal method for each terminal configuration.
    * @method initTerminals
    */
   initTerminals: function(terminalConfigs) {
      for(var i = 0 ; i < terminalConfigs.length ; i++) {
         this.addTerminal(terminalConfigs[i]);
      }
   },
   
   /*randomInRange: function(start, end) {
 
   start = Number(start); end = Number(end);
   return Math.round(start + Math.random() * (end - start));
 },*/
   
    randomInRange: function(start, end) {
  
     if (start > end) start++; else end++;
 	 return Math.floor((start + Math.random() * (end - start)));
 },
   
   getDirection: function(pos){
	 /*  if(pos >= 0 )
	   {
	   		return 1;
	   }
	   else
	   {
	   		return -1;
	   }*/
	  // alert('this.prev_terminal_direction: ' + this.prev_terminal_dir);
	 /*  if(this.prev_terminal_dir == null)
	   {
	   		alert('this.prev_terminal_dir: nuller  ' + this.prev_terminal_dir);
	   		if(pos >= 0 ){
	   			this.prev_terminal_dir = 1;
	   			return 1;
	   		}
	   		else
	   		{
	   			this.prev_terminal_dir = -1;
	   			return -1
	   		}
	   }
	   else
	   {
	   		alert('non null ' + this.prev_terminal_dir);
	   		if(this.prev_terminal_dir == 1)
	   		{
	   			this.prev_terminal_dir = -1;
	   			return -1;
	   		}
	   		else if(this.prev_terminal_dir == -1)
	   		{
	   			this.prev_terminal_dir = 1;
	   			return 1;
	   		}
	   }*/
	   
	   //decide the quadrant for trajectory 
	   
	  if(this.prev_terminal_dir_left == null && this.prev_terminal_dir_right == null)
	   {
	   		  this.prev_terminal_dir_left = 1;
	   		  this.prev_terminal_dir_right = 1;
	   		  return 1; 
	   }
	   else if(this.prev_terminal_dir_left == 1 && this.prev_terminal_dir_right == 1)
	   {
	   		  this.prev_terminal_dir_left = -1;
	   		  this.prev_terminal_dir_right = 1;
	   		  return 2; 
	   }
	   else if(this.prev_terminal_dir_left == 1 && this.prev_terminal_dir_right == 1)
	   {
	   		  this.prev_terminal_dir_left = -1;
	   		  this.prev_terminal_dir_right = 1;
	   		  return 2; 
	   }
	   else if(this.prev_terminal_dir_left == -1 && this.prev_terminal_dir_right == 1)
	   {
	   		  this.prev_terminal_dir_left = 1;
	   		  this.prev_terminal_dir_right = -1;
	   		  return 3; 
	   }
	   else if(this.prev_terminal_dir_left == 1 && this.prev_terminal_dir_right == -1)
	   {
	   		  this.prev_terminal_dir_left = -1;
	   		  this.prev_terminal_dir_right = -1;
	   		  return 4; 
	   }
	   else if(this.prev_terminal_dir_left == -1 && this.prev_terminal_dir_right == -1)
	   {
	   		  this.prev_terminal_dir_left = 1;
	   		  this.prev_terminal_dir_right = 1;
	   		  return 1; 
	   }
	   
	  // return 1;
	   
	   
	   
	   
	   
	/*  var dir  = this.randomInRange(0,1);
	  
	  if(dir == 0)
	  {
	  	 return -1;	
	  }
	  return dir;*/
   },
   
   initPorts: function(no_of_ports)
   {
   		for(var i=0;i < no_of_ports;i++)
   		{
   			this.addPort();			
	   	}
   
   },
   
   
   //inline modulus ports to provide an interface like 
   inLineModPorts:function()
   { 		
   		
   		if(this.terminals.length % 5 != 0)
   		{
			// port is still under the same line of the interface
		
		  	var last_created_port_indx = this.terminals.length - 1; 
		 
		 	var portPositionOffset = [];
		  	
		    var portOptions = {};
		      		
    			
			var prev_port = this.terminals[last_created_port_indx];
			
			portOptions = prev_port.options;

			
			var portPosition = portOptions.offsetPosition;
			
			
			portPositionOffset[0] = portPosition['left'];    			
			
			portPositionOffset[1] = portPosition['top'];
    					   
		    //get the xy of the port
								
		    portPositionOffset[1] += 20;	
		  
			
		    return portPositionOffset;	
		
   		}
   		else
   		{  			
   			//the first port or a new line in the port interface
   			
   			//alert('no the length is greater than 5 or 0');
   			
   			var elemPos = [];
   			
   		    elemPos = Dom.getXY(this.el);
   		
   			if(this.terminals.length == 0)
   			{
   				
   				elemPos[0] = 0;
   				elemPos[1] = 2;
   				return elemPos;
   			}
   			else
   			{
   			   	var nextPortPositionFactor = this.terminals.length / 5;
   				
   				nextPortPositionFactor = 20; 
   				
	 		  	var last_created_port_indx = this.terminals.length - 1; 
		 
			 	var portPositionOffset = [];
		  	
			    var portOptions = {};
		      		
    			
				var prev_port = this.terminals[last_created_port_indx];
			
				portOptions = prev_port.options;

   				
   			    var portPosition = portOptions.offsetPosition;
			
				
			
				portPositionOffset[0] = portPosition['left'];    			
			
				portPositionOffset[1] = 2;
    				
   				portPositionOffset[0] += nextPortPositionFactor;
   				
   				return portPositionOffset;    			
   			}
   				  
   		}
   				   	
   },
   
   addPort:function()
   {
   		//add a port on demand to the node
   		
   		var defaultPort = {"direction": [1,1], "offsetPosition": {'left': 0, 'top': 0 }, "name": 'port'};
   		
   		var actualPortPosition = [];
   		
   		actualPortPosition = this.inLineModPorts();
   		
   		defaultPort.offsetPosition.left = actualPortPosition[0];//this.randomInRange(-30, 30);
   		
   		defaultPort.offsetPosition.top = actualPortPosition[1]; //this.randomInRange(-30, 30);
   		   		
   		var port_dir_quad_code =  this.getDirection(defaultPort.offsetPosition.left); 		
   		
   		if(port_dir_quad_code == 1)
   		{
   			defaultPort.direction = [1, 1]; 
   		}
   		else if(port_dir_quad_code == 2)
   		{
   			defaultPort.direction = [-1, 1];
   		}
   		else if(port_dir_quad_code == 3)
   		{
   			defaultPort.direction = [1, -1];
   		}
   		else if(port_dir_quad_code == 4)
   		{
   			defaultPort.direction = [-1, -1];
   		}
 
   		
   		
   		//defaultPort.direction = [port_dir_left, port_dir_left];
   		
   		defaultPort.name += this.terminals.length + 1;   
   		
   		 
   		this.addTerminal(defaultPort);
   },
   


   /**
    * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
    * @method addTerminal
    * @return {WireIt.Terminal}  terminal Created terminal
    */
   addTerminal: function(terminalConfig) {
   
      // Terminal type
      var type = eval(terminalConfig.xtype || "WireIt.Terminal");
   
      // Instanciate the terminal
      var term = new type(this.el, terminalConfig, this);	
	
	  var obj_term_info =new Array();
	  obj_term_info[0] = term;
	  obj_term_info[1] = terminalConfig; 
	
	
   	  Event.addListener(term.el,"click", this.onTerminalClick, obj_term_info, this);
      
      // Add the terminal to the list
      this.terminals.push( term );
      
      // Event listeners
      term.eventAddWire.subscribe(this.onAddWire, this, true);
      term.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
      return term;
   },
   
   /**
    * show up terminal properties and save them once entered
    *  
    */

	onTerminalClick: function(e ,obj_term_info) 
	{
			//select the port clicked on
			
			obj_term_info[0].setDropInvitation(true);
		
			var nel_properties = YAHOO.util.Dom.get('nelem');
			
			//first check whether there are any children of the box for net el properties
			
			if(this.hasChildElems(nel_properties))
			{	
					//just before deleting capture all the property info of the specific net el
					
					//alert("this.layer.prevSelectedNetEl" + this.layer.prevSelectedNetEl);
					
					
					var typeof_netel  = this.layer.getNetELType(this.layer.prevSelectedNetEl); 
					
					//alert("typeof netel from container: " + typeof_netel);
					
					
					if(typeof_netel == "Terminal")
					{
						//first turn off the previous port selection
						
						this.layer.prevSelectedNetEl.setDropInvitation(false);
						
						var prev_term = this.layer.prevSelectedNetEl;
						
					
						
						updated_values = prev_term.neleProperties.getValue();
						
				
						
						if(updated_values["portID"] == "" || updated_values["capacity"] == "" || updated_values["maxResCapacity"] == "" || updated_values["minResCapacity"] == "" || updated_values["granularity"] == "") 
						{
							alert("property values for the previously selected component is null. Please define the properties");
						
					    	return;
						}
												 
					 	//save all the values of the properties edited in the net el properties for the previously selected net el.
					 
					 	this.layer.prevSelectedNetEl.portID = updated_values["portID"];
					 	this.layer.prevSelectedNetEl.Capacity = updated_values["capacity"];
					 	this.layer.prevSelectedNetEl.maxResCapacity = updated_values["maxResCapacity"];
					 	this.layer.prevSelectedNetEl.minResCapacity = updated_values["minResCapacity"];
					 	this.layer.prevSelectedNetEl.granularity = updated_values["granularity"];
					 	
						
					}
					else if (typeof_netel == "Container")
					{
						updated_values = this.layer.prevSelectedNetEl.nelProperties.getValue();
												
					
						if(updated_values["domainid"] == "" || updated_values["nodeid"] == "" || updated_values["nodeaddress"] == "") 
						{
							alert("property values for the previously selected component is null. Please define the properties");
							return;
						}
											 
						 //save all the values of the properties edited in the net el properties for the previously selected net el.
				 
					 	this.layer.prevSelectedNetEl.domainid = updated_values["domainid"];
				 		this.layer.prevSelectedNetEl.nodeid = updated_values["nodeid"];
				 		this.layer.prevSelectedNetEl.nodeaddress = updated_values["nodeaddress"];	
						
						
					}
					else if(typeof_netel == "Connector")
					{
						updated_values = this.layer.prevSelectedNetEl.nelProperties.getValue();
						
						if(updated_values["linkid"] == "" || updated_values["trafficEngineeringMetric"] == "" || updated_values["encodingType"] == "" || updated_values["interfaceMTU"] == "" || updated_values["vlanRangeAvailability"] == "" ) 
						{
							alert("One or more of the property values for the previously selected connector is not defined. Please define all the properties");
							return;
						}											 
						 //save all the values of the properties edited in the net el properties for the previously selected net el.
					 
					 	this.layer.prevSelectedNetEl.linkid = updated_values["linkid"];
					 	this.layer.prevSelectedNetEl.remoteLinkId = updated_values["remoteLinkId"];
					 	this.layer.prevSelectedNetEl.trafficEngineeringMetric = updated_values["trafficEngineeringMetric"];
					 	this.layer.prevSelectedNetEl.switchingcapType = updated_values["switchingcapType"];
					 	this.layer.prevSelectedNetEl.encodingType = updated_values["encodingType"];
					 	this.layer.prevSelectedNetEl.capability = updated_values["capability"];
					 	this.layer.prevSelectedNetEl.interfaceMTU = updated_values["interfaceMTU"];
					 	this.layer.prevSelectedNetEl.vlanRangeAvailability = updated_values["vlanRangeAvailability"];			 		
				
					}
	
					//then delete all the children to load some new net el properties 
					
					while ( nel_properties.childNodes.length >= 1 )
				    {
    					nel_properties.removeChild( nel_properties.firstChild );       
					}
				   				  
						
			}
		
					
			var parent_box = WireIt.cn('div', {className: "Nel-Selection-Text-Highlight"});
			
			nel_properties.appendChild(parent_box);
			
			nel_properties.appendChild(WireIt.cn('br', null, null));
				
			parent_box.appendChild(WireIt.cn('span', null, null, obj_term_info[1].name + " Properties:"));
			
			   
	
			
				this.nelpropertiesFields =  [
				
				{"type": "string", inputParams: {"name": "portID", "id": "portID",label: "PortID", value: obj_term_info[0].portID } },
				{"type": "string", inputParams: {"name": "capacity", "id": "cap",label: "Capacity", value: obj_term_info[0].Capacity } },
				{"type": "string", inputParams: {"name": "maxResCapacity", "id": "maxcap", label: "maxResCap", value: obj_term_info[0].maxResCapacity } },
				{"type": "string", inputParams: {"name": "minResCapacity", "id": "mincap", label: "minResCap", value: obj_term_info[0].minResCapacity } },
				{"type": "string", inputParams: {"name": "granularity", "id": "gran", label: "Granularity", value: obj_term_info[0].granularity } }
		 		
		 		];
				
								
						
			
    		this.neleProperties = new inputEx.Group({
     		parentEl: YAHOO.util.Dom.get('nelem'),
		    fields: this.nelpropertiesFields
   			});

			//YAHOO.util.Dom.setStyle(this.neleProperties, 'height', '100%');
			//YAHOO.util.Dom.setStyle(this.neleProperties, 'overflow', 'scroll');
			
				
			this.eventTerminalSelection.fire(this);
			
				
			
			this.neleProperties.updatedEvt.subscribe(function() {
				this.eventChangedNetElemProps.fire(this);
				}, this, true);
				
			   // this.currentSelectedTerminal = 	obj_term_info[0];	
				
				obj_term_info[0].neleProperties = this.neleProperties; 
				 
				this.layer.prevSelectedNetEl = obj_term_info[0]; 
				 
							
			// NMWG_Domain_Prefix	
	
	},
	
	
hasChildElems: function(ele)
{ 
	var hasChildElements, child;
	hasChildElements = false;
	for (child = ele.firstChild;child;child = child.nextSibling) 
	{
    	if (child.nodeType == 1) 
    	{ // 1 == Element
        	hasChildElements = true;
        	return hasChildElements;
    	}
	}
	return hasChildElements;  
}, 
	
		
   /**
    * This method is called when a wire is added to one of the terminals
    * @method onAddWire
    * @param {Event} event The eventAddWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         this.eventAddWire.fire(wire);
      } 
   },

   /**
    * This method is called when a wire is removed from one of the terminals
    * @method onRemoveWire
    * @param {Event} event The eventRemoveWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.eventRemoveWire.fire(wire);
         this.wires[index] = null;
      }
      this.wires = WireIt.compact(this.wires);
   },

   /**
    * Remove all terminals
    * @method removeAllTerminals
    */
   removeAllTerminals: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].remove();
      }
      this.terminals = [];
   },
   
   /** @B@S
    * Remove specific terminal
    */
    removeTerminal: function(term) { 
    	
    	var term_index = WireIt.indexOf(term, this.terminals);
    	
    	if(term_index != -1)
    	{
    		//may fire an event change if needs be in the future
    		this.terminals[term_index] = null;
    	}
    	else
    	{
    		alert("Error: Terminal delete")
    	}
    	this.terminals = WireIt.compact(this.terminals);
    },
    

   /**
    * Redraw all the wires connected to the terminals of this container
    * @method redrawAllTerminals
    */
   redrawAllWires: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].redrawAllWires();
      }
   },

   /**
    * Return the config of this container.
    * @method getConfig
    */
   getConfig: function() {
      var obj = {};
   
      // Position
      obj.position = Dom.getXY(this.el);
      if(this.layer) {
         // remove the layer position to the container position
         var layerPos = Dom.getXY(this.layer.el);
         obj.position[0] -= layerPos[0];
         obj.position[1] -= layerPos[1];
         // add the scroll position of the layer to the container position
         obj.position[0] += this.layer.el.scrollLeft;
         obj.position[1] += this.layer.el.scrollTop;
      }
   
      // xtype
      if(this.options.xtype) {
         obj.xtype = this.options.xtype;
      }
   
      return obj;
   },
   
   /**
    * Subclasses should override this method.
    * @method getValue
    * @return {Object} value
    */
   getValue: function() {
   
   
   var obj = {};
   
   obj.domainid = this.domainid;
   obj.nodeid  = this.nodeid;   
   obj.nodeaddress = this.nodeaddress;
   
   
   var portInfo;
   portInfo = this.makePorts();
   obj.portInfo = portInfo;
   
 /*  for(var i = 0; i< obj.portInfo.length; i++)
   {
   		alert('port['+ i + ']  Capacity = ' + obj.portInfo[i].Capacity +  ' maxResCapacity = ' + obj.portInfo[i].maxResCapacity);
   }*/
   
   return obj;
   },

   /**
    * Subclasses should override this method.
    * @method setValue
    * @param {Any} val Value 
    */
   setValue: function(val) {
   
   this.domainid = val.domainid;
   this.nodeid  = val.nodeid;
   this.nodeaddress = val.nodeaddress;
   
   var term;
   
   for(var i = 0 ; i < this.terminals.length ; i++) 
   {   
   		term = this.terminals[i];
   	 	
   	 	//alert('in portinfo');
   	 	
   	 	var valports_undefined = (typeof val.portInfo[i] == "undefined") ? true : false ;
   	 	
   	 	//alert(valports_undefined);
   	 	
   	 	if(!valports_undefined && val.portInfo[i] != null && val.portInfo[i] != "")
   	 	{
   	 		term.options.name = val.portInfo[i].portName;
   	 		term.portID =  val.portInfo[i].portID;
			term.Capacity = val.portInfo[i].Capacity;
			term.maxResCapacity = val.portInfo[i].maxResCapacity;
			term.minResCapacity = val.portInfo[i].minResCapacity;
			term.granularity = val.portInfo[i].granularity;   	
		}	
   }
   
 },
   
   /**
    * @method makePort Objects to save
    */
    makePorts: function()
    {
    	
 		var portInfo = new Array();
 			   	
    	var term;
    
      	for(var i = 0 ; i < this.terminals.length ; i++) 
      	{
        	 term = this.terminals[i];
        	
        	 var port = {};
        	 
        	 
        	 port.portName = term.options.name;
        	 port.portID = term.portID;
        	 port.Capacity = term.Capacity;
        	 port.maxResCapacity = term.maxResCapacity;
        	 port.minResCapacity = term.minResCapacity;
        	 port.granularity = term.granularity;
        	         	 
     		 portInfo[i] = port;
        	
		} 
		
		return portInfo;   	
    
    },
   
   
   /**
    * @method getTerminal
    */
   getTerminal: function(name) {
      var term;
      for(var i = 0 ; i < this.terminals.length ; i++) {
         term = this.terminals[i];
         if(term.options.name == name) {
            return term;
         }
      }
      return null;
   }

};

})();