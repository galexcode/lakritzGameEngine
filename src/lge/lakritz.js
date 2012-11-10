!function($){
	var inc_reg = {};

	var LK = window.$$ = window.lakritz = {
		typeof:function(obj){
			var t=Object.prototype.toString.call(obj).substr(8); return t.substr(0,t.length-1).toLowerCase();
		},
		isString:function(str){
			return LK.typeof(str)=="string";
		},
		isObject:function(obj){
			return LK.typeof(obj)=="object";
		},
		isArray:function(obj){
			return LK.typeof(obj)=="array";
		},
		isFunction:function(obj){
			return LK.typeof(obj)=="function";
		},
		isNull:function(obj){
			return obj===null;
		},
		isInt:function(obj){
			return !isNaN(obj)&&obj.toString().indexOf('.')<0;
		},
		isNumber:function(obj){
			return !isNaN(obj);
		},
		addSlashes:function(str) {
		str=str.replace(/\\/g,'\\\\');
		str=str.replace(/\'/g,'\\\'');
		str=str.replace(/\"/g,'\\"');
		str=str.replace(/\0/g,'\\0');
		return str;
		},
		stripSlashes: function(str) {
		str=str.replace(/\\'/g,'\'');
		str=str.replace(/\\"/g,'"');
		str=str.replace(/\\0/g,'\0');
		str=str.replace(/\\\\/g,'\\');
		return str;
		},
		markers:function(str,obj,quotes){
			quotes = (quotes||'{{|}}').split('|');
			for(var param in obj){
		 		if(obj.hasOwnProperty(param)){
		 			str = str.split(quotes[0]+param+quotes[1]).join(obj[param]);
		 		}
	 		}
	 		return str;
		}
	};



	var ctor = function(){};
	var inherits = lakritz.makeClass = function(parent, protoProps, staticProps) {
	    var child;

	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent's constructor.
	    if (protoProps && protoProps.hasOwnProperty('constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ parent.apply(this, arguments); };
	    }

	    // Inherit class (static) properties from parent.
	    $.extend(child, parent);

	    // Create a legit extension of the parent with Object.create, for modern browsers (sry IE8...)
	    if($.browser.msie && parseInt($.browser.version.split('.')[0]) < 9){
	    	// Set the prototype chain to inherit from `parent`, without calling
	    	// `parent`'s constructor function.
	    	ctor.prototype = parent.prototype;
	    	child.prototype = new ctor();
	    }else{
	    	child.prototype = Object.create(parent.prototype);
	    }

	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) $.extend(child.prototype, protoProps);

	    // Add static properties to the constructor function, if supplied.
	    if (staticProps) $.extend(child, staticProps);

	    // Correctly set child's `prototype.constructor`.
	    child.prototype.constructor = child;

	    // Set a convenience property in case the parent's prototype is needed later.
	    child.__super__ = child.prototype.__super__ = parent.prototype;
	    child.prototype.Super = function(){
	    	console.warn("Super is deprecated, use this.__super__.func.call(this) instead");
	    }
	    child.extend = parent.extend || function(protoProps,staticProps){
	    	return inherits(this,protoProps,staticProps);
	    }
	    return child;
	};

	var baseModel = LK.Model = inherits(function(){
		var stack = {};
		
		this.bind = this.addEventListener = function(evt,func){
			if(!LK.isString(evt)||!evt.length||!$.isFunction(func)){
				return this;
			}
			if(!stack[evt]){
				stack[evt] = [];
			}
			stack[evt].push(func);
			return this;
		};

		this.unbind = this.removeEventListener = function(evt,func){
			if(!LK.isString(evt) || !stack[evt]){
				return false;
			}
			if(!$.isFunction(func)){
				stack[evt] = [];
			}else{
				var f = stack[evt].length - 1;
				while(f+1){
					if(stack[evt][f] === func){
						stack[evt].splice(f,1);
					}
					--f;
				}
			}
			return true;
		}

		this.trigger = this.dispatchEvent = function(){
			var eventName=null,parameters=null;
			if(LK.isString(arguments[0])){
				eventName=arguments[0];
				Array.prototype.splice.call(arguments,0,1);
				parameters=arguments;
			}else if($.isPlainObject(arguments[0]) && arguments[0].name){
				eventName=arguments[0].name;
				parameters=arguments;
			}else{
				return this;
			}

			if(!stack[eventName] || !stack[eventName].length){
				return this;
			}
			
			var f=stack[eventName].length;
			while(f--){
				stack[eventName][f].apply(this,parameters);
			}

			return this;
		}

		this.serialize = function(){
			var s = $.isArray(this)?[]:{},isplain;
			for(var prop in this){
				isplain = $.isPlainObject(this[prop]);
				if($.isFunction(this[prop]) || (LK.isObject(this[prop])&&!isplain))
					continue;
				if(isplain|| $.isArray(this[prop])){
					s[prop] = this.serialize.call(this[prop]);
				}else{
					s[prop] = this[prop];
				}	
			}
			return s;
		}

		this.toJSON = function(){
			var data = this.serialize();
			if(JSON){
				try{
					return JSON.stringify(data);	
				}catch(e){
					console.warn(e.message);
					return "{}";
				}
			}else{
				console.warn("browser doesnt support JSON");
				return "{}";
			}
		}

		/*this.toString = function(){
			return '[object '+this.toJSON()+']';
		};*/

		if($.isFunction(this.init)){
			this.init.apply(this,arguments);	
		}
	});

	//baseModel.extend = extend;

	/*baseModel.prototype = {
		init:function(){},
		toString:function(){
			return '[object '+this.toJSON()+']';
		},
		serialize:function(){
			return serialize.call(this);
		},
		unserialize:function(data){
			if(!$.isPlainObject(data)){
				return false;
			}
			$.extend(true,this,data);
			return true;
		},
		toJSON:function(){
			return toJSON.call(this);
		}
	};*/

	var Singleton = LK.Singleton = baseModel.extend({},{
		getInstance:function(){
			if(!this.__inst__){
				this.__inst__ = new (this);
			}
			return this.__inst__;
		},
		__inst__:null
	});

}(window.jQuery);