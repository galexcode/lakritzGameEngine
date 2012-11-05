'use strict';
	
Physijs.scripts.worker = 'assets/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new PhysiTestScreen(this));
		//this.setMaximized(true);
	}
});

var PhysiTestScreen = LGE.Screen.extend({
	show:function(e){
		this.scene = new Physijs.Scene;
		
		this.camera = new THREE.PerspectiveCamera(50,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar);
		this.camera.position = new THREE.Vector3(2000,500,500);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera);
		var light = new THREE.DirectionalLight(0xffffff,3);
		this.scene.add(light);
		light.position.y = 300;
		light.position.z = 1000;
		light.target.position = new THREE.Vector3();
		light.castShadow=true;
		this.game.getRenderer().shadowMapEnabled = true;


		this.scene.setGravity(new THREE.Vector3(0,-2500,0));
		
		var t=this;
		this.scene.addEventListener("update",function(){
			t.scene.simulate(undefined, 2);
		});
		var wf = false;
		var ground = new Physijs.BoxMesh(new THREE.CubeGeometry(5000,10,5000), Physijs.createMaterial(
				new THREE.MeshPhongMaterial({color:0x553300,wireframe:wf})
				,1 //fric
				,.1 //rest
			)
			,0 //mass
		);
		//ground.rotation.x = deg2rad(-90);
		ground.position.y = -5;
		ground.receiveShadow=true;
		this.scene.add(ground);
		
		var wall = new Physijs.BoxMesh(new THREE.CubeGeometry(5000,100,10), Physijs.createMaterial(
				new THREE.MeshPhongMaterial({color:0x330000,wireframe:wf})
				,1 //fric
				,.1 //rest
			)
			,0 //mass
		);

		wall.position.y = 50;
		wall.position.z -= 300;
		wall.receiveShadow = true;
		wall.castShadow = true;
		ground.add(wall);

		var i=100,box,scene = this.scene, boxA=[];
		
		(function addBox(){
			if(!i--)
				return;
			box = new Physijs.BoxMesh(
				new THREE.CubeGeometry(50,20,50), 
				Physijs.createMaterial(
					new THREE.MeshPhongMaterial({color:randRangeInt(0,0x444444),wireframe:wf})
					,10 //fric
					,1 //rest
				)
				,1
			);
			box.position.y = 10 + Math.floor(i/2)*30;
			box.position.x = i%2?0:20;
			box.castShadow=true;
			box.addEventListener("ready",function(e){
				addBox();
			})
			boxA.push(box);
			scene.add(box);
		})();
		light.target.position = box.position;
		this.scene.simulate(0,2);
		
		//reset
		this.game.getInputProcessor().bind("keyup",function(e){
			if(e.key === this.keys.SPACE && !this.isPressed(this.keys.CTRL)){
				var i=boxA.length;
				while(i--){
					boxA[i].setLinearVelocity(new THREE.Vector3(
						i%2?0:20
						,10 + Math.floor(i/2)*30
						,0
					));
				}
			}
		});

		//collada
		var loader = new THREE.JSONLoader();
		loader.load( 'assets/models/tower/tower.dae', function ( geometry ) {
			scene.add(new THREE.Mesh(
				geometry
				,new THREE.MeshLambertMaterial({color:0x444444})
			));
		});
	}
});

