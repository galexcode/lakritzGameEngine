/**
 *class		Shape2D
 *package	 LGE.UI
 *file 		 shape2d.js
 */

LGE.UI.Shape2D = lakritz.makeClass(LGE.UI.Object2D,{
	domElement:null
	,context:null
	,init:function(width,height,position,rotation){
		LGE.UI.Object2D.prototype.init.call(this,position,rotation);
		this.domElement = document.createElement("canvas");
		this.context = this.domElement.getContext("2d");
		
		this.__defineGetter__("width",function(){
			return this.domElement.width;
		});
		this.__defineSetter__("width",function(w){
			if(w<=0){
				console.warn("LGE.UI.Shape2D: width must be greater than 0");
			}
			this.domElement.width = w;
			this.trigger("resize");
		});
		this.__defineGetter__("height",function(){
			return this.domElement.height;
		});
		this.__defineSetter__("height",function(h){
			if(h<=0){
				console.warn("LGE.UI.Shape2D: height must be greater than 0");
			}
			this.domElement.height = h;
			this.trigger("resize");
		});

		this.width = width || 100;
		this.height = height || 100;

	}
	,draw:function(context){
		context.drawImage(this.domElement,0,0);
	}
});