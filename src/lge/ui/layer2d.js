/**
 *class		Layer2D
 *package	 LGE.UI
 *file 		 layer2d.js
 */
LGE.UI.Layer2D = lakritz.makeClass(THREE.Sprite,{
	context:null
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(size,parameters){
		size = size || 256;

		if(!parameters){
			parameters = {};
		}
		
		parameters.map = parameters.map || new LGE.TEXTURES.CanvasTexture(null,size,size);
		parameters.alignment = parameters.alignment || THREE.SpriteAlignment.topLeft;
		THREE.Sprite.call(this,parameters);
		this.context = this.map.context;
		
		this.__defineSetter__("size",function(size){
			this.map.setSize(size);
		});
		
		this.__defineGetter__("size",function(){
			return this.map.getSize(size).width;
		});
	}
});