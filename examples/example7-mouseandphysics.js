'use strict';
LGE.physiconf.worker = 'assets/js/physijs_worker.js';
LGE.load('assets/js/jquery-1.8.1.min.js;assets/js/three.min.js;assets/js/physi.js;assets/js/stats.min.js'.split(';'),
function(){
window.Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new PhysiTestScreen(this));
	}
});

var PhysiTestScreen = LGE.World.extend({
	physicsPrecision:1
	,boxes:null
	,show:function(e){
		this.camera = new THREE.PerspectiveCamera(50,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar);
		this.camera.position = new THREE.Vector3(500,500,2000);
		this.camera.lookAt(this.scene.position.clone().setY(300));
		this.game.getRenderer().setClearColorHex(0,1);
		this.scene.add(this.camera);
		this.scene.add(new THREE.PointLight(0x333333,1));
		this.scene.fog = new THREE.Fog(0x000000,0,3000);
		var light = new THREE.DirectionalLight(0xffffff,3);
		this.scene.add(light);
		light.position.y = 300;
		light.position.z = 1000;
		light.target.position = new THREE.Vector3();
		light.castShadow=true;
		this.game.getRenderer().shadowMapEnabled = true;

		this.setGravity(new THREE.Vector3(0,-100,0));

		var t=this;
		var wf = false;
		var ground = new LGE.ENTITIES.Entity(
			new THREE.CubeGeometry(5000,10,5000)
			,new THREE.MeshPhongMaterial({color:0x111111,wireframe:wf})
			,1 //fric
			,.3 //rest
			,0 //mass
		);
		//ground.rotation.x = deg2rad(-90);
		ground.position.y = -5;
		ground.receiveShadow=true;
		this.scene.add(ground);
		
		var tt = new testTrigger();
		tt.position.y = 250;
//		tt.position.x = 250;
//		tt.position.z = -250;
		tt.debug = true;
		this.scene.add(tt);

		/*var mousesphere = new THREE.Mesh(new THREE.SphereGeometry(25),new THREE.MeshBasicMaterial({color:0xffff00,wireframe:true}));
		this.scene.add(mousesphere);*/

		var mouse3d = new LGE.Mouse3D(this.game,this.getCamera()), mouseover=false;
		mouse3d.add(tt);
		var drag=false;
		tt.bind("mousedown",function(){
			drag=true;
			tt.material.color.setHex(0xff8800);
		});

		mouse3d.bind("mouseup",function(){
			drag=false;
			tt.material.color.setHex(0xffff00);
		});

		mouse3d.bind("mousemove",function(){
			if(!drag){
				return;
			}

			var direction=t.game.getInputProcessor().isPressed(LGE.InputProcessor.SHIFT)?"y":"z", pos=this.getPositionOnPoint(tt.position,direction);
			tt.position.set(
				pos.x
				,pos.y
				,pos.z
			)

			tt.__dirtyPosition = true;
		});
		tt.material.color.setHex(0xffff00);
		/*tt.bind("mouseout",function(){
			this.material.color.setHex(0x0000ff);
		});*/

		var i=100,box,scene = this.scene, boxA=this.boxes=new Array(), mat;
		
		(function addBox(){
			if(!i--)
				return;
			box = new boxParticle;
			
			box.position.y = 10 + Math.floor(i/2)*100;
			box.position.x = i%2?0:160;
			box.castShadow=true;
			box.addEventListener("ready",function(e){
				box.accelerate();
				addBox();
			})
			boxA.push(box);
			scene.add(box);
		})();
		box.name = "specialbox";
		tt.addCollisionListener("specialbox",function(o){
			console.log(o.name+" hit trigger");
		});

		this.setGravity(new THREE.Vector3(0,-2000,0));
		LGE.World.prototype.show.call(this,e);
	}
	,update:function(delta){
		if(this.boxes && this.boxes.length){
			var box = this.boxes.length;
			while(box--){
				if(Math.abs(this.boxes[box].position.x)>2000 || Math.abs(this.boxes[box].position.z)>2000 || Math.abs(this.boxes[box].position.z)>2000){
					//reset
					this.boxes[box].__dirtyPosition = true;
					this.boxes[box].position.set(0,250,0);
					this.boxes[box].accelerate();
				}
			}
		}
		LGE.World.prototype.update.call(this,delta);
	}
});

var boxParticle = LGE.ENTITIES.Entity.extend({
	init:function(){
		boxParticle.__super__.init.call(this,
			new THREE.CubeGeometry(randRangeInt(30,50),randRangeInt(30,50),randRangeInt(30,50))
			,new THREE.MeshPhongMaterial({color:0x66 << 16 | 0x33 << 8 | randRangeInt(0x00,0xff),specular:0xffffff,shinyness:1})
			//,new THREE.MeshPhongMaterial({color:0x999999,specular:0xeeeeee,shinyness:10})
			,10
			,.3
			,1
		);
		var t=this;
	}
	,accelerate:function(){
		var v = new THREE.Vector3(
			randRangeInt(-600,600)
			,randRangeInt(-250,500)
			,randRangeInt(-600,600)
		);
		this.scale.set(1,1,1);
		this.setLinearVelocity(v.multiplyScalar(2));
	}
});

var testTrigger = LGE.ENTITIES.Trigger.extend({
	init:function(){
		testTrigger.__super__.init.call(this,new THREE.SphereGeometry(200,25,25));
		this._physijs.collision_flags = 0;
	}
});



});