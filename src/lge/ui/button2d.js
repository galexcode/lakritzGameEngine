/**
 *class		 Button2D
 *package	 LGE.UI
 *file 		 button2d.js
 */

LGE.UI.Button2D = lakritz.makeClass(LGE.UI.Object2DContainer,{
	label:null
	,constructor:function(){
		LGE.UI.Button.apply(this,arguments);
	}
	,init:function(label){
		if(!lakritz.isObject(label)){
			this.label = new LGE.UI.Text2D(label===undefined?"":label,LGE.UI.Button2D.defaultLabelStyle);
		}else{
			this.label = label;
		}
		LGE.UI.Object2DContainer.prototype.init.call(this);
		//this.label.position.x = 50;
		var bg = new LGE.UI.Shape2D(100,20);
		bg.context.color="black";
		bg.context.fillRect(0,0,100,20);
		bg.position.x = -50;
		this.add(bg);
		this.label.position.y = 10;
		this.add(this.label);
	}
},{
	defaultLabelStyle:{
		color:"white"
		,family:"Verdana"
		,align:"center"
		,baseline:"middle"
		,size:9
	},
	defaultButtonStyle:{
		width:100
		,height:20
	}
});