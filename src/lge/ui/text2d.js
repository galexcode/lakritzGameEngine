/**
 *class		Text2D
 *package	 LGE.UI
 *file 		 text2d.js
 */

LGE.UI.Text2D = lakritz.makeClass(LGE.UI.Object2D,{
	text:null
	,fontStyle:null
	,init:function(text, fontStyle){
		this.text = text||"";
		this.fontStyle = fontStyle||new LGE.UI.Text2D.DefaultStyle;
		LGE.UI.Object2D.prototype.init.call(this);
	}
	,draw:function(context){
		if(this.text===""){
			return;
		}

		var s=this.fontStyle.get(),str = s.capitalize?this.text.toUpperCase():this.text;
		context.font = [s.style,s.weight,s.size+'px',s.family].join(" ");
		context.textAlign = s.align;
		context.textBaseline = s.baseline;

		if(s.fill||s.stroke === false){
			if(s.shadow !== false){
				context.shadowBlur = s.shadowSize;
				context.shadowColor = s.shadow;
			}
			context.fillStyle = s.color;
			context.fillText(str,0,0);
		}
		if(s.stroke !== false){
			context.strokeStyle = s.stroke;
			context.lineWidth = s.strokeSize;
			context.strokeText(str,0,0);
		}
	}
	,getMeasurements:function(context){
		var s=this.fontStyle.get(),str = s.capitalize?this.text.toUpperCase():this.text, m;
		context.save();
		context.font = [s.style,s.weight,s.size+'px',s.family].join(" ");
		context.textAlign = s.align;
		context.textBaseline = s.baseline;

		if(s.fill||s.stroke === false){
			if(s.shadow !== false){
				context.shadowBlur = s.shadowSize;
				context.shadowColor = s.shadow;
				context.shadowOffsetX = s.shadowX;
				context.shadowOffsetY = s.shadowY;
			}

		}
		if(s.stroke !== false){
			context.strokeStyle = s.stroke;
			context.lineWidth = s.strokeSize;
		}
		m = context.measureText(str);
		context.restore();
		return m;
	}
},{
	DefaultStyle: LGE.UI.Style.extend({
		__defaults:{
			family:"Arial"
			,size:12
			,style:"normal"
			,color:"#000"
			,weight:"normal"
			,stroke:false
			,fill:true
			,stroke:false
			,strokeSize: 1
			,baseline:"top"
			,align:"left"
			,shadow:0
			,capitalize:false
			,shadowColor:"#000"
			,shadow:false
			,shadowSize:10
			,shadowX:0
			,shadowY:0
		}
	})
})