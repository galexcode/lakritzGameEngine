/**
 *class		Box2d
 *package	 LGE.UI
 *file 		 box2d.js
 */

LGE.UI.Box2D = LGE.UI.Object2D.extend({
	style:null
	,init:function(width,height,style){
		LGE.UI.Shape2D.prototype.init.call(this);
		this.style = style || new LGE.UI.BoxShape2D.DefaultStyle;
		this.width = width || 100;
		this.height = height || 100;
	}
	,draw:function(context){
		var style=this.style.get();
		
		if(style.background!==false){
			context.save();
			if(style.shadow!==false){
				context.shadowBlur = style.shadowSize;
				context.shadowColor = style.shadow;
				context.shadowOffsetX = style.shadowX;
				context.shadowOffsetY = style.shadowY;
			}
			context.fillStyle = style.color;
			context.fillRect(0,0,this.width,this.height);
			context.restore();
		}

		if(style.border!==false){
			context.save();
			context.strokeStyle = style.border;
			context.lineWidth = style.borderSize;
			context.strokeRect(style.borderSize / 2,style.borderSize / 2,this.width - style.borderSize,this.height - style.borderSize);
			context.restore();
		}
	}
},{
	DefaultStyle:LGE.UI.Style.extend({
		__defaults:{
			color:"#000"
			,shadow:false
			,shadowSize:5
			,shadowX:0
			,shadowY:0
			,border:"#000"
			,borderSize:1
		}
	})
});