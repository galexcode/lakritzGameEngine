'use strict';
LGE.physiconf.worker = 'assets/js/physijs_worker.js';
LGE.load('assets/js/jquery-1.8.1.min.js;assets/js/lakritz.js;assets/js/three.min.js;assets/js/physi.js;assets/js/stats.min.js'.split(';'),
function(){
window.Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new MenuScreen(this));
	}
});

var MenuScreen = LGE.World.extend({
	setupScene:function(){
		MenuScreen.__super__.setupScene.call(this);
		this.setCamera(new THREE.PerspectiveCamera(35,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar));
		this.scene.add(this.camera);

		this.scene.add(new THREE.PointLight(0xffffff,1));

		var mouse = new LGE.Mouse3D(this.game,this.camera);

		/*var button1 = new MenuButton("test123",this.game);
		button1.position.set(0,50,-400);
		this.scene.add(button1);
		mouse.add(button1);

		/*var button2 = new MenuButton("321tset",this.game);
		button2.position.set(0,-50,-400);
		this.scene.add(button2);
		mouse.add(button2);*/
	}
	,update:function(delta){
		var child=this.scene.children.length;
		while(child--){
			if(this.scene.children[child].trigger)
				this.scene.children[child].trigger({"name":"update","delta":delta});
		}
	}
});

var MenuButton = LGE.ENTITIES.Entity.extend({
	animation:null
	,proxy:null
	,init:function(label,game,width,height,depth){
		width = width || 100;
		height= height || 50;
		depth = depth || 50;
		this.game=game;
		MenuButton.__super__.init.call(this,new THREE.CubeGeometry(width,height,depth), new THREE.MeshPhongMaterial({color:0x00ff00}));
		this._physijs.collision_flags = LGE.ENTITIES.Entity.CF_STATIC_OBJECT;
		var t=this;
		this.bind("mouseover",function(){
			t.onMouseOver();
		});
		this.bind("mouseout",function(){
			t.onMouseOut();
		});
		this.bind("mouseup",function(){
			t.onClick();
		});
		this.bind("update",function(){
			t.update.call(t,arguments);
		});
	}
	,onMouseOver:function(){
		this.material.color.setHex(0xff0000);
		if(this.animation){
			this.animation.stop(true);
		}
		this.proxy = {
			rotationY: this.rotation.y
		}
		this.animation = new LGE.Animation(this.proxy,{rotationY:LGE.Math.deg2rad(90)},{duration:1000,ease:'easeOutBack'}).start();
	}
	,onMouseOut:function(){
		this.material.color.setHex(0x00ff00);
		if(this.animation){
			this.animation.stop(true);
		}
		this.proxy = {
			rotationY: this.rotation.y
		}
		this.animation = new LGE.Animation(this.proxy,{rotationY:0},{duration:500,ease:'easeOutBack'}).start();
	}
	,onClick:function(){
		this.material.color.setHex(0xffff00);
	}
	,update:function(){
		//needs a proxy object, since this update is called from a different thread
		if(this.animation){
			this.__dirtyRotation = true;
			this.__dirtyPosition = true;
			this.animation.update(Date.now());
			this.rotation.y = this.proxy.rotationY;
		}
	}
});



});