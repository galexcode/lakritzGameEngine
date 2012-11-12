/**
 *class		 Button2D
 *package	 LGE.UI
 *file 		 button2d.js
 */

LGE.UI.Button2D = lakritz.makeClass(LGE.UI.Object2DContainer,{
	label:null
	,bg:null
	,constructor:function(){
		LGE.UI.Button.apply(this,arguments);
	}
	,init:function(label,width,height){
		if(!lakritz.isObject(label)){
			this.label = new LGE.UI.Text2D(label===undefined?"":label,LGE.UI.Button2D.defaultLabelStyle);
		}else{
			this.label = label;
		}
		LGE.UI.Object2DContainer.prototype.init.call(this);
		width = width||100;
		height = height||30;

		this.__defineGetter__("width",function(){
			return width;
		});
		this.__defineSetter__("width",function(w){
			if(w<=0){
				console.warn("LGE.UI.Button2D: width must be greater than 0");
			}
			width = w;
			this.trigger("resize");
		});
		this.__defineGetter__("height",function(){
			return height;
		});
		this.__defineSetter__("height",function(h){
			if(h<=0){
				console.warn("LGE.UI.Button2D: height must be greater than 0");
			}
			height = h;
			this.trigger("resize");
		});

		this.createSkin();
	}
	,createSkin:function(){
		var t=this;
		this.bg = new LGE.UI.Shape2D();
		(function drawBg(){
			t.bg.width = t.width;
			t.bg.height = t.height;
			t.bg.context.clearRect(0,0,t.width,t.height);
			t.bg.context.fillStyle="rgba(0,0,0,.7)";
			t.bg.context.fillRect(0,0,t.width,t.height);
			t.bg.context.lineWidth = 1;
			t.bg.context.strokeStyle = "#ffaa00";
			t.bg.context.strokeRect(.5,.5,t.width-1,t.height-1);
		})();
		
		this.add(t.bg);
		(function positionLabel(){
			t.label.position = new THREE.Vector2(
				t.width /2
				,t.height/2
			);
		})();
		this.add(this.label);
		this.bind("resize",function(){
			drawBg();
			positionLabel();
		});
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