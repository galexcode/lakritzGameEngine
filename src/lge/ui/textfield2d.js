/**
 *class		Textfield2D
 *package	 LGE.UI
 *file 		 textfield2d.js
 */
LGE.UI.Textfield2D = LGE.UI.Shape2D.extend({
	__t2d:null
	,__b2d:null
	,init:function(text,style,width,height){
		width = width || 100;
		height = height || 100;
		LGE.UI.Shape2D.prototype.init.call(this,width,height);
		text = text||"";
		style = style || new LGE.UI.Textfield2D.DefaultStyle;
		this.__defineGetter__("text",function(){
			return text;
		});
		this.__defineSetter__("text",function(t){
			text = t;
			this.trigger("change");
		});
		this.__defineGetter__("style",function(){
			return style;
		});
		this.__defineSetter__("style",function(s){
			style = s;
			this.trigger("change");
		});
		this.bind("resize",this.__drawText).bind("change",this.__drawText);
		
		this.__t2d = new LGE.UI.Text2D("",this.style.get("textStyle"));
		this.__b2d = new LGE.UI.Box2D(this.width,this.height,this.style.get("boxStyle"));

		this.__drawText();
	}
	,__drawText:function(){
		var style = this.style.get()
		,boxStyle = style.boxStyle.get()
		,textStyle = style.textStyle.get()
		,text2d = this.__t2d
		,box2d = this.__b2d
		,nodes = this.text.split(/(\b|\n)/)
		,node
		,nodeHeight
		,newparagraph = false
		,x=style.padding 
		,y=style.padding
		,measures;

		box2d.width = this.width;
		box2d.height = this.height;
		box2d.draw(this.context);

		//support for center, right etc. not implemented yet!
		textStyle.align="left";
		
		for(node=0;node<nodes.length;++node){
			newparagraph = false;
			if(!nodes[node].length){
				continue;
			}
			text2d.text = nodes[node];
			measures = text2d.getMeasurements(this.context);
			nodeHeight = style.lineHeight!==false?style.lineHeight:textStyle.size+textStyle.size*style.lineSpacing;
			if(style.multiline && (nodes[node]==="\n" || x+measures.width > this.width - style.padding)){
				y += nodeHeight;
				x = style.padding;
				newparagraph = true;
				if(nodes[node]==="\n" || nodes[node]===" "){
					continue;
				}
			}

			switch(textStyle.align){
				default:
				case "center"://todo
				case "right"://todo
				case "left":
					text2d.position.x = x;
					x+=measures.width;
				break;
			}
			text2d.position.y = y;
			if(text2d.position.y + nodeHeight <= this.height - style.padding)	{
				this.context.save();
				this.context.translate(text2d.position.x,text2d.position.y);
				text2d.draw(this.context);
				this.context.restore();	
			}
		}
	}
},{
	DefaultStyle:LGE.UI.Style.extend({
		__defaults:{
			textStyle:null
			,boxStyle:null
			,multiline:true
			,lineHeight:false
			,lineSpacing:.4
			,padding:0
		},
		init:function(parameters){
			LGE.UI.Style.prototype.init.call(this,parameters);
			if(!this.get("textStyle")){
				this.set("textStyle",new LGE.UI.Text2D.defaultStyle);
			}
			if(!this.get("boxStyle")){
				this.set("boxStyle",new LGE.UI.Style);
			}
		}
	})
});