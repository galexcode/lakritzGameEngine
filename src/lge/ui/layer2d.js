/**
 *class		Layer2D
 *package	 LGE.UI
 *file 		 layer2d.js
 */
LGE.UI.Layer2D = lakritz.makeClass(THREE.Sprite,{
	context:null
	,object2DContainer:null
	,clear:true
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(width,height,container,parameters){
		if(!parameters){
			parameters = {};
		}
		
		width = width||256;
		height = height||256;

		var size = width>height?width:height;

		parameters.map = parameters.map || new LGE.TEXTURES.CanvasTexture(null,size,size);
		parameters.alignment = parameters.alignment || THREE.SpriteAlignment.topLeft;
		THREE.Sprite.call(this,parameters);
		this.context = this.map.context;
		
		this.__defineGetter__("width",function(){
			return width;
		});

		this.__defineGetter__("height",function(){
			return height;
		});

		this.__defineSetter__("size",function(w,h){
			size = w>h?w:h;
			width = w;
			height = h;
			this.trigger("resize");
			this.map.setSize(size);
		});
		
		this.__defineGetter__("size",function(){
			return {
				width:width
				,height:height
			};
		});

		this.object2DContainer = container||new LGE.UI.Object2DContainer;
		this.object2DContainer.stage = this;
		this.object2DContainer.trigger("addedToStage");
		this.bind("update",function(delta){
			if(this.clear){
				this.context.clearRect(0,0,this.width,this.height);
			}
			if(!this.object2DContainer)
				return;
			this.context.globalAlpha = 1;
			this.object2DContainer.draw(this.context);
			this.object2DContainer.trigger("update",delta);
			this.map.needsUpdate = true;
		});
	}
});