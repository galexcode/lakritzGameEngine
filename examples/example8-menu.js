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

		this.scene.add(new THREE.PointLight(0xffffff,.8));

		var mouse = new LGE.Mouse3D(this.game,this.camera);

		var uiButton = new MenuButton();
		uiButton.position.z = -280;
		mouse.add(uiButton);
		this.scene.add(uiButton);

		var uiButton2 = new MenuButton();
		uiButton2.position.z = -280;
		uiButton2.position.y = -100;
		mouse.add(uiButton2);
		this.scene.add(uiButton2);
		//uiButton.trigger("focus");
		/*var i=6,button;
		while(i--){
			button = new MenuButton("button "+i,70,30,30);
			button.position.set(188 - (i*75),0,-280);
			mouse.add(button);
			this.scene.add(button);
		}*/		

		/*var button2 = new MenuButton("321tset");
		button2.position.set(0,-70,-350);
		this.scene.add(button2);
		mouse.add(button2);*/
	}
});

var MenuButton = LGE.UI.Button.extend({
	init:function(label,geometry,material){
		label = label || "MenuButton";
		geometry = geometry || new THREE.CubeGeometry(100,50,10);
		material = material || new THREE.MeshBasicMaterial({color:0xaaaaaa});
		LGE.UI.Button.prototype.init.call(this,label,geometry,material);

		this.setStateAnimation(
			LGE.UI.Button.STATE_DEFAULT
			,new LGE.AnimationQueue().queue([
				new LGE.Animation(this.material.color,{r:this.material.color.r,g:this.material.color.g, b:this.material.color.b},
				{duration:200,ease:"easeOutQuad"})
				,new LGE.Animation(this.rotation,{x:0},{duration:200,ease:"easeOutQuad"})
			])
		);

		this.setStateAnimation(
			LGE.UI.Button.STATE_HOVER
			,new LGE.AnimationQueue().queue([
				new LGE.Animation(this.material.color,{r:1,g:0,b:0},{duration:200,ease:"easeOutQuad"})
				,new LGE.Animation(this.rotation,{x:LGE.Math.deg2rad(180)},{duration:200,ease:"easeOutQuad"})
			])
		);

		this.setStateAnimation(
			LGE.UI.Button.STATE_PRESSED
			,new LGE.AnimationQueue().queue(new LGE.Animation(this.material.color,{r:1,g:1,b:0},{duration:200,ease:"easeOutQuad"}))
		);

		var test = new THREE.Mesh(new THREE.CubeGeometry(20,20,20),new THREE.MeshBasicMaterial({color:0xaaaaaa}));
		test.position.z = -15;
		this.add(test);
	}
});

/*var MenuButton = lakritz.makeClass(THREE.Mesh,{
		animations:null,
		label:null,
		constructor:function(){
			lakritz.Model.apply(this,arguments);
		}
		,init:function(label,width,height,depth){
			width = width||100;
			height= height||100;
			depth = depth||100;
			this.label = label||"";
			THREE.Mesh.call(this,new THREE.CubeGeometry(width,height,depth), new THREE.MeshPhongMaterial({color:0x888888}));
			this.animations = new LGE.AnimationManager;		
			this.bind("mouseover",this.onMouseOver).bind("mouseout",this.onMouseOut)
			.bind("update",function(delta){this.animations.update(delta)});
			this.createAnimations();
		}
		,createAnimations:function(){
			var over = new LGE.AnimationQueue, out = new LGE.AnimationQueue;

			over
			.queue([
				new LGE.Animation(this.scale,{x:1.1,y:1.1},{duration:500,ease:"easeInOutExpo"})
				,new LGE.Animation(this.rotation,{x:LGE.Math.deg2rad(-180)},{duration:500,ease:"easeInOutExpo"})
				,new LGE.Animation(this.material.color,{r:1,g:.4,b:.3},{duration:800,ease:"easeInOutExpo"})
				,new LGE.Animation(this.material,{opacity:.9},{delay:400,duration:400,ease:"easeInOutQuad"})
			])
			.queue(
				new LGE.Animation(this.material,{opacity:1},{duration:400,ease:"easeInOutQuad"})
			)
			.name = "over";
			this.animations.add(over);

			out
			.queue([
				new LGE.Animation(this.scale,{x:1,y:1},{duration:500,ease:"easeOutBack"})
				,new LGE.Animation(this.rotation,{x:0,z:0},{duration:500,ease:"easeInOutExpo"})
				,new LGE.Animation(this.material.color,{r:.5,g:.5,b:.5},{duration:800,ease:"easeInOutExpo"})
				,new LGE.Animation(this.material,{opacity:1},{duration:500,ease:"easeInOutExpo"})
			])
			.name = "out";
			this.animations.add(out);
		}
		,onMouseOver:function(){
			this.animations.getChildByName("out").stop(true);
			this.animations.getChildByName("over").updateStartValues().start();
		}
		,onMouseOut:function(){
			this.animations.getChildByName("over").stop(true);
			this.animations.getChildByName("out").updateStartValues().start();

		}
	});*/

});