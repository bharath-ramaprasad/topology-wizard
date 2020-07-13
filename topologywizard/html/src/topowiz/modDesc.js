var moduleDescriptor = {
	
	// unique name for the language used to classify, load and store for different topology elements and topologies. 
	languageName: "topoviz",
	
	// define topology properties
	propertiesFields: [
		// default fields (the "name" field is required):
		{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a name for the topology" } },
		{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30} },
		
		{"type": "boolean", inputParams: {"name": "mlt", value: false, label: "Multi-Layered Topology"}},
		{"type": "select", inputParams: {"name": "category", label: "Category", selectValues: ["SampleTopology", "DemoToplogy", "ExperimentalTopology"]}},
		{"type": "select", inputParams: {"name": "topoformat", label: "Topology Format", selectValues: ["NMWG Format", "NML Format"]}}
	],
	
	// List of network elements definition
	modules: [

				{
					"name": "2C - Ring Topology",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "2C - Ring Topology Node", 
	         		"className": "WireIt-Container WireIt-ImageContainer Bubble",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/bubble.png"
	         	}
	      },
	      
	      
				{
					"name": "Wireless Acess Router",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "Wireless Acess Router Node", 
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/linksys-router.png"
	        
	         	}
	      },
	      
	      		{
					"name": "Server Cluster",
					"container": {
	         		"xtype":"WireIt.ImageContainer", 
	         		"name": "Server Cluster Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/3server.png"
	         	}
	      },
	      
	      				{
					"name": "10GB-optical-switch",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "10GB-optical-switch Node", 
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/10GB-bypass-optical-switch.png"
	         	}
	      },
		      
		      	{
					"name": "host",
					"container": {
	         		"xtype":"WireIt.ImageContainer", 
	         		"name": "Host Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/host.png"
	         	}
	      },
	      
	      				{
					"name": "8 x 8 optical switch",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "8 x 8 optical switch Node", 
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/8-X-8_optical-switch.png"
	         	}
	      },
	      
	      				{
					"name": "Wireless Access Point",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "Wireless Access Point Node", 
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/120px-Router.png"
	         	}
	      },
	      
	      	      {
					"name": "client",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "client Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/monitor_7.png"
	         	}
	      },
	      
	      	 {
					"name": "Network Router",
					"container": {
	         		"xtype":"WireIt.ImageContainer", 
	         		"name": "Network Router Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/Router.png"
	         	}
	      },
	      	 {
					"name": "Server",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "Server Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/Server-5-4.png"
	         	}
	      },
	      
	      	 {
					"name": "VLAN Router",
					"container": {
	         		"xtype":"WireIt.ImageContainer",
	         		"name": "VLAN Router Node", 
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/WLAN_router.png"
	         	}
	      },
	      
	      	      	 {
					"name": "wireless Router",
					"container": {
	         		"xtype":"WireIt.ImageContainer", 
	         		"name": "wireless Router Node",
	            	"icon": "../../res/icons/arrow_right.png",
	         		"image": "../images/wireless_router.png"
	         	}
	      }		      
		      
		      
				
		]

};