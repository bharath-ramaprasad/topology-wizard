/**
 * Ajax Adapter which handles all communication with the backend.
 * @static 
 */
//<script type="text/javascript" src="static/js/yui/yahoo-min.js"></script>
//<script type="text/javascript" src="static/js/yui/connection-min.js"></script>
 
WireIt.WiringEditor.adapters.Ajax = {
	
	/**
	 * configure this adapter to different schemas.
	 * url can be functions.
	 */
	config: {
		saveWiring: {
			method: 'POST',
			url: '/topologypersist'
		},
		deleteWiring: {
			method: 'DELETE',
			url: '/topologypersist'
		},
		listWirings: {
			method: 'GET',
			url: '/topologypersist'
		},
		getFormatTree: {
			method: 'GET',
			url: '/retrieveFormatTree'
		}
	},
	
	init: function() {
		// YAHOO.util.Connect.setDefaultPostHeader('text/html');
		//YAHOO.util.Connect.setDefaultPostHeader(false);
		// YAHOO.util.Connect.initHeader("Content-Type","text/html; charset=utf-8");
	},
	
	saveWiring: function(val, callbacks) {		
		this._sendRequest("saveWiring", val, callbacks);
	},
	
	deleteWiring: function(val, callbacks) {
		this._sendRequest("deleteWiring", val, callbacks);
	},
	
	listWirings: function(val, callbacks) {
		this._sendRequest("listWirings", val, callbacks);
	},
	
	getTopologyTree: function(val, callbacks) { 
		this._sendRequest("getFormatTree", val, callbacks);
	},
	
	
	_sendRequest: function(action, value, callbacks) {
	
		
		var params = [];
		for(var key in value) {
			
			if(value.hasOwnProperty(key)) {
				params.push(window.encodeURIComponent(key)+"="+window.encodeURIComponent(value[key]));
				//params.push(key+"="+value[key]);
			}
			
		}
		if(action == "listWirings" || action == "deleteWiring" || action == "getFormatTree")
		{
			params.push("method=" + action); 
		}
	
		var postData = params.join('&');
		
		
		
		// alert(postData);
		
		var url = "";
		if( YAHOO.lang.isFunction(this.config[action].url) ) {
			url = this.config[action].url(value);
		}
		else {
			url = this.config[action].url;
		}
		
		if(action == "listWirings" || action == "deleteWiring" || action == "getFormatTree")
		{
			url += "?" + postData;
			postData = null;
		}

		
		var method = "";
		if( YAHOO.lang.isFunction(this.config[action].url) ) {
			method = this.config[action].method(value);
		}
		else {
			method = this.config[action].method;
		}
		
		// YAHOO.util.Connect.setDefaultPostHeader('text/html');
		// YAHOO.util.Connect.initHeader("Content-Type","text/html; charset=utf-8");
		
		//alert("now sending data.. url: ["+url+"], method: "+method);	

		YAHOO.util.Connect.asyncRequest(method, url,{
		
					success: function(o) {
			
				var s = o.responseText;
				
					
				if(action == "saveWiring" || action == "getFormatTree")
				{
			 		callbacks.success.call(callbacks.scope, s);
				}
				else
				{
					var r = YAHOO.lang.JSON.parse(s);
					callbacks.success.call(callbacks.scope, r);
				}			 	
			},
			failure: function(o) {
				var error = o.status + " " + o.statusText;
				callbacks.failure.call(callbacks.scope, error);
			}
		
		}
		,postData);//"new=1&old=2"
		
	}
	
};
