(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

/**
 * Module Proxy handle the drag/dropping from the module list to the layer (in the WiringEditor)
 * @class ModuleProxy
 * @constructor
 * @param {HTMLElement} el
 * @param {WireIt.WiringEditor} WiringEditor
 */
WireIt.ModuleProxy = function(el, WiringEditor) {
   
   this._WiringEditor = WiringEditor;
   
   // Init the DDProxy
   WireIt.ModuleProxy.superclass.constructor.call(this,el, "module", {
        dragElId: "dragmoduleProxy"
    });
    
    //this.lock();
    
    this.isTarget = false; 
};
YAHOO.extend(WireIt.ModuleProxy,YAHOO.util.DDProxy, {
   
   /**
    * copy the html and apply selected classes
    * @method startDrag
    */
   startDrag: function(e) {
      WireIt.ModuleProxy.superclass.startDrag.call(this,e);
       var del = this.getDragEl(),
	   lel = this.getEl();
       del.innerHTML = lel.innerHTML;
       del.className = lel.className;
   },
   
   /**
    * Override default behavior of DDProxy
    * @method endDrag
    */
   endDrag: function(e) {},
    
   /**
    * Add the module to the WiringEditor on drop on layer
    * @method onDragDrop
    */
   onDragDrop: function(e, ddTargets) { 
      // The layer is the only target :
      var layerTarget = ddTargets[0],
			 layer = ddTargets[0]._layer,
			 del = this.getDragEl(),
			 pos = YAHOO.util.Dom.getXY(del),
			 layerPos = YAHOO.util.Dom.getXY(layer.el);
      this._WiringEditor.addModule( this._module ,[pos[0]-layerPos[0]+layer.el.scrollLeft, pos[1]-layerPos[1]+layer.el.scrollTop]);
    }
   
});


/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @constructor
 * @param {Object} options
 */
WireIt.WiringEditor = function(options) {
	
	 /**
	  * Hash object to reference module definitions by their name
	  * @property modulesByName
	  * @type {Object}
	  */
    this.modulesByName = {};

    // set the default options
    this.setOptions(options);

    
    this.topoFormatContent = null;
    
    /**
     * Container DOM element
     * @property el
     */
    this.el = Dom.get(options.parentEl);
   // alert(this.el.name);
    
   
    
    /**
     * @property helpPanel
     * @type {YAHOO.widget.Panel}
     */
    this.helpPanel = new widget.Panel('helpPanel', {
        fixedcenter: true,
        draggable: true,
        visible: false,
        modal: false
     });
     this.helpPanel.setBody("For help on the usage of topology wizard, please refer to the \n documentation which came along with the application bundle \n or \n you can also look it up on the online help available on google code");
     //@B@S
     this.helpPanel.render(this.el);
	//@B@E
    
    /**
     * @property layout
     * @type {YAHOO.widget.Layout}
     */
    this.layout = new widget.Layout(this.el, this.options.layoutOptions);
    this.layout.render();

	//this.renderTopologyToolsAccordion();

	 // Right accordion
    this.renderAccordion();

    //tabs 
    
       this.tabViews = new YAHOO.widget.TabView("center");
	    
	   this.graphTab = new YAHOO.widget.Tab( {
			label : 'Topology View',
			contentEl : Dom.get("graphView")
	    });
	    
	    this.formatTab = new YAHOO.widget.Tab( {
	    	active : false,
			label : 'Topology Format',
			contentEl : Dom.get("topoFormatView")
	    });

		var h= 800;
		YAHOO.util.Dom.setStyle('tabViews', 'height', h + 'px'); 

		this.tabViews.addTab(this.graphTab);
	    this.tabViews.addTab(this.formatTab);
	
	    this.tabViews.selectTab(0);
	  
	 	
		this.formatTab.addListener("click", this.loadTopologyFormatView);
		this.graphTab.addListener("click", this.loadGraphView);
		
    
   
    
    /**
     * @property layer
     * @type {WireIt.Layer}
     */
     
   // var gv =  Dom.get('graphView');
     
     
    this.layer = new WireIt.Layer(this.options.layerOptions);
	this.layer.eventChanged.subscribe(this.onLayerChanged, this, true);
	this.layer.eventTerminalSelectionReFire.subscribe(this.onEventTerminalSelection, this, true);
	this.layer.eventRemovePropertiesPanel.subscribe(this.onRemovePropertiesPanel, this, true); 
	
	//@B@S
    this.layer.eventNodeSelection.subscribe(this.onEventTerminalSelection, this, true);
   //@B@E
	

//	gv.appendChild(this.layer);
	
	 /**
	  * @property leftEl
	  * @type {DOMElement}
	  */
   // this.leftEl = Dom.get('left');
    
     //left accordion
	 this.renderNetElementToolsAccordion();
    
    this.topo_netel_dd_pane =  Dom.get('nelem-dragdrop-pane');
    
 	this.topo_netel_actions_pane = Dom.get('nelem-actions');
 
 
    // Render module list
    this.buildModulesList();
    
    this.buildNetelActions();


	
    // Render buttons
    this.renderButtons();

 	 // Saved status
	 this.renderSavedStatus();

    // Properties Form
    this.renderPropertiesForm();

	 // LoadWirings
	 if( this.adapter.init && YAHOO.lang.isFunction(this.adapter.init) ) {
			this.adapter.init();
 	 }
	 this.load();
	 
	 this.importHandler = new WireIt.ImportAdapter(this);
	 Event.onDOMReady(this.importHandler.init, this.importHandler,true);
	//Event.onAvailable('bd', this.importHandler.init, null, this.importHandler);
	 
};

WireIt.WiringEditor.prototype = {

/**
 * @method loadtopoFormatView
 * @param
 */


loadingMessage : function(msgString){
	//alert("hello");
		return "<div style=\"margin:auto;text-align:center;\"><img src=images/loading.gif /><br>"+ msgString + "... </div>";
},

onEventTerminalSelection: function(){
	this.accordionView.openPanel(0);
	this.netEltoolAccordionView.openPanel(1);
},

onRemovePropertiesPanel: function()
{
	this.accordionView.closePanel(0);
	this.netEltoolAccordionView.closePanel(1);
}, 

loadGraphView: function()
{


},

clearFormatViewOnNew:function()
{

/*Code to remove all the elements in the format view */
 
	//get graph container

	var parent = YAHOO.util.Dom.get("topoFormatView");
 
	//remove child elements if present

	(parent.hasChildNodes() != true) ? null: removeChildren();

		function removeChildren() 
		{
	
			var children = YAHOO.util.Dom.getChildren("topoFormatView");

			for(prop in children) 
			{
				parent.removeChild(children[prop]);
			
			}
	
		}

},


loadTopologyFormatView: function()
{
	//alert('nml view');
	
	if(this.isSaved())
	{
	
		var formatView	 = Dom.get("topoFormatView");
		
		if(!formatView.hasChildNodes())
		{
				var nml_divEl = document.createElement('div');//WireIt.cn('div', {className: "NML-Layer"});
				//	var msgString = "Loading Transformed NML now";
	 			//   var msgEL = "<div style=\"margin:auto;text-align:center;\"><img src='/images/loading.gif'/><br>"+ msgString + "... </div>";
		
				//	nml_divEl.innerHTML = msgEL;
	
				 nml_divEl.innerHTML = this.topoFormatContent;
		
				 Dom.get("topoFormatView").appendChild(nml_divEl);
		}
	
   }
},



 /**
  * @method setOptions
  * @param {Object} options
  */
 setOptions: function(options) {
    
    /**
     * @property options
     * @type {Object}
     */
    this.options = {};
    
    // Load the modules from options
    this.modules = options.modules || [];
    for(var i = 0 ; i < this.modules.length ; i++) {
       var m = this.modules[i];
       this.modulesByName[m.name] = m;
    }
	

	 this.adapter = options.adapter;   
     	
	 
	  
    this.options.languageName = options.languageName || 'anonymousLanguage';
    
    this.options.propertiesFields = options.propertiesFields || [
		{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter topology name" } },
		{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30, rows: 4} }
	 ];
    
    this.options.layoutOptions = options.layoutOptions || {
	 	units: [
	      { position: 'bottom', height: 70, body: 'top', collapse: true, collapseSize: 25, header: 'Topology Control Pane', animate: true},
	      { position: 'left', width: 200, resize: true, body: 'left', gutter: '5px', collapse: true, 
	        collapseSize: 25, header: 'Topology Tools Pane', /*scroll: true,*/ animate: true },
	      { position: 'center', body: 'center', gutter: '5px' },
	      { position: 'right', width: 320, resize: true, body: 'right', gutter: '5px', collapse: true, 
	        collapseSize: 25, header: 'Topology Details Pane', /*scroll: true,*/ animate: true   
          }
	   ]
	};
     
    this.options.layerOptions = {};
    var layerOptions = options.layerOptions || {};
    this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('graphView');
    this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
    this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || { parentEl: 'layerMap' };

	 this.options.accordionViewParams = options.accordionViewParams || {
												collapsible: true, 
												expandable: true, // remove this parameter to open only one panel at a time
												width: '308px', 
												expandItem: 1,
												animationSpeed: '0.3', 
												animate: true, 
												scroll: true,
												effect: YAHOO.util.Easing.easeBothStrong
											};
											
	this.options.netElAccordionViewParams = {   collapsible: true, 
												expandable: true, // remove this parameter to open only one panel at a time
												width: '190px', 
												expandItem: 0,
												animationSpeed: '0.3', 
												animate: true, 
												scroll: true,
												effect: YAHOO.util.Easing.easeBothStrong
											};										
 },

	
	/**
	 * Render the accordion using yui-accordion
  	 */
	renderAccordion: function() {
		this.accordionView = new YAHOO.widget.AccordionView('accordionView', this.options.accordionViewParams);
		//YAHOO.util.Dom.setStyle(this.accordionView, 'height', '100%');
		//YAHOO.util.Dom.setStyle(this.accordionView, 'overflow', 'scroll');
	},
	
	renderNetElementToolsAccordion: function() { 
	
		this.netEltoolAccordionView = new YAHOO.widget.AccordionView('netEltoolView', this.options.netElAccordionViewParams);
	
	},
 
 /**
  * Render the properties form
  * @method renderPropertiesForm
  */
 renderPropertiesForm: function() {
    this.propertiesForm = new inputEx.Group({
       parentEl: YAHOO.util.Dom.get('propertiesForm'),
       fields: this.options.propertiesFields
    });

	this.propertiesForm.updatedEvt.subscribe(function() {
		this.markUnsaved();
	}, this, true);
 },

 
 /**
  * Build the left menu on the left
  * @method buildModulesList
  */
 buildModulesList: function() {

     var modules = this.modules;
     for(var i = 0 ; i < modules.length ; i++) {
		  this.addModuleToList(modules[i]);
     }

     // Make the layer a drag drop target
     if(!this.ddTarget) {
       this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
       this.ddTarget._layer = this.layer;
     }
     
 },
 
 /**
 *
 * 
 */

buildNetelActions: function() {

     // Create the overlay DOM element   

    var actions_parent_div	 = Dom.get('nelem-actions');
    
    //actions_parent_div.appendChild( WireIt.cn('br', null, null, null) );

	 var addTerminalButt = new YAHOO.widget.Button({  
                               label:"Add Port",  
	                            id:"addTerminalButton",  
	                            container:actions_parent_div });
	 
    var deleteTerminalButt = new YAHOO.widget.Button({  
                               label:"Delete port",  
	                            id:"deleteTerminalButton",  
	                            container:actions_parent_div });
	                                                       
		                            
   
   //newButton.on("click", this.onNew, this, true);


    addTerminalButt.on("click",this.onAddTerminalButtonClick, this, true );

	deleteTerminalButt.on("click", this.onDeleteTerminalButtonClick, this, true); 
	
	
	//actionParentContainer.appendChild(addTerminalButt);
	
    //actionParentContainer.appendChild(deleteTerminalButt);                          
		
	 	
	//this.topo_netel_actions_pane.appendChild(actionParentContainer);
		
},


onAddTerminalButtonClick: function(e) {

   this.layer.addContainerTerminal(); 

},

onDeleteTerminalButtonClick: function(e) {

    this.layer.deleteContainerTerminal();

},



 /**
  * Add a module definition to the left list
  */
 addModuleToList: function(module) {
	
		var div = WireIt.cn('div', {className: "WiringEditor-module"});
      if(module.container.icon) {
         div.appendChild( WireIt.cn('img',{src: module.container.icon}) );
      }
      div.appendChild( WireIt.cn('span', null, null, module.name) );

      var ddProxy = new WireIt.ModuleProxy(div, this);
      ddProxy._module = module;

	 //this.leftEl.appendChild(div);
	      
     this.topo_netel_dd_pane.appendChild(div);
          
 },
 
 /**
  * add a module at the given pos
  */
 addModule: function(module, pos) {
    try {
       var containerConfig = module.container;
       containerConfig.position = pos;
       containerConfig.title = module.name;
       var container = this.layer.addContainer(containerConfig);
       Dom.addClass(container.el, "WiringEditor-module-"+module.name);
    }
    catch(ex) {
       this.alert("Error Layer.addContainer: "+ ex.message);
    }    
 },

 /**
  * Toolbar
  * @method renderButtons
  */
 renderButtons: function() {
    var toolbar = Dom.get('toolbar');
    // Buttons :
    var newButton = new widget.Button({ label:"New", id:"WiringEditor-newButton", container: toolbar });
    newButton.on("click", this.onNew, this, true);

    var loadButton = new widget.Button({ label:"Load", id:"WiringEditor-loadButton", container: toolbar });
    loadButton.on("click", this.load, this, true);

    var saveButton = new widget.Button({ label:"Save", id:"WiringEditor-saveButton", container: toolbar });
    saveButton.on("click", this.onSave, this, true);

	var exportButton = new widget.Button({ label:"Export", id:"WiringEditor-exportButton", container: toolbar });
    exportButton.on("click", this.onExport, this, true);
		
	var importButton = new widget.Button({ label:"Import", id:"WiringEditor-importButton", container: toolbar });
    //importButton.on("click", this.onImport, this, true);
	
    var helpButton = new widget.Button({ label:"Help", id:"WiringEditor-helpButton", container: toolbar });
    helpButton.on("click", this.onHelp, this, true);
    
    var deleteButton = new widget.Button({ label:"Delete", id:"WiringEditor-deleteButton", container: toolbar });
    deleteButton.on("click", this.onDelete, this, true);
    
 },

	/**
	 * @method renderSavedStatus
	 */
	renderSavedStatus: function() {
		var top = Dom.get('top');
		this.savedStatusEl = WireIt.cn('div', {className: 'savedStatus', title: 'Not saved'}, {display: 'none'}, "*");
		top.appendChild(this.savedStatusEl);
	},
	
	onExport:function()
	{
		
		var value = this.getValue();
     
    	if(value.name != "") 
    	{
		
			var format_wnd = YAHOO.util.Dom.get("topoFormatView");
 
			if(this.isSaved() && format_wnd.hasChildNodes() == true)
			{
				var url='/' + value.name + '.nmwg'; 
					
			    downloadWindow = window.open(url,'Download');
							
			} 
		
		}		
			
	},
	
	onImport:function()
	{
		var importhandlr = this.importHandler.getImportPanelsInstance();
		importhandlr.show();
	},
		

 /**
  * save the current module
  * @method saveModule
  */
 saveModule: function() {
 	
 	if(this.layer.prevSelectedNetEl != null)
 	{
		 	var typeof_netel  = this.layer.getNetELType(this.layer.prevSelectedNetEl);
		 	
		 	var updated_values;
					
				if(typeof_netel == "Terminal")
				{
					//first remove the selection from the port
					
					this.layer.prevSelectedNetEl.setDropInvitation(false);
					
					updated_values = this.layer.prevSelectedNetEl.neleProperties.getValue();
					
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
					updated_values = this.layer.nelProperties.getValue();
					
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
					
					if(updated_values["linkid"] == "" || updated_values["remoteLinkId"] == "" || updated_values["trafficEngineeringMetric"] == "" || updated_values["encodingType"] == "" || updated_values["interfaceMTU"] == "" || updated_values["vlanRangeAvailability"] == "" ) 
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
 	
 	}
 	//this.layer.prevSelectedNetEl = null;
      
    var value = this.getValue();
    
    if(value.name == "") {
       this.alert("Please choose a name for the topology");
      // var accord = Dom.get('accordionView'');
      // accord.openPanel(0);
       return;
    }

	this.tempSavedWiring = {name: value.name, working: JSON.stringify(value.working), language: this.options.languageName, topoFormat: value.topoFormat};
     
//	alert(' ' + this.tempSavedWiring.working);

	//this.adapter = WireIt.WiringEditor.adapters.Ajax;
		
           
    this.adapter.saveWiring(this.tempSavedWiring, {
       success: this.saveModuleSuccess,
       failure: this.saveModuleFailure,
       scope: this
    });

 },

 /**
  * saveModule success callback
  * @method saveModuleSuccess
  */
 saveModuleSuccess: function(o) {

	this.markSaved();

   this.alert(" Topology Saved ");
   
   //load the formatTab's window with the Topo Description Format received
   
   this.topoFormatContent = o;
   
   this.loadTopologyFormatView(); 
   

	// TODO:
	/*var name = this.tempSavedWiring.name;	
	if(this.modulesByName.hasOwnProperty(name) ) {
		//already exists
	}
	else {
		//new one
	}*/
	
 },

 /**
  * saveModule failure callback
  * @method saveModuleFailure
  */
 saveModuleFailure: function(errorStr) {
    this.alert("Unable to save the wiring : "+errorStr);
 },

	alert: function(txt) {
		if(!this.alertPanel){ this.renderAlertPanel(); }
		Dom.get('alertPanelBody').innerHTML = txt;
		this.alertPanel.show();
	},

 /**
  * Create a help panel
  * @method onHelp
  */
 onHelp: function() {
    this.helpPanel.show();
 },

 /**
  * @method onNew
  */
 onNew: function() {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	this.preventLayerChangedEvent = true;
	
   this.layer.clear(); 

   this.propertiesForm.clear(false); // false to tell inputEx to NOT send the updatedEvt

	this.clearFormatViewOnNew();

	this.markSaved();
	
	this.preventLayerChangedEvent = false;
 },

 /**
  * @method onDelete
  */
 onDelete: function() {
    if( confirm("Are you sure you want to delete this topology ?") ) {
       
      var value = this.getValue();
 		this.adapter.deleteWiring({name: value.name, language: this.options.languageName},{
 			success: function(result) {
				this.onNew();
 				this.alert("Topology Deleted !");
 			},
			failure: function(errorStr) {
				this.alert("Unable to delete topology: "+errorStr);
			},
			scope: this
 		});
       
    }
 },

 /**
  * @method onSave
  */
 onSave: function() {
    this.saveModule();
 },

 /**
  * @method renderLoadPanel
  */
 renderLoadPanel: function() {
    if( !this.loadPanel) {
       this.loadPanel = new widget.Panel('WiringEditor-loadPanel', {
          fixedcenter: true,
          draggable: true,
          width: '500px',
          visible: false,
          modal: true
       });
       this.loadPanel.setHeader("Select the topology to load");
       this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");
       this.loadPanel.cfg.setProperty("underlay","matte");
       this.loadPanel.render(document.body);

       
		// Listen the keyup event to filter the module list
		Event.onAvailable('loadFilter', function() {
			Event.addListener('loadFilter', "keyup", this.inputFilterTimer, this, true);
		}, this, true);

    }
 },

	/**
	 * Method called from each keyup on the search filter in load panel.
	 * The real filtering occurs only after 500ms so that the filter process isn't called too often
	 */
	inputFilterTimer: function() {
		if(this.inputFilterTimeout) {
			clearTimeout(this.inputFilterTimeout);
			this.inputFilterTimeout = null;
		}
		var that = this;
		this.inputFilterTimeout = setTimeout(function() {
				that.updateLoadPanelList(Dom.get('loadFilter').value);
		}, 500);
	},


 /**
  * @method updateLoadPanelList
  */
 updateLoadPanelList: function(filter) {
	
    var list = WireIt.cn("ul");
    if(lang.isArray(this.pipes)) {
       for(var i = 0 ; i < this.pipes.length ; i++) {
          var module_info = this.pipes[i];
          
          var temp_mod_info;
          
          this.pipesByName[module_info[0].name] = module_info;
          if(!filter || filter == "" || module_info[0].name.match(new RegExp(filter,"i")) ) {
	          list.appendChild( WireIt.cn('li',null,{cursor: 'pointer'},module_info[0].name) );
			}
       }
    }
    var panelBody = Dom.get('loadPanelBody');
    panelBody.innerHTML = "";
    panelBody.appendChild(list);

    Event.addListener(list, 'click', function(e,args) {
    	this.loadPipe(Event.getTarget(e).innerHTML);
    }, this, true);

 },

 /**
  * @method load
  */
 load: function() {
    
    this.adapter.listWirings({language: this.options.languageName},{
			success: function(result) {
				this.onLoadSuccess(result);
			},
			failure: function(errorStr) {
				this.alert("Unable to load the previously saved topologies: "+errorStr);
			},
			scope: this
		}
		);

 },

 /**
  * @method onLoadSuccess
  */
 onLoadSuccess: function(wirings) {
 	
 
		this.pipes = wirings;
		this.pipesByName = {};
		
		this.renderLoadPanel();
    	this.updateLoadPanelList();

		if(!this.afterFirstRun) {
			var p = window.location.search.substr(1).split('&');
			var oP = {};
			for(var i = 0 ; i < p.length ; i++) {
				var v = p[i].split('=');
				oP[v[0]]=window.decodeURIComponent(v[1]);
			}
			this.afterFirstRun = true;
			if(oP.autoload) {
				this.loadPipe(oP.autoload);
				return;
			}
		}

    this.loadPanel.show();
	},

 /**
  * @method getPipeByName
  * @param {String} name Pipe's name
  * @return {Object} return the evaled json pipe configuration
  */
 getPipeByName: function(name) {
    var n = this.pipes.length,ret;
    for(var i = 0 ; i < n ; i++) {
       if(this.pipes[i][0].name == name) {
          // Try to eval working property:
          try {
             ret = JSON.parse(this.pipes[i][2].working);
             return ret;
          }
          catch(ex) {
             this.alert("Unable to eval working json for module "+name);
             return null;
          }
       }
    }
    
    return null;
 },
 
 /**
  * @method loadPipe
  * @param {String} name Pipe name
  */
 loadPipe: function(name) {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your topology is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	try {
	
		this.preventLayerChangedEvent = true;
	
     this.loadPanel.hide();
	
    var wiring = this.getPipeByName(name), i;

	 if(!wiring) {
		this.alert("The topology '"+name+"' was not found.");
		return;
  	 }
    
    // TODO: check if current wiring is saved...
    this.layer.clear();
    
    this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt
    
    if(lang.isArray(wiring.modules)) {
      
       // Containers
       for(i = 0 ; i < wiring.modules.length ; i++) {
          var m = wiring.modules[i];
          
          if(this.modulesByName[m.name]) {
             var baseContainerConfig = this.modulesByName[m.name].container;
             YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
             m.config.title = m.name;
             m.config.noofports = m.value.portInfo.length;
             var container = this.layer.addContainer(m.config);
             Dom.addClass(container.el, "WiringEditor-module-"+m.name);
             container.setValue(m.value);
          }
          else {
             throw new Error("WiringEditor: module '"+m.name+"' not found !");
          }
       }
       
       // Wires
       if(lang.isArray(wiring.wires)) {
           for(i = 0 ; i < wiring.wires.length ; i++) {
              this.layer.addWire(wiring.wires[i]);
           }
        }
     }
     
     
     var completeFileName = name;
     if(wiring.properties.topoformat == "NMWG Format")
     {
     	 completeFileName += ".nmwg";  
     	
     }
     else if(wiring.properties.topoformat == "NML Format")
     {
     	 completeFileName += ".nml";  
     }
	

	 this.adapter.getTopologyTree({topologyName: completeFileName},{
		success: function(result) {
		
				this.markSaved();
				
				this.topoFormatContent = result;
   
  				this.loadTopologyFormatView(); 
				
				this.preventLayerChangedEvent = false;

			},
			
			failure: function(errorStr) {
				this.alert("Unable to load the previously saved topologies: "+errorStr);
			},
			scope: this
		 }
		);
    
          
	
  	}
  	catch(ex) {
     	this.alert(ex);
  	}
 },
 
 /**
  * @method loadTopology
  * @param {JSON} Topology Object 
  */
 loadTopology: function(TopoObject) {
	
	alert('i should not be in this loadtopology..thids is only for import');
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your topology is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	try {
	
		this.preventLayerChangedEvent = true;
	
     this.loadPanel.hide();
	
    var wiring = TopoObject;
    
    var i;

	 if(!wiring) {
		this.alert("The topology '"+name+"' was not found.");
		return;
  	 }
    
    // TODO: check if current wiring is saved...
    this.layer.clear();
    
    this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt
    
    if(lang.isArray(wiring.modules)) {
      
       // Containers
       for(i = 0 ; i < wiring.modules.length ; i++) {
          var m = wiring.modules[i];
          
          if(this.modulesByName[m.name]) {
             var baseContainerConfig = this.modulesByName[m.name].container;
             YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
             m.config.title = m.name;
             m.config.noofports = m.value.portInfo.length;
             var container = this.layer.addContainer(m.config);
             Dom.addClass(container.el, "WiringEditor-module-"+m.name);
             container.setValue(m.value);
          }
          else {
             throw new Error("WiringEditor: module '"+m.name+"' not found !");
          }
       }
       
       // Wires
       if(lang.isArray(wiring.wires)) {
           for(i = 0 ; i < wiring.wires.length ; i++) {
              this.layer.addWire(wiring.wires[i]);
           }
        }
     }
     
	  if(wiring.properties.name == "")
      {
      		this.markUnsaved();
      		return;
      }   
	

     var completeFileName = wiring.properties.name;
     if(wiring.properties.topoformat == "NMWG Format")
     {
     	 completeFileName += ".nmwg";  
     	
     }
     else if(wiring.properties.topoformat == "NML Format")
     {
     	 completeFileName += ".nml";  
     }
	

	 this.adapter.getTopologyTree({topologyName: completeFileName},{
		success: function(result) {
		
				this.markSaved();
				
				this.topoFormatContent = result;
   
  				this.loadTopologyFormatView(); 
				
				this.preventLayerChangedEvent = false;

			},
			
			failure: function(errorStr) {
				this.alert("Unable to load the previously saved topologies: "+errorStr);
			},
			scope: this
		 }
		);
    
	
  	}
  	catch(ex) {
     	this.alert(ex);
  	}
 },
 
 

 	renderAlertPanel: function() {
		
 	 /**
     * @property alertPanel
     * @type {YAHOO.widget.Panel}
     */
		this.alertPanel = new widget.Panel('WiringEditor-alertPanel', {
         fixedcenter: true,
         draggable: true,
         width: '500px',
         visible: false,
         modal: true
      });
      this.alertPanel.setHeader("Message");
      this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");
      this.alertPanel.render(document.body);
		Event.addListener('alertPanelButton','click', function() {
			this.alertPanel.hide();
		}, this, true);
	},

	onLayerChanged: function() {
		if(!this.preventLayerChangedEvent) {
			this.markUnsaved();
		}
		
		this.clearFormatViewOnNew();
		
	},

	markSaved: function() {
		this.savedStatusEl.style.display = 'none';
		this.tabViews.getTab(1).set('disabled', false);
	//	var importButton =  document.getElementById('WiringEditor-importButton');
	//	importButton.set('disabled',false);

	},
	
	markUnsaved: function() {
		this.savedStatusEl.style.display = '';
		this.tabViews.getTab(1).set('disabled', true);
	//	var importButton =  document.getElementById('WiringEditor-importButton');
	//	importButton.set('disabled',true);
	},

	isSaved: function() {
		return (this.savedStatusEl.style.display == 'none');
	},
 
 /**
  * This method return a wiring within the given vocabulary described by the modules list
  * @method getValue
  */
 getValue: function() {
    
   var i;
   var obj = {modules: [], wires: [], properties: null};

   for( i = 0 ; i < this.layer.containers.length ; i++) {
      obj.modules.push( {id: i , name: this.layer.containers[i].options.title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
   }

   for( i = 0 ; i < this.layer.wires.length ; i++) {
      var wire = this.layer.wires[i];
	  var linkobj = wire.getValue();
		
      var wireObj = { 
         src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers), terminal: wire.terminal1.options.name}, 
         tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers), terminal: wire.terminal2.options.name},
         linkProps: linkobj 
      };
      
      obj.wires.push(wireObj);
   }
   
   obj.properties = this.propertiesForm.getValue();
     
   return {
      name: obj.properties.name,
      topoFormat: obj.properties.topoformat,
      working: obj
   };
 }


};


/**
 * WiringEditor Adapters
 * @static
 */
WireIt.WiringEditor.adapters = {};


})();
   