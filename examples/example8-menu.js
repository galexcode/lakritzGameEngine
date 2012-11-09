'use strict';
LGE.physiconf.worker = 'assets/js/physijs_worker.js';
LGE.load('assets/js/jquery-1.8.1.min.js;assets/js/three.min.js;assets/js/physi.js;assets/js/stats.min.js'.split(';'),
function(){
window.Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new MenuScreen(this));
	}
});

var MenuScreen = LGE.Screen.extend({
	setupScene:function(){
		MenuScreen.__super__.setupScene.call(this);
		this.setCamera(new THREE.PerspectiveCamera(65,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar));
		this.scene.add(this.camera);

		this.scene.add(new THREE.PointLight(0xffffff,1));

		var mouse = new LGE.Mouse3D(this.game,this.camera);

		var button1 = new MenuButton("test123");
		button1.position.set(0,50,-200);
		this.scene.add(button1);
		mouse.add(button1);

		var button2 = new MenuButton("321tset");
		button2.position.set(0,-50,-200);
		this.scene.add(button2);
		mouse.add(button2);
	}
});

var MenuButton = lakritz.makeClass(THREE.Mesh,{
		animations:null,
		label:null,
		constructor:function(){
			lakritz.Model.apply(this,arguments);
		}
		,init:function(label,width,height,depth){
			width = width||100;
			height= height||25;
			depth = depth||10;
			this.label = label||"";
			THREE.Mesh.call(this,new THREE.CubeGeometry(width,height,depth), new THREE.MeshPhongMaterial({color:0x00ff00}));
			this.animations = new LGE.AnimationManager;		
			this.bind("mouseover",this.onMouseOver).bind("mouseout",this.onMouseOut)
			.bind("update",function(delta){this.animations.update(delta)});
			this.createAnimations();
		}
		,createAnimations:function(){
			var over = new LGE.AnimationQueue, out = new LGE.AnimationQueue;

			over
			.queue([
				new LGE.Animation(this.scale,{x:1.1,y:1.1},{duration:500,ease:"easeOutBack"})
				,new LGE.Animation(this.rotation,{x:LGE.Math.deg2rad(-180)},{duration:500,ease:"easeInOutExpo"})
			])
			.queue(
				new LGE.Animation(this.rotation,{z:LGE.Math.deg2rad(180)},{duration:200,ease:"easeInOutQuad"})
			)
			.name = "over";
			this.animations.add(over);

			out
			.queue([
				new LGE.Animation(this.scale,{x:1,y:1},{duration:500,ease:"easeOutBack"})
				,new LGE.Animation(this.rotation,{x:0,z:0},{duration:500,ease:"easeInOutExpo"})
			])
			.name = "out";
			this.animations.add(out);
		}
		,onMouseOver:function(){
			this.material.color.setHex(0xff0000)
			this.animations.getChildByName("out").stop(true);
			this.animations.getChildByName("over").updateStartValues().start();
		}
		,onMouseOut:function(){
			this.material.color.setHex(0x0000ff)
			this.animations.getChildByName("over").stop(true);
			this.animations.getChildByName("out").updateStartValues().start();

		}
	});

});