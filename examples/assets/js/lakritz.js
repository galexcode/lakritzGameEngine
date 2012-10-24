!function($){
	/**
	 * @brief inherits funktion, übernommen von backbone.js
	 */
	var ctor = function(){};
	var inherits = function(parent, protoProps, staticProps) {
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
    return child;
  };

	/**
	 * @brief extend funktion, übernommen von backbone.js
	 */
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

	var inc_reg = {};

	var LK = window.$$ = window.lakritz = {
		include:function(file){
			console.warn("Include is deprecated, use requireJS instead");
			inc_reg[file] = true;
			document.write(unescape('%3Cscript src="'+file+'"%3E%3C/script%3E'));
		},
		includeOnce:function(file){
			if(!inc_reg[file]){
				window.$$.include(file);
			}
		},
		typeOf:function(obj){
			return Object.prototype.toString.call(obj).toLowerCase()
		},
		isString:function(str){
			return LK.typeOf(str)=="[object string]";
		},
		isObject:function(obj){
			return LK.typeOf(obj)=="[object object]";
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

	var serialize = function(){
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
	};

	var toJSON = function(){
		var rep='{', data = serialize.call(this);

		if(JSON){
			return JSON.stringify(data);
		}

		for(var prop in data){
			if(data.hasOwnProperty(prop)){
				rep+='"'+prop+'":';
				if($.isArray(data[prop])){
					rep += "["+data[prop]+"]";
				}else if($.isPlainObject(data[prop])){
					rep += toJSON.call(data[prop]);
				}else if(LK.isString(data[prop])){
					rep += '"'+LK.addSlashes(data[prop])+'"';
				}else{
					rep += data[prop];
				}
				rep += ', ';
			}
		}
		return rep.substr(0,rep.length-2)+'}';
	}

	var baseModel = LK.Model = function(){
		var stack = {};
		
		this.bind = function(evt,func){
			if(!LK.isString(evt)||!evt.length||!$.isFunction(func)){
				return this;
			}
			if(!stack[evt]){
				stack[evt] = [];
			}
			stack[evt].push(func);
			return this;
		};

		this.unbind = function(evt,func){
			if(!LK.isString(evt) || !stack[evt]){
				return this;
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
			return this;
		}

		this.trigger = function(evt){
			var evtObj = null;
			if(LK.isString(evt)){
				evtObj = {
					name:evt
				};
			}else if($.isPlainObject(evt) && evt.name){
				evtObj = evt;
			}else{
				return this;
			}
			
			if(!stack[evtObj.name] || !stack[evtObj.name].length){
				return this;
			}
			
			var f=0;
			while(f<stack[evtObj.name].length){
				stack[evtObj.name][f].call(this,evtObj);
				f++;
			}

			return this;
		}


		if($.isFunction(this.init)){
			this.init.apply(this,arguments);	
		}
	};

	baseModel.extend = extend;

	baseModel.prototype = {
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
	};

	var Singleton = LK.Singleton = baseModel.extend({},{
		getInstance:function(){
			if(!this.__inst__){
				this.__inst__ = new (this);
			}

			return this.__inst__;
		},
		__inst__:null
	});

}(jQuery);