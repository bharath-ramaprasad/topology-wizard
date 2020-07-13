(function() {
	var B = YAHOO.lang;YAHOO.inputEx = function(C) {
		var D = null;if (C.type) {
			D = YAHOO.inputEx.getFieldClass(C.type);if (D === null) {
				D = YAHOO.inputEx.StringField
			}
		} else {
			D = C.fieldClass ? C.fieldClass : A.StringField
		}var E = new D(C.inputParams);return E
	};var A = YAHOO.inputEx;B.augmentObject(A, { VERSION: "0.2.1", spacerUrl: "images/space.gif", stateEmpty: "empty", stateRequired: "required", stateValid: "valid", stateInvalid: "invalid", messages: { required: "This field is required", invalid: "This field is invalid", valid: "This field is valid", defaultDateFormat: "m/d/Y", months: ["January","February","March","April","May","June","July","August","September","October","November","December"] }, widget: { }, regexps: { email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i, password: /^[0-9a-zA-Z\x20-\x7E]*$/ }, typeClasses: { }, registerType: function(C, D) {
		if (!B.isString(C)) {
			throw new Error("inputEx.registerType: first argument must be a string")
		}if (!B.isFunction(D)) {
			throw new Error("inputEx.registerType: second argument must be a function")
		}this.typeClasses[C] = D
	}, getFieldClass: function(C) {
		return B.isFunction(this.typeClasses[C]) ? this.typeClasses[C] : null
	}, getType: function(C) {
		for (var D in this.typeClasses) {
			if (this.typeClasses.hasOwnProperty(D)) {
				if (this.typeClasses[D] == C) {
					return D
				}
			}
		}return null
	}, buildField: function(C) {
		return A(C)
	}, sn: function(F, E, C) {
		if (!F) {
			return
		}if (E) {
			for (var D in E) {
				var H = E[D];if (B.isFunction(H)) {
					continue
				}if (D == "className") {
					D = "class";F.className = H
				}if (H !== F.getAttribute(D)) {
					try {
						if (H === false) {
							F.removeAttribute(D)
						} else {
							F.setAttribute(D, H)
						}
					}catch (G) {
					}
				}
			}
		}if (C) {
			for (var D in C) {
				if (B.isFunction(C[D])) {
					continue
				}if (F.style[D] != C[D]) {
					F.style[D] = C[D]
				}
			}
		}
	}, cn: function(C, G, D, I) {
		if (C == "input" && YAHOO.env.ua.ie) {
			var F = "<" + C;if (G !== "undefined") {
				for (var E in G) {
					F += " " + E + '="' + G[E] + '"'
				}
			}F += "/>";return document.createElement(F)
		} else {
			var H = document.createElement(C);this.sn(H, G, D);if (I) {
				H.innerHTML = I
			}return H
		}
	}, indexOf: function(F, C) {
		var D = C.length, E;for (E = 0; E < D; E++) {
			if (C[E] == F) {
				return E
			}
		}return -1
	}, compactArray: function(C) {
		var F = [], D = C.length, E;for (E = 0; E < D; E++) {
			if (!B.isNull(C[E]) && !B.isUndefined(C[E])) {
				F.push(C[E])
			}
		}return F
	} })
})();var inputEx = YAHOO.inputEx; (function() {
	var C = YAHOO.inputEx, B = YAHOO.util.Dom, D = YAHOO.lang, A = YAHOO.util;C.Field = function(E) {
		if (!E) {
			var E = { }
		}this.setOptions(E);this.render();this.updatedEvt = new A.CustomEvent("updated", this);this.initEvents();if (!D.isUndefined(this.options.value)) {
			this.setValue(this.options.value, false)
		}if (E.parentEl) {
			if (D.isString(E.parentEl)) {
				B.get(E.parentEl).appendChild(this.getEl())
			} else {
				E.parentEl.appendChild(this.getEl())
			}
		}
	};C.Field.prototype = { setOptions: function(E) {
		this.options = { };this.options.name = E.name;this.options.value = E.value;this.options.id = E.id || B.generateId();this.options.label = E.label;this.options.description = E.description;this.options.messages = { };this.options.messages.required = (E.messages && E.messages.required) ? E.messages.required : C.messages.required;this.options.messages.invalid = (E.messages && E.messages.invalid) ? E.messages.invalid : C.messages.invalid;this.options.className = E.className ? E.className : "inputEx-Field";this.options.required = D.isUndefined(E.required) ? false : E.required;this.options.showMsg = D.isUndefined(E.showMsg) ? false : E.showMsg
	}, render: function() {
		this.divEl = C.cn("div", { className: "inputEx-fieldWrapper" });if (this.options.id) {
			this.divEl.id = this.options.id
		}if (this.options.required) {
			B.addClass(this.divEl, "inputEx-required")
		}if (this.options.label) {
			this.labelDiv = C.cn("div", { id: this.divEl.id + "-label", className: "inputEx-label", "for": this.divEl.id + "-field" });this.labelEl = C.cn("label");this.labelEl.appendChild(document.createTextNode(this.options.label));this.labelDiv.appendChild(this.labelEl);this.divEl.appendChild(this.labelDiv)
		}this.fieldContainer = C.cn("div", { className: this.options.className });this.renderComponent();if (this.options.description) {
			this.fieldContainer.appendChild(C.cn("div", { id: this.divEl.id + "-desc", className: "inputEx-description" }, null, this.options.description))
		}this.divEl.appendChild(this.fieldContainer);this.divEl.appendChild(C.cn("div", null, { clear: "both" }, " "))
	}, fireUpdatedEvt: function() {
		var E = this;setTimeout(function() {
			E.updatedEvt.fire(E.getValue(), E)
		}, 50)
	}, renderComponent: function() { }, getEl: function() {
		return this.divEl
	}, initEvents: function() { }, getValue: function() { }, setValue: function(F, E) {
		this.setClassFromState();if (E !== false) {
			this.fireUpdatedEvt()
		}
	}, setClassFromState: function() {
		if (this.previousState) {
			var E = "inputEx-" + ( (this.previousState == C.stateRequired) ? C.stateInvalid : this.previousState);B.removeClass(this.divEl, E)
		}var F = this.getState();if (! (F == C.stateEmpty && B.hasClass(this.divEl, "inputEx-focused"))) {
			var E = "inputEx-" + ( (F == C.stateRequired) ? C.stateInvalid : F);B.addClass(this.divEl, E)
		}if (this.options.showMsg) {
			this.displayMessage(this.getStateString(F))
		}this.previousState = F
	}, getStateString: function(E) {
		if (E == C.stateRequired) {
			return this.options.messages.required
		} else {
			if (E == C.stateInvalid) {
				return this.options.messages.invalid
			} else {
				return""
			}
		}
	}, getState: function() {
		if (this.isEmpty()) {
			return this.options.required ? C.stateRequired : C.stateEmpty
		}return this.validate() ? C.stateValid : C.stateInvalid
	}, validate: function() {
		return true
	}, onFocus: function(F) {
		var E = this.getEl();B.removeClass(E, "inputEx-empty");B.addClass(E, "inputEx-focused")
	}, onBlur: function(E) {
		B.removeClass(this.getEl(), "inputEx-focused");this.setClassFromState()
	}, onChange: function(E) {
		this.fireUpdatedEvt()
	}, close: function() { }, disable: function() { }, enable: function() { }, focus: function() { }, destroy: function() {
		var E = this.getEl();this.updatedEvt.unsubscribeAll();if (B.inDocument(E)) {
			E.parentNode.removeChild(E)
		}A.Event.purgeElement(E, true)
	}, displayMessage: function(G) {
		if (!this.fieldContainer) {
			return
		}if (!this.msgEl) {
			this.msgEl = C.cn("div", { className: "inputEx-message" });try {
				var E = this.divEl.getElementsByTagName("div");this.divEl.insertBefore(this.msgEl, E[ (E.length - 1 >= 0) ? E.length - 1 : 0])
			}catch (F) {
				alert(F)
			}
		}this.msgEl.innerHTML = G
	}, show: function() {
		this.divEl.style.display = ""
	}, hide: function() {
		this.divEl.style.display = "none"
	}, clear: function(E) {
		this.setValue(D.isUndefined(this.options.value) ? "" : this.options.value, E)
	}, isEmpty: function() {
		return this.getValue() === ""
	} }
})(); (function() {
	var A = YAHOO.lang;inputEx.BaseField = inputEx.Field;inputEx.Field = function(B) {
		inputEx.Field.superclass.constructor.call(this, B)
	};A.extend(inputEx.Field, inputEx.BaseField, { setOptions: function(B) {
		inputEx.Field.superclass.setOptions.call(this, B);this.options.wirable = A.isUndefined(B.wirable) ? false : B.wirable;this.options.container = B.container
	}, render: function() {
		inputEx.Field.superclass.render.call(this);if (this.options.wirable) {
			this.renderTerminal()
		}
	}, renderTerminal: function() {
		var B = inputEx.cn("div", { className: "WireIt-InputExTerminal" });this.divEl.insertBefore(B, this.fieldContainer);this.terminal = new WireIt.Terminal(B, { name: this.options.name, direction: [-1,0], fakeDirection: [0,1], ddConfig: { type: "input", allowedTypes: ["output"] }, nMaxWires: 1 }, this.options.container);this.terminal.dflyName = "input_" + this.options.name;if (this.options.container) {
			this.options.container.terminals.push(this.terminal)
		}this.terminal.eventAddWire.subscribe(this.onAddWire, this, true);this.terminal.eventRemoveWire.subscribe(this.onRemoveWire, this, true)
	}, onAddWire: function(B, C) {
		this.options.container.onAddWire(B, C);this.disable();this.el.value = "[wired]"
	}, onRemoveWire: function(B, C) {
		this.options.container.onRemoveWire(B, C);this.enable();this.el.value = ""
	} })
})(); (function() {
	var C = YAHOO.inputEx, D = YAHOO.lang, B = YAHOO.util.Dom, A = YAHOO.util.Event;C.Group = function(E) {
		C.Group.superclass.constructor.call(this, E);if (this.hasInteractions) {
			for (var F = 0; F < this.inputs.length; F++) {
				this.runInteractions(this.inputs[F], this.inputs[F].getValue())
			}
		}
	};D.extend(C.Group, C.Field, { setOptions: function(E) {
		this.options = { };this.options.className = E.className || "inputEx-Group";this.options.fields = E.fields;this.options.id = E.id;this.options.name = E.name;this.options.value = E.value;this.options.flatten = E.flatten;this.options.legend = E.legend || "";this.inputConfigs = E.fields;this.options.collapsible = D.isUndefined(E.collapsible) ? false : E.collapsible;this.options.collapsed = D.isUndefined(E.collapsed) ? false : E.collapsed;this.options.disabled = D.isUndefined(E.disabled) ? false : E.disabled;this.inputs = [];this.inputsNames = { }
	}, render: function() {
		this.divEl = C.cn("div", { className: this.options.className });if (this.options.id) {
			this.divEl.id = this.options.id
		}this.renderFields(this.divEl);if (this.options.disabled) {
			this.disable()
		}
	}, renderFields: function(G) {
		this.fieldset = C.cn("fieldset");this.legend = C.cn("legend", { className: "inputEx-Group-legend" });if (this.options.collapsible) {
			var I = C.cn("div", { className: "inputEx-Group-collapseImg" }, null, " ");this.legend.appendChild(I);C.sn(this.fieldset, { className: "inputEx-Expanded" })
		}if (!D.isUndefined(this.options.legend) && this.options.legend !== "") {
			this.legend.appendChild(document.createTextNode(" " + this.options.legend))
		}if (this.options.collapsible || (!D.isUndefined(this.options.legend) && this.options.legend !== "")) {
			this.fieldset.appendChild(this.legend)
		}for (var F = 0; F < this.options.fields.length; F++) {
			var E = this.options.fields[F];var H = this.renderField(E);this.fieldset.appendChild(H.getEl())
		}if (this.options.collapsed) {
			this.toggleCollapse()
		}G.appendChild(this.fieldset)
	}, renderField: function(F) {
		var E = C.buildField(F);this.inputs.push(E);if (E.options.name) {
			this.inputsNames[E.options.name] = E
		}if (!this.hasInteractions && F.interactions) {
			this.hasInteractions = true
		}E.updatedEvt.subscribe(this.onChange, this, true);return E
	}, initEvents: function() {
		if (this.options.collapsible) {
			A.addListener(this.legend, "click", this.toggleCollapse, this, true)
		}
	}, toggleCollapse: function() {
		if (B.hasClass(this.fieldset, "inputEx-Expanded")) {
			B.replaceClass(this.fieldset, "inputEx-Expanded", "inputEx-Collapsed")
		} else {
			B.replaceClass(this.fieldset, "inputEx-Collapsed", "inputEx-Expanded")
		}
	}, validate: function() {
		var F = true;for (var G = 0; G < this.inputs.length; G++) {
			var E = this.inputs[G];E.setClassFromState();var H = E.getState();if (H == C.stateRequired || H == C.stateInvalid) {
				F = false
			}
		}return F
	}, enable: function() {
		for (var E = 0; E < this.inputs.length; E++) {
			this.inputs[E].enable()
		}
	}, disable: function() {
		for (var E = 0; E < this.inputs.length; E++) {
			this.inputs[E].disable()
		}
	}, setValue: function(H, F) {
		if (!H) {
			return
		}for (var G = 0; G < this.inputs.length; G++) {
			var I = this.inputs[G];var E = I.options.name;if (E && !D.isUndefined(H[E])) {
				I.setValue(H[E], false)
			} else {
				I.clear(false)
			}
		}if (F !== false) {
			this.fireUpdatedEvt()
		}
	}, getValue: function() {
		var G = { };for (var F = 0; F < this.inputs.length; F++) {
			var E = this.inputs[F].getValue();if (this.inputs[F].options.name) {
				if (this.inputs[F].options.flatten && D.isObject(E)) {
					D.augmentObject(G, E)
				} else {
					G[this.inputs[F].options.name] = E
				}
			}
		}return G
	}, close: function() {
		for (var E = 0; E < this.inputs.length; E++) {
			this.inputs[E].close()
		}
	}, focus: function() {
		if (this.inputs.length > 0) {
			this.inputs[0].focus()
		}
	}, getFieldByName: function(E) {
		if (!this.inputsNames.hasOwnProperty(E)) {
			return null
		}return this.inputsNames[E]
	}, onChange: function(F, G) {
		var H = G[0];var E = G[1];this.runInteractions(E, H);this.fireUpdatedEvt()
	}, runAction: function(E, G) {
		var F = this.getFieldByName(E.name);if (YAHOO.lang.isFunction(F[E.action])) {
			F[E.action].call(F)
		} else {
			if (YAHOO.lang.isFunction(E.action)) {
				E.action.call(F, G)
			} else {
				throw new Error("action " + E.action + " is not a valid action for field " + E.name)
			}
		}
	}, runInteractions: function(F, K) {
		var H = C.indexOf(F, this.inputs);var J = this.options.fields[H];if (YAHOO.lang.isUndefined(J.interactions)) {
			return
		}var L = J.interactions;for (var I = 0; I < L.length; I++) {
			var E = L[I];if (E.valueTrigger === K) {
				for (var G = 0; G < E.actions.length; G++) {
					this.runAction(E.actions[G], K)
				}
			}
		}
	}, clear: function(E) {
		for (var F = 0; F < this.inputs.length; F++) {
			this.inputs[F].clear(false)
		}if (E !== false) {
			this.fireUpdatedEvt()
		}
	} });C.registerType("group", C.Group)
})(); (function() {
	var A = YAHOO.inputEx, B = YAHOO.lang;A.visus = { trimpath: function(E, F) {
		if (!TrimPath) {
			alert("TrimPath is not on the page. Please load inputex/lib/trimpath-template.js");return
		}var D = TrimPath.parseTemplate(E.template);var C = D.process(F);return C
	}, func: function(C, D) {
		return C.func(D)
	}, dump: function(C, D) {
		return B.dump(D)
	} };A.renderVisu = function(I, E, F) {
		var C = I || { };var J = C.visuType || "dump";if (!A.visus.hasOwnProperty(J)) {
			throw new Error("inputEx: no visu for visuType: " + J)
		}var G = A.visus[J];if (!B.isFunction(G)) {
			throw new Error("inputEx: no visu for visuType: " + J)
		}var K = null;try {
			K = G(C, E)
		}catch (H) {
			throw new Error("inputEx: error while running visu " + J + " : " + H.message);return
		}var D = null;if (F) {
			if (B.isString(F)) {
				D = YAHOO.util.Dom.get(F)
			} else {
				D = F
			}
		}if (D) {
			if (YAHOO.lang.isObject(K) && K.tagName) {
				D.innerHTML = "";D.appendChild(K)
			} else {
				D.innerHTML = K
			}
		}return K
	}
})(); (function() {
	var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;C.StringField = function(E) {
		C.StringField.superclass.constructor.call(this, E);if (this.options.typeInvite) {
			this.updateTypeInvite()
		}
	};D.extend(C.StringField, C.Field, { setOptions: function(E) {
		C.StringField.superclass.setOptions.call(this, E);this.options.regexp = E.regexp;this.options.size = E.size;this.options.maxLength = E.maxLength;this.options.minLength = E.minLength;this.options.typeInvite = E.typeInvite;this.options.readonly = E.readonly
	}, renderComponent: function() {
		this.wrapEl = C.cn("div", { className: "inputEx-StringField-wrapper" });var E = { };E.type = "text";E.id = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();if (this.options.size) {
			E.size = this.options.size
		}if (this.options.name) {
			E.name = this.options.name
		}if (this.options.readonly) {
			E.readonly = "readonly"
		}if (this.options.maxLength) {
			E.maxLength = this.options.maxLength
		}this.el = C.cn("input", E);this.wrapEl.appendChild(this.el);this.fieldContainer.appendChild(this.wrapEl)
	}, initEvents: function() {
		A.addListener(this.el, "change", this.onChange, this, true);if (YAHOO.env.ua.ie) {
			var E = this.el;new YAHOO.util.KeyListener(this.el, { keys: [13] }, { fn: function() {
				E.blur();E.focus()
			} }).enable()
		}A.addFocusListener(this.el, this.onFocus, this, true);A.addBlurListener(this.el, this.onBlur, this, true);A.addListener(this.el, "keypress", this.onKeyPress, this, true);A.addListener(this.el, "keyup", this.onKeyUp, this, true)
	}, getValue: function() {
		return (this.options.typeInvite && this.el.value == this.options.typeInvite) ? "" : this.el.value
	}, setValue: function(F, E) {
		this.el.value = F;C.StringField.superclass.setValue.call(this, F, E)
	}, validate: function() {
		var F = this.getValue();if (F == "") {
			return !this.options.required
		}var E = true;if (this.options.regexp) {
			E = E && F.match(this.options.regexp)
		}if (this.options.minLength) {
			E = E && F.length >= this.options.minLength
		}return E
	}, disable: function() {
		this.el.disabled = true
	}, enable: function() {
		this.el.disabled = false
	}, focus: function() {
		if (!!this.el && !D.isUndefined(this.el.focus)) {
			this.el.focus()
		}
	}, getStateString: function(E) {
		if (E == C.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
			return C.messages.stringTooShort[0] + this.options.minLength + C.messages.stringTooShort[1]
		}return C.StringField.superclass.getStateString.call(this, E)
	}, setClassFromState: function() {
		C.StringField.superclass.setClassFromState.call(this);if (this.options.typeInvite) {
			this.updateTypeInvite()
		}
	}, updateTypeInvite: function() {
		if (!B.hasClass(this.divEl, "inputEx-focused")) {
			if (this.isEmpty()) {
				B.addClass(this.divEl, "inputEx-typeInvite");this.el.value = this.options.typeInvite
			} else {
				B.removeClass(this.divEl, "inputEx-typeInvite")
			}
		} else {
			if (B.hasClass(this.divEl, "inputEx-typeInvite")) {
				this.el.value = "";this.previousState = null;B.removeClass(this.divEl, "inputEx-typeInvite")
			}
		}
	}, onFocus: function(E) {
		C.StringField.superclass.onFocus.call(this, E);if (this.options.typeInvite) {
			this.updateTypeInvite()
		}
	}, onKeyPress: function(E) { }, onKeyUp: function(E) { } });C.messages.stringTooShort = ["This field should contain at least "," numbers or characters"];C.registerType("string", C.StringField)
})(); (function() {
	var B = YAHOO.inputEx, A = YAHOO.util.Event;B.Textarea = function(C) {
		B.Textarea.superclass.constructor.call(this, C)
	};YAHOO.lang.extend(B.Textarea, B.StringField, { setOptions: function(C) {
		B.Textarea.superclass.setOptions.call(this, C);this.options.rows = C.rows || 6;this.options.cols = C.cols || 23
	}, renderComponent: function() {
		this.wrapEl = B.cn("div", { className: "inputEx-StringField-wrapper" });var C = { };C.id = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();C.rows = this.options.rows;C.cols = this.options.cols;if (this.options.name) {
			C.name = this.options.name
		}this.el = B.cn("textarea", C, null, this.options.value);this.wrapEl.appendChild(this.el);this.fieldContainer.appendChild(this.wrapEl)
	}, validate: function() {
		var C = B.Textarea.superclass.validate.call(this);if (this.options.maxLength) {
			C = C && this.getValue().length <= this.options.maxLength
		}return C
	}, getStateString: function(C) {
		if (C == B.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
			return B.messages.stringTooShort[0] + this.options.minLength + B.messages.stringTooShort[1]
		} else {
			if (C == B.stateInvalid && this.options.maxLength && this.el.value.length > this.options.maxLength) {
				return B.messages.stringTooLong[0] + this.options.maxLength + B.messages.stringTooLong[1]
			}
		}return B.Textarea.superclass.getStateString.call(this, C)
	} });B.messages.stringTooLong = ["This field should contain at most "," numbers or characters"];B.registerType("text", B.Textarea)
})(); (function() {
	var B = YAHOO.inputEx, A = YAHOO.util.Event, C = YAHOO.lang;B.SelectField = function(D) {
		B.SelectField.superclass.constructor.call(this, D)
	};C.extend(B.SelectField, B.Field, { setOptions: function(D) {
		B.SelectField.superclass.setOptions.call(this, D);this.options.multiple = C.isUndefined(D.multiple) ? false : D.multiple;this.options.selectValues = [];this.options.selectOptions = [];for (var E = 0, F = D.selectValues.length; E < F; E++) {
			this.options.selectValues.push(D.selectValues[E]);this.options.selectOptions.push("" + ( (D.selectOptions && !C.isUndefined(D.selectOptions[E])) ? D.selectOptions[E] : D.selectValues[E]))
		}
	}, renderComponent: function() {
		this.el = B.cn("select", { id: this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId(), name: this.options.name || "" });if (this.options.multiple) {
			this.el.multiple = true;this.el.size = this.options.selectValues.length
		}this.optionEls = { };var D;for (var E = 0; E < this.options.selectValues.length; E++) {
			D = B.cn("option", { value: this.options.selectValues[E] }, null, this.options.selectOptions[E]);this.optionEls[this.options.selectOptions[E]] = D;this.el.appendChild(D)
		}this.fieldContainer.appendChild(this.el)
	}, initEvents: function() {
		A.addListener(this.el, "change", this.onChange, this, true);A.addFocusListener(this.el, this.onFocus, this, true);A.addBlurListener(this.el, this.onBlur, this, true)
	}, setValue: function(H, E) {
		var D = 0;var G;for (var F = 0; F < this.options.selectValues.length; F++) {
			if (H === this.options.selectValues[F]) {
				G = this.el.childNodes[F];G.selected = "selected"
			}
		}B.SelectField.superclass.setValue.call(this, H, E)
	}, getValue: function() {
		return this.options.selectValues[this.el.selectedIndex]
	}, disable: function() {
		this.el.disabled = true
	}, enable: function() {
		this.el.disabled = false
	}, addOption: function(E) {
		var J = E.value;var G = "" + (!C.isUndefined(E.option) ? E.option : E.value);var K = this.options.selectOptions.length;var D = K;if (C.isNumber(E.position) && E.position >= 0 && E.position <= D) {
			D = parseInt(E.position, 10)
		} else {
			if (C.isString(E.before)) {
				for (var F = 0; F < K; F++) {
					if (this.options.selectOptions[F] === E.before) {
						D = F;break
					}
				}
			} else {
				if (C.isString(E.after)) {
					for (var F = 0; F < K; F++) {
						if (this.options.selectOptions[F] === E.after) {
							D = F + 1;break
						}
					}
				}
			}
		}this.options.selectValues = this.options.selectValues.slice(0, D).concat([J]).concat(this.options.selectValues.slice(D, K));this.options.selectOptions = this.options.selectOptions.slice(0, D).concat([G]).concat(this.options.selectOptions.slice(D, K));var I = B.cn("option", { value: J }, null, G);this.optionEls[G] = I;if (D < K) {
			YAHOO.util.Dom.insertBefore(I, this.el.childNodes[D])
		} else {
			this.el.appendChild(I)
		}if (!!E.selected) {
			var H = this;setTimeout(function() {
				H.setValue(J)
			}, 0)
		}
	}, removeOption: function(G) {
		var F;var I = this.options.selectOptions.length;var E = this.el.selectedIndex;if (C.isNumber(G.position) && G.position >= 0 && G.position <= I) {
			F = parseInt(G.position, 10)
		} else {
			if (C.isString(G.option)) {
				for (var H = 0; H < I; H++) {
					if (this.options.selectOptions[H] === G.option) {
						F = H;break
					}
				}
			} else {
				if (C.isString(G.value)) {
					for (var H = 0; H < I; H++) {
						if (this.options.selectValues[H] === G.value) {
							F = H;break
						}
					}
				}
			}
		}if (!C.isNumber(F)) {
			throw new Error("SelectField : invalid or missing position, option or value in removeOption")
		}this.options.selectValues.splice(F, 1);var D = this.options.selectOptions.splice(F, 1);this.el.removeChild(this.optionEls[D]);delete this.optionEls[D];if (E == F) {
			this.clear()
		}
	} });B.registerType("select", B.SelectField)
})(); (function() {
	var A = YAHOO.inputEx;A.EmailField = function(B) {
		A.EmailField.superclass.constructor.call(this, B)
	};YAHOO.lang.extend(A.EmailField, A.StringField, { setOptions: function(B) {
		A.EmailField.superclass.setOptions.call(this, B);this.options.messages.invalid = A.messages.invalidEmail;this.options.regexp = A.regexps.email
	}, getValue: function() {
		return this.el.value.toLowerCase()
	} });A.messages.invalidEmail = "Invalid email, ex: sample@test.com";A.registerType("email", A.EmailField)
})(); (function() {
	var A = YAHOO.inputEx, B = YAHOO.lang;A.UrlField = function(C) {
		A.UrlField.superclass.constructor.call(this, C)
	};B.extend(A.UrlField, A.StringField, { setOptions: function(C) {
		A.UrlField.superclass.setOptions.call(this, C);this.options.className = C.className ? C.className : "inputEx-Field inputEx-UrlField";this.options.messages.invalid = A.messages.invalidUrl;this.options.favicon = B.isUndefined(C.favicon) ? ( ("https:" == document.location.protocol) ? false : true) : C.favicon;this.options.size = C.size || 50;this.options.regexp = A.regexps.url
	}, render: function() {
		A.UrlField.superclass.render.call(this);this.el.size = this.options.size;if (!this.options.favicon) {
			YAHOO.util.Dom.addClass(this.el, "nofavicon")
		}if (this.options.favicon) {
			this.favicon = A.cn("img", { src: A.spacerUrl });this.fieldContainer.insertBefore(this.favicon, this.fieldContainer.childNodes[0]);YAHOO.util.Event.addListener(this.favicon, "click", function() {
				this.focus()
			}, this, true)
		}
	}, setClassFromState: function() {
		A.UrlField.superclass.setClassFromState.call(this);if (this.options.favicon) {
			this.updateFavicon( (this.previousState == A.stateValid) ? this.getValue() : null)
		}
	}, updateFavicon: function(D) {
		var C = D ? D.match(/https?:\/\/[^\/]*/) + "/favicon.ico" : A.spacerUrl;if (C != this.favicon.src) {
			A.sn(this.favicon, null, { visibility: "hidden" });this.favicon.src = C;if (this.timer) {
				clearTimeout(this.timer)
			}var E = this;this.timer = setTimeout(function() {
				E.displayFavicon()
			}, 1000)
		}
	}, displayFavicon: function() {
		A.sn(this.favicon, null, { visibility: (this.favicon.naturalWidth != 0) ? "visible" : "hidden" })
	} });A.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";A.registerType("url", A.UrlField)
})(); (function() {
	var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;C.ListField = function(E) {
		this.subFields = [];C.ListField.superclass.constructor.call(this, E)
	};D.extend(C.ListField, C.Field, { setOptions: function(E) {
		C.ListField.superclass.setOptions.call(this, E);this.options.className = E.className ? E.className : "inputEx-Field inputEx-ListField";this.options.sortable = D.isUndefined(E.sortable) ? false : E.sortable;this.options.elementType = E.elementType || { type: "string" };this.options.useButtons = D.isUndefined(E.useButtons) ? false : E.useButtons;this.options.unique = D.isUndefined(E.unique) ? false : E.unique;this.options.listAddLabel = E.listAddLabel || C.messages.listAddLink;this.options.listRemoveLabel = E.listRemoveLabel || C.messages.listRemoveLink
	}, renderComponent: function() {
		if (this.options.useButtons) {
			this.addButton = C.cn("img", { src: C.spacerUrl, className: "inputEx-ListField-addButton" });this.fieldContainer.appendChild(this.addButton)
		}this.fieldContainer.appendChild(C.cn("span", null, { marginLeft: "4px" }, this.options.listLabel));this.childContainer = C.cn("div", { className: "inputEx-ListField-childContainer" });this.fieldContainer.appendChild(this.childContainer);if (!this.options.useButtons) {
			this.addButton = C.cn("a", { className: "inputEx-List-link" }, null, this.options.listAddLabel);this.fieldContainer.appendChild(this.addButton)
		}
	}, initEvents: function() {
		A.addListener(this.addButton, "click", this.onAddButton, this, true)
	}, validate: function() {
		var F = true;var J = { };for (var G = 0; G < this.subFields.length && F; G++) {
			var E = this.subFields[G];E.setClassFromState();var H = E.getState();if (H == C.stateRequired || H == C.stateInvalid) {
				F = false
			}if (this.options.unique) {
				var I = D.dump(E.getValue());if (J[I]) {
					F = false
				} else {
					J[I] = true
				}
			}
		}return F
	}, setValue: function(H, E) {
		if (!D.isArray(H)) {
			return
		}for (var G = 0; G < H.length; G++) {
			if (G == this.subFields.length) {
				this.addElement(H[G])
			} else {
				this.subFields[G].setValue(H[G], false)
			}
		}var F = this.subFields.length - H.length;if (F > 0) {
			for (var G = 0; G < F; G++) {
				this.removeElement(H.length)
			}
		}C.ListField.superclass.setValue.call(this, H, E)
	}, getValue: function() {
		var E = [];for (var F = 0; F < this.subFields.length; F++) {
			E[F] = this.subFields[F].getValue()
		}return E
	}, addElement: function(F) {
		var E = this.renderSubField(F);this.subFields.push(E);return E
	}, onAddButton: function(F) {
		A.stopEvent(F);var E = this.addElement();E.focus();this.fireUpdatedEvt()
	}, renderSubField: function(L) {
		var H = C.cn("div");if (this.options.useButtons) {
			var F = C.cn("img", { src: C.spacerUrl, className: "inputEx-ListField-delButton" });A.addListener(F, "click", this.onDelete, this, true);H.appendChild(F)
		}var K = D.merge( { }, this.options.elementType);if (!K.inputParams) {
			K.inputParams = { }
		}if (!D.isUndefined(L)) {
			K.inputParams.value = L
		}var I = C.buildField(K);var G = I.getEl();B.setStyle(G, "margin-left", "4px");B.setStyle(G, "float", "left");H.appendChild(G);I.updatedEvt.subscribe(this.onChange, this, true);if (this.options.sortable) {
			var J = C.cn("div", { className: "inputEx-ListField-Arrow inputEx-ListField-ArrowUp" });A.addListener(J, "click", this.onArrowUp, this, true);var E = C.cn("div", { className: "inputEx-ListField-Arrow inputEx-ListField-ArrowDown" });A.addListener(E, "click", this.onArrowDown, this, true);H.appendChild(J);H.appendChild(E)
		}if (!this.options.useButtons) {
			var F = C.cn("a", { className: "inputEx-List-link" }, null, this.options.listRemoveLabel);A.addListener(F, "click", this.onDelete, this, true);H.appendChild(F)
		}H.appendChild(C.cn("div", null, { clear: "both" }));this.childContainer.appendChild(H);return I
	}, onArrowUp: function(K) {
		var H = A.getTarget(K).parentNode;var F = null;var G = -1;for (var I = 1; I < H.parentNode.childNodes.length; I++) {
			var E = H.parentNode.childNodes[I];if (E == H) {
				F = H.parentNode.childNodes[I - 1];G = I;break
			}
		}if (F) {
			var L = this.childContainer.removeChild(H);var J = this.childContainer.insertBefore(L, F);var M = this.subFields[G];this.subFields[G] = this.subFields[G - 1];this.subFields[G - 1] = M;if (this.arrowAnim) {
				this.arrowAnim.stop(true)
			}this.arrowAnim = new YAHOO.util.ColorAnim(J, { backgroundColor: { from: "#eeee33", to: "#eeeeee" } }, 0.4);this.arrowAnim.onComplete.subscribe(function() {
				B.setStyle(J, "background-color", "")
			});this.arrowAnim.animate();this.fireUpdatedEvt()
		}
	}, onArrowDown: function(K) {
		var G = A.getTarget(K).parentNode;var F = -1;var J = null;for (var H = 0; H < G.parentNode.childNodes.length; H++) {
			var E = G.parentNode.childNodes[H];if (E == G) {
				J = G.parentNode.childNodes[H + 1];F = H;break
			}
		}if (J) {
			var L = this.childContainer.removeChild(G);var I = B.insertAfter(L, J);var M = this.subFields[F];this.subFields[F] = this.subFields[F + 1];this.subFields[F + 1] = M;if (this.arrowAnim) {
				this.arrowAnim.stop(true)
			}this.arrowAnim = new YAHOO.util.ColorAnim(I, { backgroundColor: { from: "#eeee33", to: "#eeeeee" } }, 1);this.arrowAnim.onComplete.subscribe(function() {
				B.setStyle(I, "background-color", "")
			});this.arrowAnim.animate();this.fireUpdatedEvt()
		}
	}, onDelete: function(I) {
		A.stopEvent(I);var F = A.getTarget(I).parentNode;var E = -1;var H = F.childNodes[this.options.useButtons ? 1 : 0];for (var G = 0; G < this.subFields.length; G++) {
			if (this.subFields[G].getEl() == H) {
				E = G;break
			}
		}if (E != -1) {
			this.removeElement(E)
		}this.fireUpdatedEvt()
	}, removeElement: function(F) {
		var E = this.subFields[F].getEl().parentNode;this.subFields[F] = undefined;this.subFields = C.compactArray(this.subFields);E.parentNode.removeChild(E)
	} });C.registerType("list", C.ListField);C.messages.listAddLink = "Add";C.messages.listRemoveLink = "remove"
})(); (function() {
	var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;C.CheckBox = function(E) {
		C.CheckBox.superclass.constructor.call(this, E)
	};D.extend(C.CheckBox, C.Field, { setOptions: function(E) {
		C.CheckBox.superclass.setOptions.call(this, E);this.options.className = E.className ? E.className : "inputEx-Field inputEx-CheckBox";this.options.rightLabel = E.rightLabel || "";this.sentValues = E.sentValues || [true,false];this.options.sentValues = this.sentValues;this.checkedValue = this.sentValues[0];this.uncheckedValue = this.sentValues[1]
	}, renderComponent: function() {
		var E = this.divEl.id ? this.divEl.id + "-field" : YAHOO.util.Dom.generateId();this.el = C.cn("input", { id: E, type: "checkbox", checked: (this.options.checked === false) ? false : true });this.fieldContainer.appendChild(this.el);this.rightLabelEl = C.cn("label", { "for": E, className: "inputEx-CheckBox-rightLabel" }, null, this.options.rightLabel);this.fieldContainer.appendChild(this.rightLabelEl);this.hiddenEl = C.cn("input", { type: "hidden", name: this.options.name || "", value: this.el.checked ? this.checkedValue : this.uncheckedValue });this.fieldContainer.appendChild(this.hiddenEl)
	}, initEvents: function() {
		A.addListener(this.el, "change", this.onChange, this, true);if (YAHOO.env.ua.ie) {
			A.addListener(this.el, "click", function() {
				YAHOO.lang.later(10, this, this.fireUpdatedEvt)
			}, this, true)
		}A.addFocusListener(this.el, this.onFocus, this, true);A.addBlurListener(this.el, this.onBlur, this, true)
	}, onChange: function(E) {
		this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;if (!YAHOO.env.ua.ie) {
			C.CheckBox.superclass.onChange.call(this, E)
		}
	}, getValue: function() {
		return this.el.checked ? this.checkedValue : this.uncheckedValue
	}, setValue: function(F, E) {
		if (F === this.checkedValue) {
			this.hiddenEl.value = F;this.el.checked = true
		} else {
			this.hiddenEl.value = F;this.el.checked = false
		}C.CheckBox.superclass.setValue.call(this, F, E)
	}, disable: function() {
		this.el.disabled = true
	}, enable: function() {
		this.el.disabled = false
	} });C.registerType("boolean", C.CheckBox)
})(); (function() {
	var C = YAHOO.inputEx, D = YAHOO.lang, A = YAHOO.util.Event, B = YAHOO.util.Dom;C.InPlaceEdit = function(E) {
		C.InPlaceEdit.superclass.constructor.call(this, E)
	};D.extend(C.InPlaceEdit, C.Field, { setOptions: function(E) {
		C.InPlaceEdit.superclass.setOptions.call(this, E);this.options.animColors = E.animColors || { from: "#ffff99", to: "#ffffff" };this.options.visu = E.visu;this.options.editorField = E.editorField
	}, renderComponent: function() {
		this.renderVisuDiv();this.renderEditor()
	}, renderEditor: function() {
		this.editorContainer = C.cn("div", { className: "inputEx-InPlaceEdit-editor" }, { display: "none" });this.editorField = C.buildField(this.options.editorField);this.editorContainer.appendChild(this.editorField.getEl());B.setStyle(this.editorField.getEl(), "float", "left");this.okButton = C.cn("input", { type: "button", value: C.messages.okEditor, className: "inputEx-InPlaceEdit-OkButton" });B.setStyle(this.okButton, "float", "left");this.editorContainer.appendChild(this.okButton);this.cancelLink = C.cn("a", { className: "inputEx-InPlaceEdit-CancelLink" }, null, C.messages.cancelEditor);this.cancelLink.href = "";B.setStyle(this.cancelLink, "float", "left");this.editorContainer.appendChild(this.cancelLink);this.editorContainer.appendChild(C.cn("div", null, { clear: "both" }));this.fieldContainer.appendChild(this.editorContainer)
	}, onVisuMouseOver: function(E) {
		if (this.colorAnim) {
			this.colorAnim.stop(true)
		}C.sn(this.formattedContainer, null, { backgroundColor: this.options.animColors.from })
	}, onVisuMouseOut: function(E) {
		if (this.colorAnim) {
			this.colorAnim.stop(true)
		}this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, { backgroundColor: this.options.animColors }, 1);this.colorAnim.onComplete.subscribe(function() {
			B.setStyle(this.formattedContainer, "background-color", "")
		}, this, true);this.colorAnim.animate()
	}, renderVisuDiv: function() {
		this.formattedContainer = C.cn("div", { className: "inputEx-InPlaceEdit-visu" });if (D.isFunction(this.options.formatDom)) {
			this.formattedContainer.appendChild(this.options.formatDom(this.options.value))
		} else {
			if (D.isFunction(this.options.formatValue)) {
				this.formattedContainer.innerHTML = this.options.formatValue(this.options.value)
			} else {
				this.formattedContainer.innerHTML = D.isUndefined(this.options.value) ? C.messages.emptyInPlaceEdit : this.options.value
			}
		}this.fieldContainer.appendChild(this.formattedContainer)
	}, initEvents: function() {
		A.addListener(this.formattedContainer, "click", this.openEditor, this, true);A.addListener(this.formattedContainer, "mouseover", this.onVisuMouseOver, this, true);A.addListener(this.formattedContainer, "mouseout", this.onVisuMouseOut, this, true);A.addListener(this.okButton, "click", this.onOkEditor, this, true);A.addListener(this.cancelLink, "click", this.onCancelEditor, this, true);if (this.editorField.el) {
			A.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);A.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true)
		}
	}, onKeyUp: function(E) {
		if (E.keyCode == 13) {
			this.onOkEditor()
		}if (E.keyCode == 27) {
			this.onCancelEditor(E)
		}
	}, onKeyDown: function(E) {
		if (E.keyCode == 9) {
			this.onOkEditor()
		}
	}, onOkEditor: function() {
		var F = this.editorField.getValue();this.setValue(F);this.editorContainer.style.display = "none";this.formattedContainer.style.display = "";var E = this;setTimeout(function() {
			E.updatedEvt.fire(F)
		}, 50)
	}, onCancelEditor: function(E) {
		A.stopEvent(E);this.editorContainer.style.display = "none";this.formattedContainer.style.display = ""
	}, openEditor: function() {
		var E = this.getValue();this.editorContainer.style.display = "";this.formattedContainer.style.display = "none";if (!D.isUndefined(E)) {
			this.editorField.setValue(E)
		}this.editorField.focus();if (this.editorField.el && D.isFunction(this.editorField.el.setSelectionRange) && (!!E && !!E.length)) {
			this.editorField.el.setSelectionRange(0, E.length)
		}
	}, getValue: function() {
		var E = (this.editorContainer.style.display == "");return E ? this.editorField.getValue() : this.value
	}, setValue: function(F, E) {
		this.value = F;if (D.isUndefined(F) || F == "") {
			C.renderVisu(this.options.visu, C.messages.emptyInPlaceEdit, this.formattedContainer)
		} else {
			C.renderVisu(this.options.visu, this.value, this.formattedContainer)
		}if (this.editorContainer.style.display == "") {
			this.editorField.setValue(F)
		}C.InPlaceEdit.superclass.setValue.call(this, F, E)
	}, close: function() {
		this.editorContainer.style.display = "none";this.formattedContainer.style.display = ""
	} });C.messages.emptyInPlaceEdit = "(click to edit)";C.messages.cancelEditor = "cancel";C.messages.okEditor = "Ok";C.registerType("inplaceedit", C.InPlaceEdit)
})(); (function() {
	var R = YAHOO.util.Dom, S = YAHOO.util.Event, P = YAHOO.util.Anim;var N = function(A, B) {
			A = R.get(A);B = B || { };if (!A) {
				A = document.createElement(this.CONFIG.TAG_NAME)
			}if (A.id) {
				B.id = A.id
			}YAHOO.widget.AccordionView.superclass.constructor.call(this, A, B);this.initList(A, B);this.refresh(["id","width","hoverActivated"], true)
		};var K = "panelClose";var T = "panelOpen";var M = "afterPanelClose";var O = "afterPanelOpen";var L = "stateChanged";var Q = "beforeStateChange";YAHOO.widget.AccordionView = N;YAHOO.extend(N, YAHOO.util.Element, { initAttributes: function(B) {
		N.superclass.initAttributes.call(this, B);var A = (YAHOO.env.modules.animation) ? true : false;this.setAttributeConfig("id", { writeOnce: true, validator: function(C) {
			return (/^[a-zA-Z][\w0-9\-_.:]*$/.test(C))
		}, value: R.generateId(), method: function(C) {
			this.get("element").id = C
		} });this.setAttributeConfig("width", { value: "400px", method: function(C) {
			this.setStyle("width", C)
		} });this.setAttributeConfig("animationSpeed", { value: 0.7 });this.setAttributeConfig("animate", { value: A, validator: YAHOO.lang.isBoolean });this.setAttributeConfig("collapsible", { value: false, validator: YAHOO.lang.isBoolean });this.setAttributeConfig("expandable", { value: false, validator: YAHOO.lang.isBoolean });this.setAttributeConfig("effect", { value: YAHOO.util.Easing.easeBoth, validator: YAHOO.lang.isString });this.setAttributeConfig("hoverActivated", { value: false, validator: YAHOO.lang.isBoolean, method: function(C) {
			if (C) {
				S.on(this, "mouseover", this._onMouseOver, this, true)
			} else {
				S.removeListener(this, "mouseover", this._onMouseOver)
			}
		} });this.setAttributeConfig("_hoverTimeout", { value: 500, validator: YAHOO.lang.isInteger })
	}, CONFIG: { TAG_NAME: "UL", ITEM_WRAPPER_TAG_NAME: "LI", CONTENT_WRAPPER_TAG_NAME: "DIV" }, CLASSES: { ACCORDION: "yui-accordionview", PANEL: "yui-accordion-panel", TOGGLE: "yui-accordion-toggle", CONTENT: "yui-accordion-content", ACTIVE: "active", HIDDEN: "hidden", INDICATOR: "indicator" }, _idCounter: "1", _hoverTimer: null, _panels: null, _opening: false, _closing: false, _ff2: (YAHOO.env.ua.gecko > 0 && YAHOO.env.ua.gecko < 1.9), _ie: (YAHOO.env.ua.ie < 8 && YAHOO.env.ua.ie > 0), _ARIACapable: (YAHOO.env.ua.ie > 7 || YAHOO.env.ua.gecko >= 1.9), initList: function(F, B) {
		R.addClass(F, this.CLASSES.ACCORDION);this._setARIA(F, "role", "tree");var G = [];var D = F.getElementsByTagName(this.CONFIG.ITEM_WRAPPER_TAG_NAME);for (var H = 0; H < D.length; H++) {
			if (R.hasClass(D[H], "nopanel")) {
				G.push( { label: "SINGLE_LINK", content: D[H].innerHTML.replace(/^\s\s*/, "").replace(/\s\s*$/, "") })
			} else {
				if (D[H].parentNode === F) {
					for (var E = D[H].firstChild; E && E.nodeType != 1; E = E.nextSibling) {
					}if (E) {
						for (var C = E.nextSibling; C && C.nodeType != 1; C = C.nextSibling) {
						}G.push( { label: E.innerHTML, content: (C && C.innerHTML) })
					}
				}
			}
		}F.innerHTML = "";if (G.length > 0) {
			this.addPanels(G)
		}if ( (B.expandItem === 0) || (B.expandItem > 0)) {
			var A = this._panels[B.expandItem].firstChild;var C = this._panels[B.expandItem].firstChild.nextSibling;R.removeClass(C, this.CLASSES.HIDDEN);if (A && C) {
				R.addClass(A, this.CLASSES.ACTIVE);A.tabIndex = 0;this._setARIA(A, "aria-expanded", "true");this._setARIA(C, "aria-hidden", "false")
			}
		}this.initEvents()
	}, initEvents: function() {
		if (true === this.get("hoverActivated")) {
			this.on("mouseover", this._onMouseOver, this, true);this.on("mouseout", this._onMouseOut, this, true)
		}this.on("click", this._onClick, this, true);this.on("keydown", this._onKeydown, this, true);this.on("panelOpen", function() {
			this._opening = true
		}, this, true);this.on("panelClose", function() {
			this._closing = true
		}, this, true);this.on("afterPanelClose", function() {
			this._closing = false;if (!this._closing && !this._opening) {
				this._fixTabIndexes()
			}
		}, this, true);this.on("afterPanelOpen", function() {
			this._opening = false;if (!this._closing && !this._opening) {
				this._fixTabIndexes()
			}
		}, this, true);if (this._ARIACapable) {
			this.on("keypress", function(B) {
				var A = R.getAncestorByClassName(S.getTarget(B), this.CLASSES.PANEL);var C = S.getCharCode(B);if (C === 13) {
					this._onClick(A.firstChild);return false
				}
			})
		}
	}, _setARIA: function(A, B, C) {
		if (this._ARIACapable) {
			A.setAttribute(B, C)
		}
	}, _collapseAccordion: function() {
		R.batch(this._panels, function(A) {
			var B = this.firstChild.nextSibling;if (B) {
				R.removeClass(A.firstChild, this.CLASSES.ACTIVE);R.addClass(B, this.CLASSES.HIDDEN);this._setARIA(B, "aria-hidden", "true")
			}
		}, this)
	}, _fixTabIndexes: function() {
		var C = this._panels.length;var B = true;for (var A = 0; A < C; A++) {
			if (R.hasClass(this._panels[A].firstChild, this.CLASSES.ACTIVE)) {
				this._panels[A].firstChild.tabIndex = 0;B = false
			} else {
				this._panels[A].firstChild.tabIndex = -1
			}
		}if (B) {
			this._panels[0].firstChild.tabIndex = 0
		}this.fireEvent(L)
	}, addPanel: function(G, H) {
		var I = document.createElement(this.CONFIG.ITEM_WRAPPER_TAG_NAME);R.addClass(I, this.CLASSES.PANEL);if (G.label === "SINGLE_LINK") {
			I.innerHTML = G.content;R.addClass(I.firstChild, this.CLASSES.TOGGLE);R.addClass(I.firstChild, "link")
		} else {
			var J = document.createElement("span");R.addClass(J, this.CLASSES.INDICATOR);var E = I.appendChild(document.createElement("A"));E.id = this.get("element").id + "-" + this._idCounter + "-label";E.innerHTML = G.label || "";E.appendChild(J);if (this._ARIACapable) {
				if (G.href) {
					E.href = G.href
				}
			} else {
				E.href = G.href || "#toggle"
			}E.tabIndex = -1;R.addClass(E, this.CLASSES.TOGGLE);var D = document.createElement(this.CONFIG.CONTENT_WRAPPER_TAG_NAME);D.innerHTML = G.content || "";R.addClass(D, this.CLASSES.CONTENT);I.appendChild(D);this._setARIA(I, "role", "presentation");this._setARIA(E, "role", "treeitem");this._setARIA(D, "aria-labelledby", E.id);this._setARIA(J, "role", "presentation")
		}this._idCounter++;if (this._panels === null) {
			this._panels = []
		}if ( (H !== null) && (H !== undefined)) {
			var F = this.getPanel(H);this.insertBefore(I, F);var C = this._panels.slice(0, H);var A = this._panels.slice(H);C.push(I);for (i = 0; i < A.length; i++) {
				C.push(A[i])
			}this._panels = C
		} else {
			this.appendChild(I);if (this.get("element") === I.parentNode) {
				this._panels[this._panels.length] = I
			}
		}if (G.label !== "SINGLE_LINK") {
			if (G.expand) {
				if (!this.get("expandable")) {
					this._collapseAccordion()
				}R.removeClass(D, this.CLASSES.HIDDEN);R.addClass(E, this.CLASSES.ACTIVE);this._setARIA(D, "aria-hidden", "false");this._setARIA(E, "aria-expanded", "true")
			} else {
				R.addClass(D, "hidden");this._setARIA(D, "aria-hidden", "true");this._setARIA(E, "aria-expanded", "false")
			}
		}var B = YAHOO.lang.later(0, this, function() {
				this._fixTabIndexes();this.fireEvent(L)
			})
	}, addPanels: function(A) {
		for (var B = 0; B < A.length; B++) {
			this.addPanel(A[B])
		}
	}, removePanel: function(B) {
		this.removeChild(R.getElementsByClassName(this.CLASSES.PANEL, this.CONFIG.ITEM_WRAPPER_TAG_NAME, this)[B]);var D = [];var C = this._panels.length;for (var E = 0; E < C; E++) {
			if (E !== B) {
				D.push(this._panels[E])
			}
		}this._panels = D;var A = YAHOO.lang.later(0, this, function() {
				this._fixTabIndexes();this.fireEvent(L)
			})
	}, getPanel: function(A) {
		return this._panels[A]
	}, getPanels: function() {
		return this._panels
	}, openPanel: function(B) {
		var A = this._panels[B];if (!A) {
			return false
		}if (R.hasClass(A.firstChild, this.CLASSES.ACTIVE)) {
			return false
		}this._onClick(A.firstChild);return true
	}, closePanel: function(B) {
		var A = this._panels;var C = A[B];if (!C) {
			return false
		}var D = C.firstChild;if (!R.hasClass(D, this.CLASSES.ACTIVE)) {
			return true
		}if (this.get("collapsible") === false) {
			if (this.get("expandable") === true) {
				this.set("collapsible", true);for (var E = 0; E < A.length; E++) {
					if ( (R.hasClass(A[E].firstChild, this.CLASSES.ACTIVE) && E !== B)) {
						this._onClick(D);this.set("collapsible", false);return true
					}
				}this.set("collapsible", false)
			}
		}this._onClick(D);return true
	}, _onKeydown: function(A) {
		var D = R.getAncestorByClassName(S.getTarget(A), this.CLASSES.PANEL);var C = S.getCharCode(A);var E = this._panels.length;if (C === 37 || C === 38) {
			for (var B = 0; B < E; B++) {
				if ( (D === this._panels[B]) && B > 0) {
					this._panels[B - 1].firstChild.focus();return
				}
			}
		}if (C === 39 || C === 40) {
			for (var B = 0; B < E; B++) {
				if ( (D === this._panels[B]) && B < E - 1) {
					this._panels[B + 1].firstChild.focus();return
				}
			}
		}
	}, _onMouseOver: function(B) {
		S.stopPropagation(B);var A = S.getTarget(B);this._hoverTimer = YAHOO.lang.later(this.get("_hoverTimeout"), this, function() {
			this._onClick(A)
		})
	}, _onMouseOut: function() {
		if (this._hoverTimer) {
			this._hoverTimer.cancel();this._hoverTimer = null
		}
	}, _onClick: function(B) {
		var E;if (B.nodeType === undefined) {
			E = S.getTarget(B);if (!R.hasClass(E, this.CLASSES.TOGGLE) && !R.hasClass(E, this.CLASSES.INDICATOR)) {
				return false
			}if (R.hasClass(E, "link")) {
				return true
			}S.preventDefault(B);S.stopPropagation(B)
		} else {
			E = B
		}var D = E;var G = this;function C(Y, Z) {
			if (G._ie) {
				var U = R.getElementsByClassName(G.CLASSES.ACCORDION, G.CONFIG.TAG_NAME, Y);if (U[0]) {
					R.setStyle(U[0], "visibility", Z)
				}
			}
		}
		function F(h, f) {
			var U = this;function k(X, Z) {
				if (!R.hasClass(Z, U.CLASSES.PANEL)) {
					Z = R.getAncestorByClassName(Z, U.CLASSES.PANEL)
				}for (var Y = 0, W = Z; W.previousSibling; Y++) {
					W = W.previousSibling
				}return U.fireEvent(X, { panel: Z, index: Y })
			}
			if (!f) {
				if (!h) {
					return false
				}f = h.parentNode.firstChild
			}var n = { };var m = 0;var o = (!R.hasClass(h, this.CLASSES.HIDDEN));if (this.get("animate")) {
				if (!o) {
					if (this._ff2) {
						R.addClass(h, "almosthidden");R.setStyle(h, "width", this.get("width"))
					}R.removeClass(h, this.CLASSES.HIDDEN);m = h.offsetHeight;R.setStyle(h, "height", 0);if (this._ff2) {
						R.removeClass(h, "almosthidden");R.setStyle(h, "width", "auto")
					}n = { height: { from: 0, to: m } }
				} else {
					m = h.offsetHeight;n = { height: { from: m, to: 0 } }
				}var l = (this.get("animationSpeed")) ? this.get("animationSpeed") : 0.5;var g = (this.get("effect")) ? this.get("effect") : YAHOO.util.Easing.easeBoth;var j = new P(h, n, l, g);if (o) {
					if (this.fireEvent(K, h) === false) {
						return
					}R.removeClass(f, U.CLASSES.ACTIVE);f.tabIndex = -1;C(h, "hidden");U._setARIA(h, "aria-hidden", "true");U._setARIA(f, "aria-expanded", "false");j.onComplete.subscribe(function() {
						R.addClass(h, U.CLASSES.HIDDEN);R.setStyle(h, "height", "auto");k("afterPanelClose", h)
					})
				} else {
					if (k(T, h) === false) {
						return
					}C(h, "hidden");j.onComplete.subscribe(function() {
						R.setStyle(h, "height", "auto");C(h, "visible");U._setARIA(h, "aria-hidden", "false");U._setARIA(f, "aria-expanded", "true");f.tabIndex = 0;k(O, h)
					});R.addClass(f, this.CLASSES.ACTIVE)
				}j.animate()
			} else {
				if (o) {
					if (k(K, h) === false) {
						return
					}R.addClass(h, U.CLASSES.HIDDEN);R.setStyle(h, "height", "auto");R.removeClass(f, U.CLASSES.ACTIVE);U._setARIA(h, "aria-hidden", "true");U._setARIA(f, "aria-expanded", "false");f.tabIndex = -1;k(M, h)
				} else {
					if (k(T, h) === false) {
						return
					}R.removeClass(h, U.CLASSES.HIDDEN);R.setStyle(h, "height", "auto");R.addClass(f, U.CLASSES.ACTIVE);U._setARIA(h, "aria-hidden", "false");U._setARIA(f, "aria-expanded", "true");f.tabIndex = 0;k(O, h)
				}
			}return true
		}
		var V = (D.nodeName.toUpperCase() === "SPAN") ? D.parentNode.parentNode : D.parentNode;var H = R.getElementsByClassName(this.CLASSES.CONTENT, this.CONFIG.CONTENT_WRAPPER_TAG_NAME, V)[0];if (this.fireEvent(Q, this) === false) {
			return
		}if (this.get("collapsible") === false) {
			if (!R.hasClass(H, this.CLASSES.HIDDEN)) {
				return false
			}
		} else {
			if (!R.hasClass(H, this.CLASSES.HIDDEN)) {
				F.call(this, H);return false
			}
		}if (this.get("expandable") !== true) {
			var A = this._panels.length;for (var I = 0; I < A; I++) {
				var J = R.hasClass(this._panels[I].firstChild.nextSibling, this.CLASSES.HIDDEN);if (!J) {
					F.call(this, this._panels[I].firstChild.nextSibling)
				}
			}
		}if (D.nodeName.toUpperCase() === "SPAN") {
			F.call(this, H, D.parentNode)
		} else {
			F.call(this, H, D)
		}return true
	}, toString: function() {
		var A = this.get("id") || this.get("tagName");return"AccordionView " + A
	} })
})();YAHOO.register("accordionview", YAHOO.widget.AccordionView, { version: "0.99", build: "33" });var WireIt = { getIntStyle: function(B, A) {
		var C = YAHOO.util.Dom.getStyle(B, A);return parseInt(C.substr(0, C.length - 2), 10)
	}, sn: function(D, C, A) {
		if (!D) {
			return
		}if (C) {
			for (var B in C) {
				var E = C[B];if (typeof (E) == "function") {
					continue
				}if (B == "className") {
					B = "class";D.className = E
				}if (E !== D.getAttribute(B)) {
					if (E === false) {
						D.removeAttribute(B)
					} else {
						D.setAttribute(B, E)
					}
				}
			}
		}if (A) {
			for (var B in A) {
				if (typeof (A[B]) == "function") {
					continue
				}if (D.style[B] != A[B]) {
					D.style[B] = A[B]
				}
			}
		}
	}, cn: function(A, C, B, E) {
		var D = document.createElement(A);this.sn(D, C, B);if (E) {
			D.innerHTML = E
		}return D
	}, indexOf: YAHOO.lang.isFunction(Array.prototype.indexOf) ? function(B, A) {
		return A.indexOf(B)
	} : function(C, A) {
		for (var B = 0; B < A.length; B++) {
			if (A[B] == C) {
				return B
			}
		}return -1
	}, compact: YAHOO.lang.isFunction(Array.prototype.compact) ? function(A) {
		return A.compact()
	} : function(A) {
		var C = [];for (var B = 0; B < A.length; B++) {
			if (A[B]) {
				C.push(A[B])
			}
		}return C
	} };WireIt.util = { }; (function() {
	var A = YAHOO.util.Event, B = YAHOO.env.ua;WireIt.CanvasElement = function(C) {
		this.element = document.createElement("canvas");C.appendChild(this.element);if (typeof (G_vmlCanvasManager) != "undefined") {
			this.element = G_vmlCanvasManager.initElement(this.element)
		}
	};WireIt.CanvasElement.prototype = { getContext: function(C) {
		return this.element.getContext(C || "2d")
	}, destroy: function() {
		var C = this.element;if (YAHOO.util.Dom.inDocument(C)) {
			C.parentNode.removeChild(C)
		}A.purgeElement(C, true)
	}, SetCanvasRegion: B.ie ? function(G, F, E, C) {
		var D = this.element;WireIt.sn(D, null, { left: G + "px", top: F + "px", width: E + "px", height: C + "px" });D.getContext("2d").clearRect(0, 0, E, C);this.element = D
	} : ( (B.webkit || B.opera) ? function(F, J, C, K) {
		var D = this.element;var H = WireIt.cn("canvas", { className: D.className || D.getAttribute("class"), width: C, height: K }, { left: F + "px", top: J + "px" });var I = A.getListeners(D);for (var E in I) {
			var G = I[E];A.addListener(H, G.type, G.fn, G.obj, G.adjust)
		}A.purgeElement(D);D.parentNode.replaceChild(H, D);this.element = H
	} : function(F, E, D, C) {
		WireIt.sn(this.element, { width: D, height: C }, { left: F + "px", top: E + "px" })
	}) }
})();WireIt.Wire = function(D, C, B, A) {
	this.parentEl = B;this.terminal1 = D;this.terminal2 = C;this.eventMouseClick = new YAHOO.util.CustomEvent("eventMouseClick");this.eventMouseIn = new YAHOO.util.CustomEvent("eventMouseIn");this.eventMouseOut = new YAHOO.util.CustomEvent("eventMouseOut");this.eventMouseMove = new YAHOO.util.CustomEvent("eventMouseMove");this.setOptions(A || { });WireIt.Wire.superclass.constructor.call(this, this.parentEl);YAHOO.util.Dom.addClass(this.element, this.options.className);this.terminal1.addWire(this);this.terminal2.addWire(this)
};YAHOO.lang.extend(WireIt.Wire, WireIt.CanvasElement, { setOptions: function(A) {
	this.options = { };this.options.className = A.className || "WireIt-Wire";this.options.coeffMulDirection = YAHOO.lang.isUndefined(A.coeffMulDirection) ? 100 : A.coeffMulDirection;this.options.drawingMethod = A.drawingMethod || "bezier";this.options.cap = A.cap || "round";this.options.bordercap = A.bordercap || "round";this.options.width = A.width || 3;this.options.borderwidth = A.borderwidth || 1;this.options.color = A.color || "rgb(173, 216, 230)";this.options.bordercolor = A.bordercolor || "#0000ff"
}, remove: function() {
	this.parentEl.removeChild(this.element);if (this.terminal1 && this.terminal1.removeWire) {
		this.terminal1.removeWire(this)
	}if (this.terminal2 && this.terminal2.removeWire) {
		this.terminal2.removeWire(this)
	}this.terminal1 = null;this.terminal2 = null
}, drawBezierCurve: function() {
	var O = this.terminal1.getXY();var M = this.terminal2.getXY();var F = this.options.coeffMulDirection;var B = Math.sqrt(Math.pow(O[0] - M[0], 2) + Math.pow(O[1] - M[1], 2));if (B < F) {
		F = B / 2
	}var C = [this.terminal1.options.direction[0] * F,this.terminal1.options.direction[1] * F];var A = [this.terminal2.options.direction[0] * F,this.terminal2.options.direction[1] * F];var L = [];L[0] = O;L[1] = [O[0] + C[0],O[1] + C[1]];L[2] = [M[0] + A[0],M[1] + A[1]];L[3] = M;var H = [O[0],O[1]];var K = [O[0],O[1]];for (var I = 1; I < L.length; I++) {
		var D = L[I];if (D[0] < H[0]) {
			H[0] = D[0]
		}if (D[1] < H[1]) {
			H[1] = D[1]
		}if (D[0] > K[0]) {
			K[0] = D[0]
		}if (D[1] > K[1]) {
			K[1] = D[1]
		}
	}var G = [4,4];H[0] = H[0] - G[0];H[1] = H[1] - G[1];K[0] = K[0] + G[0];K[1] = K[1] + G[1];var E = Math.abs(K[0] - H[0]);var N = Math.abs(K[1] - H[1]);this.SetCanvasRegion(H[0], H[1], E, N);var J = this.getContext();for (I = 0; I < L.length; I++) {
		L[I][0] = L[I][0] - H[0];L[I][1] = L[I][1] - H[1]
	}J.lineCap = this.options.bordercap;J.strokeStyle = this.options.bordercolor;J.lineWidth = this.options.width + this.options.borderwidth * 2;J.beginPath();J.moveTo(L[0][0], L[0][1]);J.bezierCurveTo(L[1][0], L[1][1], L[2][0], L[2][1], L[3][0], L[3][1]);J.stroke();J.lineCap = this.options.cap;J.strokeStyle = this.options.color;J.lineWidth = this.options.width;J.beginPath();J.moveTo(L[0][0], L[0][1]);J.bezierCurveTo(L[1][0], L[1][1], L[2][0], L[2][1], L[3][0], L[3][1]);J.stroke()
}, drawBezierArrows: function() {
	var E = Math.round(this.options.width * 1.5 + 20);var P = Math.round(this.options.width * 1.2 + 20);var n = E / 2;var G = n + 3;var F = [4 + G,4 + G];var m = this.terminal1.getXY();var l = this.terminal2.getXY();var r = this.options.coeffMulDirection;var O = Math.sqrt(Math.pow(m[0] - l[0], 2) + Math.pow(m[1] - l[1], 2));if (O < r) {
		r = O / 2
	}var j = [this.terminal1.options.direction[0] * r,this.terminal1.options.direction[1] * r];var h = [this.terminal2.options.direction[0] * r,this.terminal2.options.direction[1] * r];var N = [];N[0] = m;N[1] = [m[0] + j[0],m[1] + j[1]];N[2] = [l[0] + h[0],l[1] + h[1]];N[3] = l;var q = [m[0],m[1]];var Q = [m[0],m[1]];for (var k = 1; k < N.length; k++) {
		var e = N[k];if (e[0] < q[0]) {
			q[0] = e[0]
		}if (e[1] < q[1]) {
			q[1] = e[1]
		}if (e[0] > Q[0]) {
			Q[0] = e[0]
		}if (e[1] > Q[1]) {
			Q[1] = e[1]
		}
	}q[0] = q[0] - F[0];q[1] = q[1] - F[1];Q[0] = Q[0] + F[0];Q[1] = Q[1] + F[1];var R = Math.abs(Q[0] - q[0]);var X = Math.abs(Q[1] - q[1]);this.SetCanvasRegion(q[0], q[1], R, X);var g = this.getContext();for (k = 0; k < N.length; k++) {
		N[k][0] = N[k][0] - q[0];N[k][1] = N[k][1] - q[1]
	}g.lineCap = this.options.bordercap;g.strokeStyle = this.options.bordercolor;g.lineWidth = this.options.width + this.options.borderwidth * 2;g.beginPath();g.moveTo(N[0][0], N[0][1]);g.bezierCurveTo(N[1][0], N[1][1], N[2][0], N[2][1], N[3][0], N[3][1] + P / 2 * this.terminal2.options.direction[1]);g.stroke();g.lineCap = this.options.cap;g.strokeStyle = this.options.color;g.lineWidth = this.options.width;g.beginPath();g.moveTo(N[0][0], N[0][1]);g.bezierCurveTo(N[1][0], N[1][1], N[2][0], N[2][1], N[3][0], N[3][1] + P / 2 * this.terminal2.options.direction[1]);g.stroke();var V = N[2], U = l;var Z = [0,0];var H = P;var c = 1 - (H / O);Z[0] = Math.abs(V[0] + c * (U[0] - V[0]));Z[1] = Math.abs(V[1] + c * (U[1] - V[1]));var D = V[0] - U[0];var T = V[1] - U[1];var S = V[0] * U[1] - V[1] * U[0];if (D !== 0) {
		a = T / D;b = S / D
	} else {
		a = 0
	}if (a === 0) {
		aProst = 0
	} else {
		aProst = -1 / a
	}bProst = Z[1] - aProst * Z[0];var L = 1 + Math.pow(aProst, 2), J = 2 * aProst * bProst - 2 * Z[0] - 2 * Z[1] * aProst, I = -2 * Z[1] * bProst + Math.pow(Z[0], 2) + Math.pow(Z[1], 2) - Math.pow(n, 2) + Math.pow(bProst, 2), Y = Math.pow(J, 2) - 4 * L * I;if (Y < 0) {
		return
	}var M = (-J + Math.sqrt(Y)) / (2 * L), K = (-J - Math.sqrt(Y)) / (2 * L), u = aProst * M + bProst, s = aProst * K + bProst;if (V[1] == U[1]) {
		var f = (V[0] > U[0]) ? 1 : -1;M = U[0] + f * H;K = M;u -= n;s += n
	}g.fillStyle = this.options.color;g.beginPath();g.moveTo(U[0], U[1]);g.lineTo(M, u);g.lineTo(K, s);g.fill();g.strokeStyle = this.options.bordercolor;g.lineWidth = this.options.borderwidth;g.beginPath();g.moveTo(U[0], U[1]);g.lineTo(M, u);g.lineTo(K, s);g.lineTo(U[0], U[1]);g.stroke()
}, getOtherTerminal: function(A) {
	return (A == this.terminal1) ? this.terminal2 : this.terminal1
}, drawArrows: function() {
	var h = 7;var G = h + 3;var V = [4 + G,4 + G];var E = this.terminal1.getXY();var D = this.terminal2.getXY();var J = Math.sqrt(Math.pow(E[0] - D[0], 2) + Math.pow(E[1] - D[1], 2));var c = [Math.min(E[0], D[0]) - V[0],Math.min(E[1], D[1]) - V[1]];var e = [Math.max(E[0], D[0]) + V[0],Math.max(E[1], D[1]) + V[1]];var K = Math.abs(e[0] - c[0]) + G;var T = Math.abs(e[1] - c[1]) + G;E[0] = E[0] - c[0];E[1] = E[1] - c[1];D[0] = D[0] - c[0];D[1] = D[1] - c[1];this.SetCanvasRegion(c[0], c[1], K, T);var M = this.getContext();M.lineCap = this.options.bordercap;M.strokeStyle = this.options.bordercolor;M.lineWidth = this.options.width + this.options.borderwidth * 2;M.beginPath();M.moveTo(E[0], E[1]);M.lineTo(D[0], D[1]);M.stroke();M.lineCap = this.options.cap;M.strokeStyle = this.options.color;M.lineWidth = this.options.width;M.beginPath();M.moveTo(E[0], E[1]);M.lineTo(D[0], D[1]);M.stroke();var P = E;var O = D;var N = [0,0];var L = 20;var R = (J == 0) ? 0 : 1 - (L / J);N[0] = Math.abs(P[0] + R * (O[0] - P[0]));N[1] = Math.abs(P[1] + R * (O[1] - P[1]));var I = P[0] - O[0];var S = P[1] - O[1];var Q = P[0] * O[1] - P[1] * O[0];if (I !== 0) {
		a = S / I;b = Q / I
	} else {
		a = 0
	}if (a == 0) {
		aProst = 0
	} else {
		aProst = -1 / a
	}bProst = N[1] - aProst * N[0];var Y = 1 + Math.pow(aProst, 2);var X = 2 * aProst * bProst - 2 * N[0] - 2 * N[1] * aProst;var U = -2 * N[1] * bProst + Math.pow(N[0], 2) + Math.pow(N[1], 2) - Math.pow(h, 2) + Math.pow(bProst, 2);var j = Math.pow(X, 2) - 4 * Y * U;if (j < 0) {
		return
	}var g = (-X + Math.sqrt(j)) / (2 * Y);var f = (-X - Math.sqrt(j)) / (2 * Y);var H = aProst * g + bProst;var F = aProst * f + bProst;if (P[1] == O[1]) {
		var Z = (P[0] > O[0]) ? 1 : -1;g = O[0] + Z * L;f = g;H -= h;F += h
	}M.fillStyle = this.options.color;M.beginPath();M.moveTo(O[0], O[1]);M.lineTo(g, H);M.lineTo(f, F);M.fill();M.strokeStyle = this.options.bordercolor;M.lineWidth = this.options.borderwidth;M.beginPath();M.moveTo(O[0], O[1]);M.lineTo(g, H);M.lineTo(f, F);M.lineTo(O[0], O[1]);M.stroke()
}, drawStraight: function() {
	var E = [4,4];var H = this.terminal1.getXY();var G = this.terminal2.getXY();var D = [Math.min(H[0], G[0]) - E[0],Math.min(H[1], G[1]) - E[1]];var B = [Math.max(H[0], G[0]) + E[0],Math.max(H[1], G[1]) + E[1]];var F = Math.abs(B[0] - D[0]);var C = Math.abs(B[1] - D[1]);H[0] = H[0] - D[0];H[1] = H[1] - D[1];G[0] = G[0] - D[0];G[1] = G[1] - D[1];this.SetCanvasRegion(D[0], D[1], F, C);var A = this.getContext();A.lineCap = this.options.bordercap;A.strokeStyle = this.options.bordercolor;A.lineWidth = this.options.width + this.options.borderwidth * 2;A.beginPath();A.moveTo(H[0], H[1]);A.lineTo(G[0], G[1]);A.stroke();A.lineCap = this.options.cap;A.strokeStyle = this.options.color;A.lineWidth = this.options.width;A.beginPath();A.moveTo(H[0], H[1]);A.lineTo(G[0], G[1]);A.stroke()
}, redraw: function() {
	if (this.options.drawingMethod == "straight") {
		this.drawStraight()
	} else {
		if (this.options.drawingMethod == "arrows") {
			this.drawArrows()
		} else {
			if (this.options.drawingMethod == "bezier") {
				this.drawBezierCurve()
			} else {
				if (this.options.drawingMethod == "bezierArrows") {
					this.drawBezierArrows()
				} else {
					throw new Error("WireIt.Wire unable to find '" + this.drawingMethod + "' drawing method.")
				}
			}
		}
	}
}, wireDrawnAt: function(B, E) {
	var A = this.getContext();var D = A.getImageData(B, E, 1, 1);var C = D.data;return ! (C[0] === 0 && C[1] === 0 && C[2] === 0 && C[3] === 0)
}, onMouseMove: function(A, B) {
	if (typeof this.mouseInState === undefined) {
		this.mouseInState = false
	}if (this.wireDrawnAt(A, B)) {
		if (!this.mouseInState) {
			this.mouseInState = true;this.onWireIn(A, B)
		}this.onWireMove(A, B)
	} else {
		if (this.mouseInState) {
			this.mouseInState = false;this.onWireOut(A, B)
		}
	}
}, onWireMove: function(A, B) {
	this.eventMouseMove.fire(this, [A,B])
}, onWireIn: function(A, B) {
	this.eventMouseIn.fire(this, [A,B])
}, onWireOut: function(A, B) {
	this.eventMouseOut.fire(this, [A,B])
}, onClick: function(A, B) {
	if (this.wireDrawnAt(A, B)) {
		this.onWireClick(A, B)
	}
}, onWireClick: function(A, B) {
	this.eventMouseClick.fire(this, [A,B])
} }); (function() {
	var B = YAHOO.util;var A = B.Event, E = YAHOO.lang, C = B.Dom, D = "WireIt-";WireIt.Scissors = function(F, G) {
		WireIt.Scissors.superclass.constructor.call(this, document.createElement("div"), G);this._terminal = F;this.initScissors()
	};WireIt.Scissors.visibleInstance = null;E.extend(WireIt.Scissors, B.Element, { initScissors: function() {
		this.hideNow();this.addClass(D + "Wire-scissors");this.appendTo(this._terminal.container ? this._terminal.container.layer.el : this._terminal.el.parentNode.parentNode);this.on("mouseover", this.show, this, true);this.on("mouseout", this.hide, this, true);this.on("click", this.scissorClick, this, true);A.addListener(this._terminal.el, "mouseover", this.mouseOver, this, true);A.addListener(this._terminal.el, "mouseout", this.hide, this, true)
	}, setPosition: function() {
		var F = this._terminal.getXY();this.setStyle("left", (F[0] + this._terminal.options.direction[0] * 30 - 8) + "px");this.setStyle("top", (F[1] + this._terminal.options.direction[1] * 30 - 8) + "px")
	}, mouseOver: function() {
		if (this._terminal.wires.length > 0) {
			this.show()
		}
	}, scissorClick: function() {
		this._terminal.removeAllWires();if (this.terminalTimeout) {
			this.terminalTimeout.cancel()
		}this.hideNow()
	}, show: function() {
		this.setPosition();this.setStyle("display", "");if (WireIt.Scissors.visibleInstance && WireIt.Scissors.visibleInstance != this) {
			if (WireIt.Scissors.visibleInstance.terminalTimeout) {
				WireIt.Scissors.visibleInstance.terminalTimeout.cancel()
			}WireIt.Scissors.visibleInstance.hideNow()
		}WireIt.Scissors.visibleInstance = this;if (this.terminalTimeout) {
			this.terminalTimeout.cancel()
		}
	}, hide: function() {
		this.terminalTimeout = E.later(700, this, this.hideNow)
	}, hideNow: function() {
		WireIt.Scissors.visibleInstance = null;this.setStyle("display", "none")
	} });WireIt.TerminalProxy = function(G, F) {
		this.terminal = G;this.termConfig = F || { };this.terminalProxySize = F.terminalProxySize || 10;this.fakeTerminal = null;WireIt.TerminalProxy.superclass.constructor.call(this, this.terminal.el, undefined, { dragElId: "WireIt-TerminalProxy", resizeFrame: false, centerFrame: true })
	};B.DDM.mode = B.DDM.INTERSECT;E.extend(WireIt.TerminalProxy, B.DDProxy, { createFrame: function() {
		var G = this, F = document.body;if (!F || !F.firstChild) {
			setTimeout(function() {
				G.createFrame()
			}, 50);return
		}var L = this.getDragEl(), K = YAHOO.util.Dom;if (!L) {
			L = document.createElement("div");L.id = this.dragElId;var J = L.style;J.position = "absolute";J.visibility = "hidden";J.cursor = "move";J.border = "2px solid #aaa";J.zIndex = 999;var H = this.terminalProxySize + "px";J.height = H;J.width = H;var I = document.createElement("div");K.setStyle(I, "height", "100%");K.setStyle(I, "width", "100%");K.setStyle(I, "background-color", "#ccc");K.setStyle(I, "opacity", "0");L.appendChild(I);F.insertBefore(L, F.firstChild)
		}
	}, startDrag: function() {
		if (this.terminal.options.nMaxWires == 1 && this.terminal.wires.length == 1) {
			this.terminal.wires[0].remove()
		} else {
			if (this.terminal.wires.length >= this.terminal.options.nMaxWires) {
				return
			}
		}var F = this.terminalProxySize / 2;this.fakeTerminal = { options: { direction: this.terminal.options.fakeDirection }, pos: [200,200], addWire: function() { }, removeWire: function() { }, getXY: function() {
			var H = C.getElementsByClassName("WireIt-Layer");if (H.length > 0) {
				var I = C.getXY(H[0]);return[this.pos[0] - I[0] + F,this.pos[1] - I[1] + F]
			}return this.pos
		} };var G = this.terminal.parentEl.parentNode;if (this.terminal.container) {
			G = this.terminal.container.layer.el
		}this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, G, this.terminal.options.editingWireConfig);C.addClass(this.editingWire.element, D + "Wire-editing")
	}, onDrag: function(G) {
		if (!this.editingWire) {
			return
		}if (this.terminal.container) {
			var F = this.terminal.container.layer.el;var H = curtop = 0;if (F.offsetParent) {
				do {
					H += F.offsetLeft;curtop += F.offsetTop;F = F.offsetParent
				} while (F = F.offsetParent)
			}this.fakeTerminal.pos = [G.clientX - H + this.terminal.container.layer.el.scrollLeft,G.clientY - curtop + this.terminal.container.layer.el.scrollTop]
		} else {
			this.fakeTerminal.pos = (YAHOO.env.ua.ie) ? [G.clientX,G.clientY] : [G.clientX + window.pageXOffset,G.clientY + window.pageYOffset]
		}this.editingWire.redraw()
	}, endDrag: function(F) {
		if (this.editingWire) {
			this.editingWire.remove();this.editingWire = null
		}
	}, onDragEnter: function(H, F) {
		if (!this.editingWire) {
			return
		}for (var G = 0; G < F.length; G++) {
			if (this.isValidWireTerminal(F[G])) {
				F[G].terminal.setDropInvitation(true)
			}
		}
	}, onDragOut: function(H, F) {
		if (!this.editingWire) {
			return
		}for (var G = 0; G < F.length; G++) {
			if (this.isValidWireTerminal(F[G])) {
				F[G].terminal.setDropInvitation(false)
			}
		}
	}, onDragDrop: function(M, L) {
		if (!this.editingWire) {
			return
		}this.onDragOut(M, L);var O = null;for (var J = 0; J < L.length; J++) {
			if (this.isValidWireTerminal(L[J])) {
				O = L[J];break
			}
		}if (!O) {
			return
		}this.editingWire.remove();this.editingWire = null;var I = false;for (var J = 0; J < this.terminal.wires.length; J++) {
			if (this.terminal.wires[J].terminal1 == this.terminal) {
				if (this.terminal.wires[J].terminal2 == O.terminal) {
					I = true;break
				}
			} else {
				if (this.terminal.wires[J].terminal2 == this.terminal) {
					if (this.terminal.wires[J].terminal1 == O.terminal) {
						I = true;break
					}
				}
			}
		}if (I) {
			return
		}var K = this.terminal.parentEl.parentNode;if (this.terminal.container) {
			K = this.terminal.container.layer.el
		}var H = this.terminal;var G = O.terminal;if (G.options.alwaysSrc) {
			H = O.terminal;G = this.terminal
		}var F = O.terminal;if (F.options.nMaxWires == 1) {
			if (F.wires.length > 0) {
				F.wires[0].remove()
			}var N = new WireIt.Wire(H, G, K, H.options.wireConfig);N.redraw()
		} else {
			if (F.wires.length < F.options.nMaxWires) {
				var N = new WireIt.Wire(H, G, K, H.options.wireConfig);N.redraw()
			}
		}
	}, isWireItTerminal: true, isValidWireTerminal: function(F) {
		if (!F.isWireItTerminal) {
			return false
		}if (this.termConfig.type) {
			if (this.termConfig.allowedTypes) {
				if (WireIt.indexOf(F.termConfig.type, this.termConfig.allowedTypes) == -1) {
					return false
				}
			} else {
				if (this.termConfig.type != F.termConfig.type) {
					return false
				}
			}
		} else {
			if (F.termConfig.type) {
				if (F.termConfig.allowedTypes) {
					if (WireIt.indexOf(this.termConfig.type, F.termConfig.allowedTypes) == -1) {
						return false
					}
				} else {
					if (this.termConfig.type != F.termConfig.type) {
						return false
					}
				}
			}
		}if (this.terminal.container) {
			if (this.terminal.container.options.preventSelfWiring) {
				if (F.terminal.container == this.terminal.container) {
					return false
				}
			}
		}return true
	} });WireIt.Terminal = function(H, G, F) {
		this.parentEl = H;this.container = F;this.wires = [];this.setOptions(G);this.eventAddWire = new B.CustomEvent("eventAddWire");this.eventRemoveWire = new B.CustomEvent("eventRemoveWire");this.el = null;this.render();if (this.options.editable) {
			this.dd = new WireIt.TerminalProxy(this, this.options.ddConfig);this.scissors = new WireIt.Scissors(this)
		}
	};WireIt.Terminal.prototype = { setOptions: function(F) {
		this.options = { };this.options.name = F.name;this.options.direction = F.direction || [0,1];this.options.fakeDirection = F.fakeDirection || [-this.options.direction[0],-this.options.direction[1]];this.options.className = F.className || D + "Terminal";this.options.connectedClassName = F.connectedClassName || D + "Terminal-connected";this.options.dropinviteClassName = F.dropinviteClassName || D + "Terminal-dropinvite";this.options.editable = E.isUndefined(F.editable) ? true : F.editable;this.options.nMaxWires = F.nMaxWires || Infinity;this.options.wireConfig = F.wireConfig || { };this.options.editingWireConfig = F.editingWireConfig || this.options.wireConfig;this.options.offsetPosition = F.offsetPosition;this.options.alwaysSrc = E.isUndefined(F.alwaysSrc) ? false : F.alwaysSrc;this.options.ddConfig = F.ddConfig || { }
	}, setDropInvitation: function(F) {
		if (F) {
			C.addClass(this.el, this.options.dropinviteClassName)
		} else {
			C.removeClass(this.el, this.options.dropinviteClassName)
		}
	}, render: function() {
		this.el = WireIt.cn("div", { className: this.options.className });if (this.options.name) {
			this.el.title = this.options.name
		}var G = this.options.offsetPosition;if (G) {
			if (E.isArray(G)) {
				this.el.style.left = G[0] + "px";this.el.style.top = G[1] + "px"
			} else {
				if (E.isObject(G)) {
					for (var F in G) {
						if (G.hasOwnProperty(F) && G[F] != "") {
							this.el.style[F] = G[F] + "px"
						}
					}
				}
			}
		}this.parentEl.appendChild(this.el)
	}, addWire: function(F) {
		this.wires.push(F);C.addClass(this.el, this.options.connectedClassName);this.eventAddWire.fire(F)
	}, removeWire: function(H) {
		var G = WireIt.indexOf(H, this.wires), F;if (G != -1) {
			this.wires[G].destroy();this.wires[G] = null;this.wires = WireIt.compact(this.wires);if (this.wires.length == 0) {
				C.removeClass(this.el, this.options.connectedClassName)
			}this.eventRemoveWire.fire(H)
		}
	}, getXY: function() {
		var F = this.container && this.container.layer ? this.container.layer.el : document.body;var G = this.el;var H = curtop = 0;if (G.offsetParent) {
			do {
				H += G.offsetLeft;curtop += G.offsetTop;G = G.offsetParent
			} while (!!G && G != F)
		}return[H + 15,curtop + 15]
	}, remove: function() {
		while (this.wires.length > 0) {
			this.wires[0].remove()
		}this.parentEl.removeChild(this.el);A.purgeElement(this.el);if (this.scissors) {
			A.purgeElement(this.scissors.get("element"))
		}
	}, getConnectedTerminals: function() {
		var F = [];if (this.wires) {
			for (var G = 0; G < this.wires.length; G++) {
				F.push(this.wires[G].getOtherTerminal(this))
			}
		}return F
	}, redrawAllWires: function() {
		if (this.wires) {
			for (var F = 0; F < this.wires.length; F++) {
				this.wires[F].redraw()
			}
		}
	}, removeAllWires: function() {
		while (this.wires.length > 0) {
			this.wires[0].remove()
		}
	} };WireIt.util.TerminalInput = function(H, G, F) {
		WireIt.util.TerminalInput.superclass.constructor.call(this, H, G, F)
	};E.extend(WireIt.util.TerminalInput, WireIt.Terminal, { setOptions: function(F) {
		WireIt.util.TerminalInput.superclass.setOptions.call(this, F);this.options.direction = F.direction || [0,-1];this.options.fakeDirection = F.fakeDirection || [0,1];this.options.ddConfig = { type: "input", allowedTypes: ["output"] };this.options.nMaxWires = F.nMaxWires || 1
	} });WireIt.util.TerminalOutput = function(H, G, F) {
		WireIt.util.TerminalOutput.superclass.constructor.call(this, H, G, F)
	};E.extend(WireIt.util.TerminalOutput, WireIt.Terminal, { setOptions: function(F) {
		WireIt.util.TerminalOutput.superclass.setOptions.call(this, F);this.options.direction = F.direction || [0,1];this.options.fakeDirection = F.fakeDirection || [0,-1];this.options.ddConfig = { type: "output", allowedTypes: ["input"] };this.options.alwaysSrc = true
	} })
})();WireIt.util.DD = function(D, C, A, B) {
	if (!D) {
		throw new Error("WireIt.util.DD needs at least terminals and id")
	}this._WireItTerminals = D;WireIt.util.DD.superclass.constructor.call(this, C, A, B)
};YAHOO.extend(WireIt.util.DD, YAHOO.util.DD, { onDrag: function(D) {
	var A = YAHOO.lang.isArray(this._WireItTerminals) ? this._WireItTerminals : (this._WireItTerminals.isWireItTerminal ? [this._WireItTerminals] : []);for (var C = 0; C < A.length; C++) {
		if (A[C].wires) {
			for (var B = 0; B < A[C].wires.length; B++) {
				A[C].wires[B].redraw()
			}
		}
	}
}, setTerminals: function(A) {
	this._WireItTerminals = A
} });WireIt.util.DDResize = function(A, B) {
	this.myConf = B || { };this.myConf.container = A;this.myConf.minWidth = this.myConf.minWidth || 50;this.myConf.minHeight = this.myConf.minHeight || 50;WireIt.util.DDResize.superclass.constructor.apply(this, [A.el,A.ddResizeHandle]);this.setHandleElId(A.ddResizeHandle);this.eventResize = new YAHOO.util.CustomEvent("eventResize")
};YAHOO.extend(WireIt.util.DDResize, YAHOO.util.DragDrop, { onMouseDown: function(B) {
	var A = this.getEl();this.startWidth = A.offsetWidth;this.startHeight = A.offsetHeight;this.startPos = [YAHOO.util.Event.getPageX(B),YAHOO.util.Event.getPageY(B)]
}, onDrag: function(F) {
	var D = [YAHOO.util.Event.getPageX(F),YAHOO.util.Event.getPageY(F)];var A = D[0] - this.startPos[0];var G = D[1] - this.startPos[1];var E = Math.max(this.startWidth + A, this.myConf.minWidth);var C = Math.max(this.startHeight + G, this.myConf.minHeight);var B = this.getEl();B.style.width = E + "px";B.style.height = C + "px";this.eventResize.fire([E,C])
} }); (function() {
	var util = YAHOO.util;var Dom = util.Dom, Event = util.Event, CSS_PREFIX = "WireIt-";WireIt.Container = function(options, layer) {
		this.setOptions(options);this.layer = layer;this.terminals = [];this.wires = [];this.el = null;this.bodyEl = null;this.eventAddWire = new util.CustomEvent("eventAddWire");this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");this.render();this.initTerminals(this.options.terminals);if (this.options.draggable) {
			if (this.options.resizable) {
				this.ddResize = new WireIt.util.DDResize(this);this.ddResize.eventResize.subscribe(this.onResize, this, true)
			}this.dd = new WireIt.util.DD(this.terminals, this.el);if (this.options.ddHandle) {
				this.dd.setHandleElId(this.ddHandle)
			}if (this.options.resizable) {
				this.dd.addInvalidHandleId(this.ddResizeHandle);this.ddResize.addInvalidHandleId(this.ddHandle)
			}
		}
	};WireIt.Container.prototype = { setOptions: function(options) {
		this.options = { };this.options.terminals = options.terminals || [];this.options.draggable = (typeof options.draggable == "undefined") ? true : options.draggable;this.options.position = options.position || [100,100];this.options.className = options.className || CSS_PREFIX + "Container";this.options.ddHandle = (typeof options.ddHandle == "undefined") ? true : options.ddHandle;this.options.ddHandleClassName = options.ddHandleClassName || CSS_PREFIX + "Container-ddhandle";this.options.resizable = (typeof options.resizable == "undefined") ? true : options.resizable;this.options.resizeHandleClassName = options.resizeHandleClassName || CSS_PREFIX + "Container-resizehandle";this.options.width = options.width;this.options.height = options.height;this.options.close = (typeof options.close == "undefined") ? true : options.close;this.options.closeButtonClassName = options.closeButtonClassName || CSS_PREFIX + "Container-closebutton";this.options.title = options.title;this.options.icon = options.icon;this.options.preventSelfWiring = (typeof options.preventSelfWiring == "undefined") ? true : options.preventSelfWiring
	}, onResize: function(event, args) {
		var size = args[0];WireIt.sn(this.bodyEl, null, { width: (size[0] - 10) + "px", height: (size[1] - 44) + "px" })
	}, render: function() {
		this.el = WireIt.cn("div", { className: this.options.className });if (this.options.width) {
			this.el.style.width = this.options.width + "px"
		}if (this.options.height) {
			this.el.style.height = this.options.height + "px"
		}Event.addListener(this.el, "mousedown", this.onMouseDown, this, true);if (this.options.ddHandle) {
			this.ddHandle = WireIt.cn("div", { className: this.options.ddHandleClassName });this.el.appendChild(this.ddHandle);if (this.options.title) {
				this.ddHandle.appendChild(WireIt.cn("span", null, null, this.options.title))
			}if (this.options.icon) {
				var iconCn = WireIt.cn("img", { src: this.options.icon, className: "WireIt-Container-icon" });this.ddHandle.appendChild(iconCn)
			}
		}this.bodyEl = WireIt.cn("div", { className: "body" });this.el.appendChild(this.bodyEl);if (this.options.resizable) {
			this.ddResizeHandle = WireIt.cn("div", { className: this.options.resizeHandleClassName });this.el.appendChild(this.ddResizeHandle)
		}if (this.options.close) {
			this.closeButton = WireIt.cn("div", { className: this.options.closeButtonClassName });this.el.appendChild(this.closeButton);Event.addListener(this.closeButton, "click", this.onCloseButton, this, true)
		}this.layer.el.appendChild(this.el);this.el.style.left = this.options.position[0] + "px";this.el.style.top = this.options.position[1] + "px"
	}, setBody: function(content) {
		if (typeof content == "string") {
			this.bodyEl.innerHTML = content
		} else {
			this.bodyEl.innerHTML = "";this.bodyEl.appendChild(content)
		}
	}, onMouseDown: function() {
		if (this.layer) {
			if (this.layer.focusedContainer && this.layer.focusedContainer != this) {
				this.layer.focusedContainer.removeFocus()
			}this.setFocus();this.layer.focusedContainer = this
		}
	}, setFocus: function() {
		Dom.addClass(this.el, CSS_PREFIX + "Container-focused")
	}, removeFocus: function() {
		Dom.removeClass(this.el, CSS_PREFIX + "Container-focused")
	}, onCloseButton: function(e, args) {
		Event.stopEvent(e);this.layer.removeContainer(this)
	}, remove: function() {
		this.removeAllTerminals();this.layer.el.removeChild(this.el);Event.purgeElement(this.el)
	}, initTerminals: function(terminalConfigs) {
		for (var i = 0; i < terminalConfigs.length; i++) {
			this.addTerminal(terminalConfigs[i])
		}
	}, addTerminal: function(terminalConfig) {
		var type = eval(terminalConfig.xtype || "WireIt.Terminal");var term = new type(this.el, terminalConfig, this);this.terminals.push(term);term.eventAddWire.subscribe(this.onAddWire, this, true);term.eventRemoveWire.subscribe(this.onRemoveWire, this, true);return term
	}, onAddWire: function(event, args) {
		var wire = args[0];if (WireIt.indexOf(wire, this.wires) == -1) {
			this.wires.push(wire);this.eventAddWire.fire(wire)
		}
	}, onRemoveWire: function(event, args) {
		var wire = args[0];var index = WireIt.indexOf(wire, this.wires);if (index != -1) {
			this.eventRemoveWire.fire(wire);this.wires[index] = null
		}this.wires = WireIt.compact(this.wires)
	}, removeAllTerminals: function() {
		for (var i = 0; i < this.terminals.length; i++) {
			this.terminals[i].remove()
		}this.terminals = []
	}, redrawAllWires: function() {
		for (var i = 0; i < this.terminals.length; i++) {
			this.terminals[i].redrawAllWires()
		}
	}, getConfig: function() {
		var obj = { };obj.position = Dom.getXY(this.el);if (this.layer) {
			var layerPos = Dom.getXY(this.layer.el);obj.position[0] -= layerPos[0];obj.position[1] -= layerPos[1];obj.position[0] += this.layer.el.scrollLeft;obj.position[1] += this.layer.el.scrollTop
		}if (this.options.xtype) {
			obj.xtype = this.options.xtype
		}return obj
	}, getValue: function() {
		return { }
	}, setValue: function(val) { }, getTerminal: function(name) {
		var term;for (var i = 0; i < this.terminals.length; i++) {
			term = this.terminals[i];if (term.options.name == name) {
				return term
			}
		}return null
	} }
})();WireIt.Layer = function(A) {
	this.setOptions(A);this.containers = [];this.wires = [];this.el = null;this.eventChanged = new YAHOO.util.CustomEvent("eventChanged");this.eventAddWire = new YAHOO.util.CustomEvent("eventAddWire");this.eventRemoveWire = new YAHOO.util.CustomEvent("eventRemoveWire");this.eventAddContainer = new YAHOO.util.CustomEvent("eventAddContainer");this.eventRemoveContainer = new YAHOO.util.CustomEvent("eventRemoveContainer");this.eventContainerDragged = new YAHOO.util.CustomEvent("eventContainerDragged");this.eventContainerResized = new YAHOO.util.CustomEvent("eventContainerResized");this.render();this.initContainers();this.initWires();if (this.options.layerMap) {
		new WireIt.LayerMap(this, this.options.layerMapOptions)
	}
};WireIt.Layer.prototype = { setOptions: function(A) {
	this.options = { };this.options.className = A.className || "WireIt-Layer";this.options.parentEl = A.parentEl || document.body;this.options.containers = A.containers || [];this.options.wires = A.wires || [];this.options.layerMap = YAHOO.lang.isUndefined(A.layerMap) ? false : A.layerMap;this.options.layerMapOptions = A.layerMapOptions;this.options.enableMouseEvents = YAHOO.lang.isUndefined(A.enableMouseEvents) ? true : A.enableMouseEvents
}, render: function() {
	this.el = WireIt.cn("div", { className: this.options.className });this.options.parentEl.appendChild(this.el)
}, initContainers: function() {
	for (var A = 0; A < this.options.containers.length; A++) {
		this.addContainer(this.options.containers[A])
	}
}, initWires: function() {
	for (var A = 0; A < this.options.wires.length; A++) {
		this.addWire(this.options.wires[A])
	}
}, addWire: function(wireConfig) {
	var type = eval(wireConfig.xtype || "WireIt.Wire");var src = wireConfig.src;var tgt = wireConfig.tgt;var terminal1 = this.containers[src.moduleId].getTerminal(src.terminal);var terminal2 = this.containers[tgt.moduleId].getTerminal(tgt.terminal);var wire = new type(terminal1, terminal2, this.el, wireConfig);wire.redraw();return wire
}, addContainer: function(containerConfig) {
	var type = eval("(" + (containerConfig.xtype || "WireIt.Container") + ")");if (!YAHOO.lang.isFunction(type)) {
		throw new Error("WireIt layer unable to add container: xtype '" + containerConfig.xtype + "' not found")
	}var container = new type(containerConfig, this);this.containers.push(container);container.eventAddWire.subscribe(this.onAddWire, this, true);container.eventRemoveWire.subscribe(this.onRemoveWire, this, true);if (container.ddResize) {
		container.ddResize.on("endDragEvent", function() {
			this.eventContainerResized.fire(container);this.eventChanged.fire(this)
		}, this, true)
	}if (container.dd) {
		container.dd.on("endDragEvent", function() {
			this.eventContainerDragged.fire(container);this.eventChanged.fire(this)
		}, this, true)
	}this.eventAddContainer.fire(container);this.eventChanged.fire(this);return container
}, removeContainer: function(A) {
	var B = WireIt.indexOf(A, this.containers);if (B != -1) {
		A.remove();this.containers[B] = null;this.containers = WireIt.compact(this.containers);this.eventRemoveContainer.fire(A);this.eventChanged.fire(this)
	}
}, onAddWire: function(B, A) {
	var C = A[0];if (WireIt.indexOf(C, this.wires) == -1) {
		this.wires.push(C);if (this.options.enableMouseEvents) {
			YAHOO.util.Event.addListener(C.element, "mousemove", this.onWireMouseMove, this, true);YAHOO.util.Event.addListener(C.element, "click", this.onWireClick, this, true)
		}this.eventAddWire.fire(C);this.eventChanged.fire(this)
	}
}, onRemoveWire: function(C, B) {
	var D = B[0];var A = WireIt.indexOf(D, this.wires);if (A != -1) {
		this.wires[A] = null;this.wires = WireIt.compact(this.wires);this.eventRemoveWire.fire(D);this.eventChanged.fire(this)
	}
}, clear: function() {
	while (this.containers.length > 0) {
		this.removeContainer(this.containers[0])
	}
}, removeAllContainers: function() {
	this.clear()
}, getWiring: function() {
	var B;var C = { containers: [], wires: [] };for (B = 0; B < this.containers.length; B++) {
		C.containers.push(this.containers[B].getConfig())
	}for (B = 0; B < this.wires.length; B++) {
		var D = this.wires[B];var A = { src: { moduleId: WireIt.indexOf(D.terminal1.container, this.containers), terminal: D.terminal1.name }, tgt: { moduleId: WireIt.indexOf(D.terminal2.container, this.containers), terminal: D.terminal2.name } };C.wires.push(A)
	}return C
}, setWiring: function(B) {
	this.clear();if (YAHOO.lang.isArray(B.containers)) {
		for (var A = 0; A < B.containers.length; A++) {
			this.addContainer(B.containers[A])
		}
	}if (YAHOO.lang.isArray(B.wires)) {
		for (var A = 0; A < B.wires.length; A++) {
			this.addWire(B.wires[A])
		}
	}
}, _getMouseEvtPos: function(B) {
	var C = YAHOO.util.Event.getTarget(B);var A = [C.offsetLeft,C.offsetTop];return[A[0] + B.layerX,A[1] + B.layerY]
}, onWireClick: function(J) {
	var D = this._getMouseEvtPos(J);var H = D[0], F = D[1], G = this.wires.length, K;for (var I = 0; I < G; I++) {
		K = this.wires[I];var E = K.element.offsetLeft, C = K.element.offsetTop;if (H >= E && H < E + K.element.width && F >= C && F < C + K.element.height) {
			var B = H - E, A = F - C;K.onClick(B, A)
		}
	}
}, onWireMouseMove: function(J) {
	var D = this._getMouseEvtPos(J);var H = D[0], F = D[1], G = this.wires.length, K;for (var I = 0; I < G; I++) {
		K = this.wires[I];var E = K.element.offsetLeft, C = K.element.offsetTop;if (H >= E && H < E + K.element.width && F >= C && F < C + K.element.height) {
			var B = H - E, A = F - C;K.onMouseMove(B, A)
		}
	}
}, clearExplode: function(J, F) {
	var A = [Math.floor(YAHOO.util.Dom.getViewportWidth() / 2),Math.floor(YAHOO.util.Dom.getViewportHeight() / 2)];var C = 1.2 * Math.sqrt(Math.pow(A[0], 2) + Math.pow(A[1], 2));for (var D = 0; D < this.containers.length; D++) {
		var B = parseInt(dbWire.layer.containers[D].el.style.left.substr(0, dbWire.layer.containers[D].el.style.left.length - 2), 10);var H = parseInt(dbWire.layer.containers[D].el.style.top.substr(0, dbWire.layer.containers[D].el.style.top.length - 2), 10);var G = Math.sqrt(Math.pow(B - A[0], 2) + Math.pow(H - A[1], 2));var I = [ (B - A[0]) / G, (H - A[1]) / G];YAHOO.util.Dom.setStyle(this.containers[D].el, "opacity", "0.8");var E = new WireIt.util.Anim(this.containers[D].terminals, this.containers[D].el, { left: { to: A[0] + C * I[0] }, top: { to: A[1] + C * I[1] }, opacity: { to: 0, by: 0.05 }, duration: 3 });if (D == this.containers.length - 1) {
			E.onComplete.subscribe(function() {
				this.clear();J.call(F)
			}, this, true)
		}E.animate()
	}
} };WireIt.FormContainer = function(A, B) {
	WireIt.FormContainer.superclass.constructor.call(this, A, B)
};YAHOO.lang.extend(WireIt.FormContainer, WireIt.Container, { setOptions: function(A) {
	WireIt.FormContainer.superclass.setOptions.call(this, A);this.options.legend = A.legend;this.options.collapsible = A.collapsible;this.options.fields = A.fields
}, render: function() {
	WireIt.FormContainer.superclass.render.call(this);this.renderForm()
}, renderForm: function() {
	this.setBackReferenceOnFieldOptionsRecursively(this.options.fields);var A = { parentEl: this.bodyEl, fields: this.options.fields, legend: this.options.legend, collapsible: this.options.collapsible };this.form = new YAHOO.inputEx.Group(A)
}, setBackReferenceOnFieldOptionsRecursively: function(C) {
	for (var B = 0; B < C.length; B++) {
		var A = C[B].inputParams;A.container = this;if (A.fields && typeof A.fields == "object") {
			this.setBackReferenceOnFieldOptionsRecursively(A.fields)
		}if (A.elementType) {
			A.elementType.inputParams.container = this;if (A.elementType.inputParams.fields && typeof A.elementType.inputParams.fields == "object") {
				this.setBackReferenceOnFieldOptionsRecursively(A.elementType.inputParams.fields)
			}
		}
	}
}, getValue: function() {
	return this.form.getValue()
}, setValue: function(A) {
	this.form.setValue(A)
} }); (function() {
	var B = YAHOO.util.Dom, A = YAHOO.util.Event;WireIt.LayerMap = function(D, C) {
		this.layer = D;this.setOptions(C);WireIt.LayerMap.superclass.constructor.call(this, this.options.parentEl);this.element.className = this.options.className;this.initEvents();this.draw()
	};YAHOO.lang.extend(WireIt.LayerMap, WireIt.CanvasElement, { setOptions: function(C) {
		var C = C || { };this.options = { };this.options.parentEl = B.get(C.parentEl || this.layer.el);this.options.className = C.className || "WireIt-LayerMap";this.options.style = C.style || "rgba(0, 0, 200, 0.5)";this.options.lineWidth = C.lineWidth || 2
	}, initEvents: function() {
		var C = this.layer;A.addListener(this.element, "mousedown", this.onMouseDown, this, true);A.addListener(this.element, "mouseup", this.onMouseUp, this, true);A.addListener(this.element, "mousemove", this.onMouseMove, this, true);A.addListener(this.element, "mouseout", this.onMouseUp, this, true);C.eventAddWire.subscribe(this.draw, this, true);C.eventRemoveWire.subscribe(this.draw, this, true);C.eventAddContainer.subscribe(this.draw, this, true);C.eventRemoveContainer.subscribe(this.draw, this, true);C.eventContainerDragged.subscribe(this.draw, this, true);C.eventContainerResized.subscribe(this.draw, this, true);A.addListener(this.layer.el, "scroll", this.onLayerScroll, this, true)
	}, onMouseMove: function(D, C) {
		A.stopEvent(D);if (this.isMouseDown) {
			this.scrollLayer(D.clientX, D.clientY)
		}
	}, onMouseUp: function(D, C) {
		A.stopEvent(D);this.isMouseDown = false
	}, onMouseDown: function(D, C) {
		A.stopEvent(D);this.scrollLayer(D.clientX, D.clientY);this.isMouseDown = true
	}, scrollLayer: function(E, D) {
		var P = B.getXY(this.element);var R = [E - P[0],D - P[1]];var H = B.getRegion(this.element);var G = H.right - H.left - 4;var K = H.bottom - H.top - 4;var F = this.layer.el.scrollWidth;var N = this.layer.el.scrollHeight;var I = Math.floor(100 * G / F) / 100;var O = Math.floor(100 * K / N) / 100;var C = [R[0] / I,R[1] / O];var Q = B.getRegion(this.layer.el);var M = Q.right - Q.left;var J = Q.bottom - Q.top;var L = [Math.max(Math.floor(C[0] - M / 2), 0),Math.max(Math.floor(C[1] - J / 2), 0)];if (L[0] + M > F) {
			L[0] = F - M
		}if (L[1] + J > N) {
			L[1] = N - J
		}this.layer.el.scrollLeft = L[0];this.layer.el.scrollTop = L[1]
	}, onLayerScroll: function() {
		if (this.scrollTimer) {
			clearTimeout(this.scrollTimer)
		}var C = this;this.scrollTimer = setTimeout(function() {
			C.draw()
		}, 50)
	}, draw: function() {
		var N = this.getContext();var E = B.getRegion(this.element);var D = E.right - E.left - 4;var J = E.bottom - E.top - 4;N.clearRect(0, 0, D, J);var C = this.layer.el.scrollWidth;var L = this.layer.el.scrollHeight;var F = Math.floor(100 * D / C) / 100;var M = Math.floor(100 * J / L) / 100;var O = B.getRegion(this.layer.el);var K = O.right - O.left;var I = O.bottom - O.top;var H = this.layer.el.scrollLeft;var G = this.layer.el.scrollTop;N.strokeStyle = "rgb(200, 50, 50)";N.lineWidth = 1;N.strokeRect(H * F, G * M, K * F, I * M);N.fillStyle = this.options.style;N.strokeStyle = this.options.style;N.lineWidth = this.options.lineWidth;this.drawContainers(N, F, M);this.drawWires(N, F, M)
	}, drawContainers: function(C, I, F) {
		var H = this.layer.containers;var J = H.length, E, D = WireIt.getIntStyle, G;for (E = 0; E < J; E++) {
			G = H[E].el;C.fillRect(D(G, "left") * I, D(G, "top") * F, D(G, "width") * I, D(G, "height") * F)
		}
	}, drawWires: function(G, D, F) {
		var K = this.layer.wires;var C = K.length, E, I;for (E = 0; E < C; E++) {
			I = K[E];var J = I.terminal1.getXY(), H = I.terminal2.getXY();G.beginPath();G.moveTo(J[0] * D, J[1] * F);G.lineTo(H[0] * D, H[1] * F);G.closePath();G.stroke()
		}
	} })
})(); (function() {
	var C = YAHOO.util, G = YAHOO.lang;var B = C.Event, D = C.Dom, A = C.Connect, F = G.JSON, E = YAHOO.widget;WireIt.ModuleProxy = function(I, H) {
		this._WiringEditor = H;WireIt.ModuleProxy.superclass.constructor.call(this, I, "module", { dragElId: "moduleProxy" });this.isTarget = false
	};YAHOO.extend(WireIt.ModuleProxy, YAHOO.util.DDProxy, { startDrag: function(J) {
		WireIt.ModuleProxy.superclass.startDrag.call(this, J);var H = this.getDragEl(), I = this.getEl();H.innerHTML = I.innerHTML;H.className = I.className
	}, endDrag: function(H) { }, onDragDrop: function(L, J) {
		var M = J[0], K = J[0]._layer, I = this.getDragEl(), N = YAHOO.util.Dom.getXY(I), H = YAHOO.util.Dom.getXY(K.el);this._WiringEditor.addModule(this._module, [N[0] - H[0] + K.el.scrollLeft,N[1] - H[1] + K.el.scrollTop])
	} });WireIt.WiringEditor = function(H) {
		this.modulesByName = { };this.setOptions(H);this.el = D.get(H.parentEl);this.helpPanel = new E.Panel("helpPanel", { fixedcenter: true, draggable: true, visible: false, modal: true });this.helpPanel.render();this.layout = new E.Layout(this.el, this.options.layoutOptions);this.layout.render();this.renderAccordion();this.layer = new WireIt.Layer(this.options.layerOptions);this.layer.eventChanged.subscribe(this.onLayerChanged, this, true);this.leftEl = D.get("left");this.buildModulesList();this.renderButtons();this.renderSavedStatus();this.renderPropertiesForm();if (this.adapter.init && YAHOO.lang.isFunction(this.adapter.init)) {
			this.adapter.init()
		}this.load()
	};WireIt.WiringEditor.prototype = { setOptions: function(I) {
		this.options = { };this.modules = I.modules || [];for (var J = 0; J < this.modules.length; J++) {
			var H = this.modules[J];this.modulesByName[H.name] = H
		}this.adapter = I.adapter || WireIt.WiringEditor.adapters.JsonRpc;this.options.languageName = I.languageName || "anonymousLanguage";this.options.propertiesFields = I.propertiesFields || [ { type: "string", inputParams: { name: "name", label: "Title", typeInvite: "Enter a title" } }, { type: "text", inputParams: { name: "description", label: "Description", cols: 30, rows: 4 } }];this.options.layoutOptions = I.layoutOptions || { units: [ { position: "top", height: 50, body: "top" }, { position: "left", width: 200, resize: true, body: "left", gutter: "5px", collapse: true, collapseSize: 25, header: "Modules", scroll: true, animate: true }, { position: "center", body: "center", gutter: "5px" }, { position: "right", width: 320, resize: true, body: "right", gutter: "5px", collapse: true, collapseSize: 25, animate: true }] };this.options.layerOptions = { };var K = I.layerOptions || { };this.options.layerOptions.parentEl = K.parentEl ? K.parentEl : D.get("center");this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(K.layerMap) ? true : K.layerMap;this.options.layerOptions.layerMapOptions = K.layerMapOptions || { parentEl: "layerMap" };this.options.accordionViewParams = I.accordionViewParams || { collapsible: true, expandable: true, width: "308px", expandItem: 0, animationSpeed: "0.3", animate: true, effect: YAHOO.util.Easing.easeBothStrong }
	}, renderAccordion: function() {
		this.accordionView = new YAHOO.widget.AccordionView("accordionView", this.options.accordionViewParams)
	}, renderPropertiesForm: function() {
		this.propertiesForm = new inputEx.Group( { parentEl: YAHOO.util.Dom.get("propertiesForm"), fields: this.options.propertiesFields });this.propertiesForm.updatedEvt.subscribe(function() {
			this.markUnsaved()
		}, this, true)
	}, buildModulesList: function() {
		var H = this.modules;for (var I = 0; I < H.length; I++) {
			this.addModuleToList(H[I])
		}if (!this.ddTarget) {
			this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");this.ddTarget._layer = this.layer
		}
	}, addModuleToList: function(H) {
		var J = WireIt.cn("div", { className: "WiringEditor-module" });if (H.container.icon) {
			J.appendChild(WireIt.cn("img", { src: H.container.icon }))
		}J.appendChild(WireIt.cn("span", null, null, H.name));var I = new WireIt.ModuleProxy(J, this);I._module = H;this.leftEl.appendChild(J)
	}, addModule: function(J, L) {
		try {
			var K = J.container;K.position = L;K.title = J.name;var H = this.layer.addContainer(K);D.addClass(H.el, "WiringEditor-module-" + J.name)
		}catch (I) {
			this.alert("Error Layer.addContainer: " + I.message)
		}
	}, renderButtons: function() {
		var I = D.get("toolbar");var H = new E.Button( { label: "New", id: "WiringEditor-newButton", container: I });H.on("click", this.onNew, this, true);var K = new E.Button( { label: "Load", id: "WiringEditor-loadButton", container: I });K.on("click", this.load, this, true);var J = new E.Button( { label: "Save", id: "WiringEditor-saveButton", container: I });J.on("click", this.onSave, this, true);var M = new E.Button( { label: "Delete", id: "WiringEditor-deleteButton", container: I });M.on("click", this.onDelete, this, true);var L = new E.Button( { label: "Help", id: "WiringEditor-helpButton", container: I });L.on("click", this.onHelp, this, true)
	}, renderSavedStatus: function() {
		var H = D.get("top");this.savedStatusEl = WireIt.cn("div", { className: "savedStatus", title: "Not saved" }, { display: "none" }, "*");H.appendChild(this.savedStatusEl)
	}, saveModule: function() {
		var H = this.getValue();if (H.name === "") {
			this.alert("Please choose a name");return
		}this.tempSavedWiring = { name: H.name, working: F.stringify(H.working), language: this.options.languageName };this.adapter.saveWiring(this.tempSavedWiring, { success: this.saveModuleSuccess, failure: this.saveModuleFailure, scope: this })
	}, saveModuleSuccess: function(H) {
		this.markSaved();this.alert("Saved !")
	}, saveModuleFailure: function(H) {
		this.alert("Unable to save the wiring : " + H)
	}, alert: function(H) {
		if (!this.alertPanel) {
			this.renderAlertPanel()
		}D.get("alertPanelBody").innerHTML = H;this.alertPanel.show()
	}, onHelp: function() {
		this.helpPanel.show()
	}, onNew: function() {
		if (!this.isSaved()) {
			if (!confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.")) {
				return
			}
		}this.preventLayerChangedEvent = true;this.layer.clear();this.propertiesForm.clear(false);this.markSaved();this.preventLayerChangedEvent = false
	}, onDelete: function() {
		if (confirm("Are you sure you want to delete this wiring ?")) {
			var H = this.getValue();this.adapter.deleteWiring( { name: H.name, language: this.options.languageName }, { success: function(I) {
				this.onNew();this.alert("Deleted !")
			}, failure: function(I) {
				this.alert("Unable to delete wiring: " + I)
			}, scope: this })
		}
	}, onSave: function() {
		this.saveModule()
	}, renderLoadPanel: function() {
		if (!this.loadPanel) {
			this.loadPanel = new E.Panel("WiringEditor-loadPanel", { fixedcenter: true, draggable: true, width: "500px", visible: false, modal: true });this.loadPanel.setHeader("Select the wiring to load");this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");this.loadPanel.render(document.body);B.onAvailable("loadFilter", function() {
				B.addListener("loadFilter", "keyup", this.inputFilterTimer, this, true)
			}, this, true)
		}
	}, inputFilterTimer: function() {
		if (this.inputFilterTimeout) {
			clearTimeout(this.inputFilterTimeout);this.inputFilterTimeout = null
		}var H = this;this.inputFilterTimeout = setTimeout(function() {
			H.updateLoadPanelList(D.get("loadFilter").value)
		}, 500)
	}, updateLoadPanelList: function(J) {
		var L = WireIt.cn("ul");if (G.isArray(this.pipes)) {
			for (var I = 0; I < this.pipes.length; I++) {
				var H = this.pipes[I];this.pipesByName[H.name] = H;if (!J || J === "" || H.name.match(new RegExp(J, "i"))) {
					L.appendChild(WireIt.cn("li", null, { cursor: "pointer" }, H.name))
				}
			}
		}var K = D.get("loadPanelBody");K.innerHTML = "";K.appendChild(L);B.addListener(L, "click", function(N, M) {
			this.loadPipe(B.getTarget(N).innerHTML)
		}, this, true)
	}, load: function() {
		this.adapter.listWirings( { language: this.options.languageName }, { success: function(H) {
			this.onLoadSuccess(H)
		}, failure: function(H) {
			this.alert("Unable to load the wirings: " + H)
		}, scope: this })
	}, onLoadSuccess: function(L) {
		this.pipes = L;this.pipesByName = { };this.renderLoadPanel();this.updateLoadPanelList();if (!this.afterFirstRun) {
			var J = window.location.search.substr(1).split("&");var K = { };for (var I = 0; I < J.length; I++) {
				var H = J[I].split("=");K[H[0]] = window.decodeURIComponent(H[1])
			}this.afterFirstRun = true;if (K.autoload) {
				this.loadPipe(K.autoload);return
			}
		}this.loadPanel.show()
	}, getPipeByName: function(I) {
		var L = this.pipes.length, H;for (var K = 0; K < L; K++) {
			if (this.pipes[K].name == I) {
				try {
					H = F.parse(this.pipes[K].working);return H
				}catch (J) {
					this.alert("Unable to eval working json for module " + I);return null
				}
			}
		}return null
	}, loadPipe: function(J) {
		if (!this.isSaved()) {
			if (!confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.")) {
				return
			}
		}try {
			this.preventLayerChangedEvent = true;this.loadPanel.hide();var N = this.getPipeByName(J), L;if (!N) {
				this.alert("The wiring '" + J + "' was not found.");return
			}this.layer.clear();this.propertiesForm.setValue(N.properties, false);if (G.isArray(N.modules)) {
				for (L = 0; L < N.modules.length; L++) {
					var H = N.modules[L];if (this.modulesByName[H.name]) {
						var M = this.modulesByName[H.name].container;YAHOO.lang.augmentObject(H.config, M);H.config.title = H.name;var I = this.layer.addContainer(H.config);D.addClass(I.el, "WiringEditor-module-" + H.name);I.setValue(H.value)
					} else {
						throw new Error("WiringEditor: module '" + H.name + "' not found !")
					}
				}if (G.isArray(N.wires)) {
					for (L = 0; L < N.wires.length; L++) {
						this.layer.addWire(N.wires[L])
					}
				}
			}this.markSaved();this.preventLayerChangedEvent = false
		}catch (K) {
			this.alert(K)
		}
	}, renderAlertPanel: function() {
		this.alertPanel = new E.Panel("WiringEditor-alertPanel", { fixedcenter: true, draggable: true, width: "500px", visible: false, modal: true });this.alertPanel.setHeader("Message");this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");this.alertPanel.render(document.body);B.addListener("alertPanelButton", "click", function() {
			this.alertPanel.hide()
		}, this, true)
	}, onLayerChanged: function() {
		if (!this.preventLayerChangedEvent) {
			this.markUnsaved()
		}
	}, markSaved: function() {
		this.savedStatusEl.style.display = "none"
	}, markUnsaved: function() {
		this.savedStatusEl.style.display = ""
	}, isSaved: function() {
		return (this.savedStatusEl.style.display == "none")
	}, getValue: function() {
		var I;var J = { modules: [], wires: [], properties: null };for (I = 0; I < this.layer.containers.length; I++) {
			J.modules.push( { name: this.layer.containers[I].options.title, value: this.layer.containers[I].getValue(), config: this.layer.containers[I].getConfig() })
		}for (I = 0; I < this.layer.wires.length; I++) {
			var K = this.layer.wires[I];var H = { src: { moduleId: WireIt.indexOf(K.terminal1.container, this.layer.containers), terminal: K.terminal1.options.name }, tgt: { moduleId: WireIt.indexOf(K.terminal2.container, this.layer.containers), terminal: K.terminal2.options.name } };J.wires.push(H)
		}J.properties = this.propertiesForm.getValue();return { name: J.properties.name, working: J }
	} };WireIt.WiringEditor.adapters = { }
})();WireIt.ImageContainer = function(A, B) {
	WireIt.ImageContainer.superclass.constructor.call(this, A, B)
};YAHOO.lang.extend(WireIt.ImageContainer, WireIt.Container, { setOptions: function(A) {
	WireIt.ImageContainer.superclass.setOptions.call(this, A);this.options.image = A.image;this.options.xtype = "WireIt.ImageContainer";this.options.className = A.className || "WireIt-Container WireIt-ImageContainer";this.options.resizable = (typeof A.resizable == "undefined") ? false : A.resizable;this.options.ddHandle = (typeof A.ddHandle == "undefined") ? false : A.ddHandle
}, render: function() {
	WireIt.ImageContainer.superclass.render.call(this);YAHOO.util.Dom.setStyle(this.bodyEl, "background-image", "url(" + this.options.image + ")")
} });WireIt.InOutContainer = function(A, B) {
	WireIt.InOutContainer.superclass.constructor.call(this, A, B)
};YAHOO.lang.extend(WireIt.InOutContainer, WireIt.Container, { setOptions: function(A) {
	WireIt.InOutContainer.superclass.setOptions.call(this, A);this.options.xtype = "WireIt.InOutContainer";this.options.className = A.className || "WireIt-Container WireIt-InOutContainer";this.options.resizable = (typeof A.resizable == "undefined") ? false : A.resizable;this.options.inputs = A.inputs || [];this.options.outputs = A.outputs || []
}, render: function() {
	WireIt.InOutContainer.superclass.render.call(this);for (var C = 0; C < this.options.inputs.length; C++) {
		var B = this.options.inputs[C];this.options.terminals.push( { name: B, direction: [-1,0], offsetPosition: { left: -14, top: 3 + 30 * (C + 1) }, ddConfig: { type: "input", allowedTypes: ["output"] } });this.bodyEl.appendChild(WireIt.cn("div", null, { lineHeight: "30px" }, B))
	}for (C = 0; C < this.options.outputs.length; C++) {
		var A = this.options.outputs[C];this.options.terminals.push( { name: A, direction: [1,0], offsetPosition: { right: -14, top: 3 + 30 * (C + 1 + this.options.inputs.length) }, ddConfig: { type: "output", allowedTypes: ["input"] }, alwaysSrc: true });this.bodyEl.appendChild(WireIt.cn("div", null, { lineHeight: "30px", textAlign: "right" }, A))
	}
} });