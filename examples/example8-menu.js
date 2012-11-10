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
		this.setCamera(new THREE.PerspectiveCamera(30,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar));
		//this.setCamera(new THREE.OrthographicCamera(this.game.width/-2,this.game.height/2,this.game.width/2,this.game.height/-2,1,1000));
		this.scene.add(this.camera);
		this.camera.position.z=100;
		this.camera.position.y=-30;
		this.camera.lookAt(new THREE.Vector3);
		
		var light = new THREE.PointLight(0xffdd00,.9);
		light.position.z = 10;
		this.scene.add(light);

		var mouse = new LGE.Mouse3D(this.game,this.camera);

		/*var uiButton = new MenuButton();
		uiButton.position.z = -280;
		mouse.add(uiButton);
		this.scene.add(uiButton);

		var uiButton2 = new MenuButton();
		uiButton2.position.z = -280;
		uiButton2.position.y = -50;
		mouse.add(uiButton2);
		this.scene.add(uiButton2);*/
		//uiButton.trigger("focus");
		var i=64,button,cols=8,left = -(10*cols/2) + 5,top=-(5*(i/cols/2));
		while(i--){
			button = new MenuButton("button "+i);
			button.position.set(
				left + ((i%cols) * 10)
				,top + (Math.floor(i/cols)*5)
				,0
			);
			mouse.add(button);
			this.scene.add(button);
		}		
	}
});

var MenuButton = LGE.UI.Button3D.extend({
	init:function(label,geometry,material){
		label = label || "MenuButton";
		geometry = geometry || new THREE.PlaneGeometry(10,5);
		material = material || new THREE.MeshPhongMaterial({map:new LGE.TEXTURES.CanvasTexture,specular:0xffffff,shininess:2});
		material.side = THREE.DoubleSide;
		//material.opacity = .4;
		//material.map = new LGE.TEXTURES.CanvasTexture;
		LGE.UI.Button3D.prototype.init.call(this,label,geometry,material);

		this.writeLabel();

		this.setStateAnimation(
			LGE.UI.Button.STATE_DEFAULT
			,new LGE.AnimationQueue().queue([
				//new LGE.Animation(this.material.color,{r:this.material.color.r,g:this.material.color.g, b:this.material.color.b},{duration:200,ease:"easeOutQuad"})
				new LGE.Animation(this.rotation,{x:0},{duration:1000,ease:"easeOutBack"})
				,new LGE.Animation(this.position,{z:0},{duration:500,ease:"easeInOutQuad"})
				,new LGE.Animation(this.material,{opacity:1},{duration:100,ease:"easeInOutQuad"})
			])
		);

		this.setStateAnimation(
			LGE.UI.Button.STATE_HOVER
			,new LGE.AnimationQueue().queue([
				//new LGE.Animation(this.material.color,{r:1,g:0,b:0},{duration:200,ease:"easeOutQuad"})
				//,new LGE.Animation(this.rotation,{x:LGE.Math.deg2rad(180)},{duration:1000,ease:"easeOutBack"})
				new LGE.Animation(this.position,{z:3},{duration:200,ease:"easeInOutQuad"})
				//,new LGE.Animation(this.material,{opacity:.9},{duration:100,ease:"easeInOutQuad"})
			])
		);

		this.setStateAnimation(
			LGE.UI.Button.STATE_PRESSED
			,new LGE.AnimationQueue().queue([
				//new LGE.Animation(this.material.color,{r:1,g:1,b:0},{duration:10,ease:"easeOutQuad"})
				new LGE.Animation(this.position,{z:0},{duration:0,ease:"easeInOutExpo"})
			])
		);
	},
	writeLabel:function(){
		var tex = this.material.map, g = tex.context;
		tex.setSize(256,128);
		//g.measureText(this.label).width
		
		//bg
		g.fillStyle="#333333";
		g.fillRect(0,0,tex.getSize().width,tex.getSize().height);

		//g.fillStyle="red";
		//g.fillRect(0,0,5,5);

		g.font = "22pt Verdana";
		g.textAlign = "center";
		g.textBaseline = "middle";
		g.fillStyle = "#ffcc00";
		g.fillText(this.label, tex.domElement.width / 2, tex.domElement.height / 2);
	}
});

});