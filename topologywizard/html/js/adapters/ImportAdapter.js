/**
	 Responsible for importing topology files in their format and communicating with the
	 backend to get the visualization components as well as the xml file thus saved given by the user. 
 */



WireIt.ImportAdapter = function(Editor){
	
  // Variable for holding the selected file ID.
  
  this.EditorInstance = Editor;
  
  this.fileID = "";
  
  this.fileName = "";
  
  this.uploader = null;
	
};
		
WireIt.ImportAdapter.prototype = {
	
		init : function()
		{

     			
     		// Create the overlay DOM element   
			var overlay = document.createElement("div");
			overlay.id 	= "importOverlay";
			
			//var button = YAHOO.util.Dom.getRegion('browse');
			
			// Setup style for this overlay. zIndex high means it is on top of everything else
			YAHOO.util.Dom.setStyle(overlay, 'zIndex', 999);
			
			// Position this overlay to cover underlaying button
			YAHOO.util.Dom.setStyle(overlay, 'position', "absolute");
		
//			YAHOO.util.Dom.setStyle(overlay, 'width', uiLayer.right-uiLayer.left + "px");
//			YAHOO.util.Dom.setStyle(overlay, 'height', uiLayer.bottom-uiLayer.top + "px");
					
			// Insert the layer as first child of the button
			var button = document.getElementById("WiringEditor-importButton");
			
			
			var bt_width  = YAHOO.util.Dom.getStyle(button, 'width');
		    var bt_height = YAHOO.util.Dom.getStyle(button, 'height');
			
			
		    YAHOO.util.Dom.setStyle(overlay, 'width', bt_width);
			YAHOO.util.Dom.setStyle(overlay, 'height', bt_height);
			
			///alert('width ' + YAHOO.util.Dom.getStyle(overlay, 'width') + ' , height' + YAHOO.util.Dom.getStyle(overlay, 'height'));
			
			//button.appendChild(overlay);
			 button.insertBefore(overlay, button.firstChild);
     				
     			   			
     				     	
				YAHOO.widget.Uploader.SWFURL = "../../lib/yui/uploader/assets/uploader.swf";//"http://yui.yahooapis.com/2.9.0/build/uploader/assets/uploader.swf";//"http://yui.yahooapis.com/2.8.1/build/uploader/assets/uploader.swf";// //; //; 
	
				
				//sprite 
				this.uploader = new YAHOO.widget.Uploader('importOverlay');
						   
						   
			
				// Add event listeners to various events on the uploader.
				// Methods on the uploader should only be called once the 
				// contentReady event has fired.
				
		
				//the context of 'this'  within handlers is the uploader object
				//uploader.addListener('click', this.uploadOpenUp);
			this.uploader.addListener('contentReady', this.swfReady, null, this);
			this.uploader.addListener('fileSelect', this.onFileSelect, null, this);
			this.uploader.addListener('uploadStart', this.onUploadStart, null, this);
			 this.uploader.addListener('uploadError', this.onUploadError, null, this);
			 this.uploader.addListener('uploadProgress',this.onUploadProgress, null, this);
			this.uploader.addListener('uploadCancel', this.onUploadCancel, null, this);			
			this.uploader.addListener('uploadComplete', this.onUploadComplete, null, this);
			this.uploader.addListener('uploadCompleteData', this.onUploadCompleteData, null, this);
     			
     			
     
 				//the other approach which didn't quite work as expected..
	     		/* alert('import adapter iniitialization');
				// The button that will be overlayed
				var uiLayer = YAHOO.util.Dom.getRegion('#WiringEditor-importButton');
			
			alert('importeddd adapter iniitialization..got the overlay');*/
			
			//this.handleContentReady();
     	
     		this.swfReady();		
			
		},
		
					
		handleClearFiles :  function () {
			this.clearFileList();
			this.enable();
			this.fileID = null;
	   },	
	   
	  
		// When contentReady event is fired, you can call methods on the uploader.
		swfReady : function () {
			// Allows the uploader to send log messages to trace, as well as to YAHOO.log
			//alert('it altleast comes into this now');
			
			YAHOO.log("Start Content Ready");
			this.uploader.setAllowLogging(true);
	
			// Restrict selection to a single file by toggling the param to false which is the default behaviour.  
			 this.uploader.setAllowMultipleFiles(false);
			
			var ff = new Array({description:"NMWG Topologies", extensions:"*.nmwg"}, 
							   {description:"NML Topologies", extensions:"*.nml"});
			
			 this.uploader.setFileFilters(ff); 

		},
		
		// Initiate the file upload. Since there's only one file, 
		// we can use either upload() or uploadAll() call. fileList 
		// needs to have been populated by the user.
		uploadNow : function () {
			if (this.fileID != null) {
				var file_name = this.filename;
				this.uploader.upload(this.fileID,"/importProcessor", "POST");
				this.fileID = null;
				this.filename = null;
				//alert('file is posted');
			}
			
			
		},
	
		// Fired when the user selects files in the "Browse" dialog
		// and clicks "Ok".
		onFileSelect : function(e) {
		
		
			for ( var item in e.fileList) 
			{
				//if (YAHOO.lang.hasOwnProperty(event.fileList, item)) {
				
				if(e.fileList.hasOwnProperty(item))
				{
					YAHOO.log(e.fileList[item]);
					YAHOO.log(e.fileList[item].id);
					var file = e.fileList[item];
					this.fileID = file.id;
					this.fileName = file.name;
					// Directly upload the file by notifying importProcessor
					//this.upload(this.fileID, "/importProcessor", "POST"); 
					this.uploadNow(); 
				}
			}
			
			//alert(this.fileName);
		}, 
	
		// Do something on each file's upload start.
		onUploadStart : function (e) {
			
		},
	
		// Do something on each file's upload progress event.
		onUploadProgress: function (e) {

			
		},
	
		// Do something when each file's upload is complete.
		onUploadComplete : function (e) {
				
		
		},
	
		// Do something if a file upload throws an error.
		// (When uploadAll() is used, the Uploader will
		// attempt to continue uploading.
		onUploadError : function (e) {
			
		},
	
		// Do something if an upload is cancelled.
		onUploadCancel : function (e) {
			
		},
			
		// Do something when data is received back from the server.
		onUploadCompleteData : function(e) {
		
		//alert('already');
		
		//	alert(e.data);
		
		    var wirings = YAHOO.lang.JSON.parse(e.data);
			// This is the place responsible for loading Wiring.
			
			//alert("the topology visualization story is  " + wirings );
			
			this.EditorInstance.loadTopology(wirings);
			
			
		}
		
		
};

	
