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
		this.fontStyle = $.extend({},LGE.UI.Text2D.defaultStyle,fontStyle);
		LGE.UI.Object2D.prototype.init.call(this);
	}
	,draw:function(context){
		if(this.text===""){
			return;
		}

		var s=this.fontStyle,str = s.capitalize?this.text.toUpperCase():this.text;
		context.font = [s.style,s.weight,s.size+'px',s.family].join(" ");
		context.textAlign = s.align;
		context.textBaseline = s.baseline;

		if(s.fill||!s.stroke){
			if(s.shadow > 0){
				context.shadowBlur = s.shadow;
				context.shadowColor = s.shadowColor;
			}
			context.fillStyle = s.color;
			context.fillText(str,0,0);
		}
		if(s.stroke){
			context.strokeStyle = s.strokeColor;
			context.lineWidth = s.strokeSize;
			context.strokeText(str,0,0);
		}
	}
},{
	defaultStyle:{
		family:"Arial"
		,size:12
		,style:"normal"
		,color:"#000"
		,weight:"normal"
		,stroke:false
		,fill:true
		,strokeColor:"#000"
		,strokeSize: 1
		,baseline:"top"
		,align:"left"
		,shadow:0
		,capitalize:false
		,shadowColor:"#000"
	}
})