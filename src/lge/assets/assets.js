LGE.Assets = lakritz.Singleton.extend({
	add:function(name,file){
		if(lakritz.isObject(name)){
			$.extend(LGE.Assets.files,name);
		}else if(lakritz.isString(name) && lakritz.isString(file)){
			LGE.Assets.files[name] = file;
		}
		return this;
	},
	get:function(name){
		return LGE.Assets.files[name];
	}
},{
	files:{}
});