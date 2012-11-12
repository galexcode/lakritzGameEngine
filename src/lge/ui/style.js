/**
 *class		Style
 *package	 LGE.UI
 *file 		 style.js
 */
LGE.UI.Style = lakritz.Model.extend({
	__defaults:{

	}
	,init:function(parameters){
		if(lakritz.isObject(parameters)){
			parameters = $.extend(true,{},this.__defaults,parameters);
		}else{
			parameters = $.extend(true,{},this.__defaults,{});
		}

		this.set = function(param,value){
			if(lakritz.isObject(param)){
				$.extend(true,parameters,param);
			}else{
				var obj = {};
				obj[param] = value;
				$.extend(true,parameters,obj);
			}
			this.trigger("change");
			return this;
		}
		this.get = function(param){
			if(!arguments.length){
				return parameters;
			}
			if(!lakritz.isString(param) || !parameters.hasOwnProperty(param)){
				return undefined;
			}
			return parameters[param];
		}
	}
});