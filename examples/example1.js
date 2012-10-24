var Example = LGE.Game.extend({
	init:function(container){
		LGE.Game.prototype.init.call(this,container);
		var t=this;
		this.renderer.setClearColorHex( 0x000000, 1 );
		this.getInputProcessor().bind("keyup",function(e){
			switch(e.key){
				case LGE.InputProcessor.ESCAPE:
					this.trigger("blur");
				break;
				case LGE.InputProcessor.SPACE:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setPaused(!t.getPaused());
				break;
				case LGE.InputProcessor.ENTER:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setFullScreen(!t.getFullScreen());
				break;
			}
		}).bind("focus",function(){
			if(!pointerLockApi.isPointerLocked()){
				pointerLockApi.requestPointerLock(t.renderer.domElement);
			}
		}).bind("blur",function(){
			if(pointerLockApi.isPointerLocked() && pointerLockApi.requestedElement === t.renderer.domElement){
				pointerLockApi.exitPointerLock();
			}
		});

		this.setScreen(new FirstPersonScreen(this));
	}
});

var ExampleScreen = LGE.SceneInspectorScreen.extend({
	lucy:null
	,cameraLight:false
	,addGrid:false
	,init:function(game){
		LGE.SceneInspectorScreen.prototype.init.call(this,game,0x66eeff,0x000000);
		//LGE.Screen.prototype.init.call(this,game);
	}
	,show:function(){
		LGE.SceneInspectorScreen.prototype.show.call(this);

		//Schatten rendern Aktivieren
		var renderer = this.getGame().getRenderer();
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMapEnabled = true;

		var t=this,loader = new THREE.BinaryLoader(true);
		try{
			loader.load('assets/obj/lucy/Lucy100k_bin.js',function(geometry){
				t.createLucy(geometry);
			});	
		}catch(e){}

	}
	,createLucy:function(geometry){		
		this.lucy = new THREE.Mesh(
			geometry,
			new THREE.MeshPhongMaterial({color:0x030303,ambient:0x3333aa,specular:0xffaaaa,shininess:5})
		);
		this.lucy.scale.multiplyScalar(.1);
		this.lucy.position.set(100,129,100);
		this.lucy.receiveShadow=true;
		this.lucy.castShadow=true;
		this.getScene().add(this.lucy);
		this.cameraController.getObject3D().position.set(400,150,400);
		this.cameraController.rotatePOV(new THREE.Vector3(deg2rad(25),deg2rad(45),0));
		
		//walls
		var 
		wallmat = new THREE.MeshPhongMaterial({color:0x333333})
		,wallX = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)
		,wallY = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)
		,wallZ = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)

		wallmat.side = THREE.FrontSide;

		wallX.position.setX(100);
		wallX.position.setY(100);
		wallX.receiveShadow = true;
		
		wallY.rotation.setY(deg2rad(90));
		wallY.position.setY(100);
		wallY.position.setZ(100);
		wallY.receiveShadow = true;
		
		wallZ.rotation.setX(deg2rad(-90));
		wallZ.position.setX(100);
		wallZ.position.setZ(100);
		wallZ.receiveShadow = true;
		
		this.scene.add(wallX);
		this.scene.add(wallY);
		this.scene.add(wallZ);

		//podest

		var shadowObj = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),wallmat);
		shadowObj.position.set(100,25,100);
		shadowObj.receiveShadow = true;
		shadowObj.castShadow = true;
		this.scene.add(shadowObj);

		//Lichter

		var l = new THREE.SpotLight(0x6666ff,1.5,1000);
		l.castShadow = true;
		l.shadowMapWidth = 1024;
		l.shadowMapHeight = 1024;
		l.shadowMapDarkness = 0.95;
		l.shadowCameraFov = 60;
		l.shadowCameraVisible = true;
		l.position.set(300, 300, 100);
		this.getScene().add(l);

		l = new THREE.SpotLight(0xff6666,1.5,1000);
		l.castShadow = true;
		l.shadowMapWidth = 1024;
		l.shadowMapHeight = 1024;
		l.shadowMapDarkness = 0.95;
		l.shadowCameraFov = 60;
		l.shadowCameraVisible = true;
		l.position.set(100, 300, 300);
		this.getScene().add(l);


		this.animation = new LGE.Animation(l.position,{y:50,x:200,z:400},{duration:10000,ease:"easeInOutQuad"});
	}
	,update:function(delta){
		if(this.lucy)
			this.lucy.rotation.y = (this.lucy.rotation.y + .005)%deg2rad(360);
		if(this.animation)
			this.animation.update(delta);
	}
});

var FirstPersonScreen = LGE.Screen.extend({
	inputProcessor:null,
	playerEntity:null,
	show:function(){
		LGE.Screen.prototype.show.call(this);
		this.inputProcessor = this.game.getInputProcessor();
		this.setupPlayer();
		this.setupScene();
	},
	setupPlayer:function(){
		var t=this;
		this.playerEntity = new LGE.ENTITIES.POVCameraEntity(45,this.getGame().getAspectRatio(),.1,10000,true);
		this.playerEntity.position.y = 200;
		this.playerEntity.position.z = 200;
		this.playerEntity.friction.set(.3,0,.3);
		this.setCamera(this.playerEntity.getCamera());
		this.scene.add(this.playerEntity);
	},
	setupScene:function(){
		//Schatten rendern Aktivieren
		var renderer = this.getGame().getRenderer();
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMapEnabled = true;

		var t=this,loader = new THREE.BinaryLoader(true);
		try{
			loader.load('assets/obj/lucy/Lucy100k_bin.js',function(geometry){
				t.createLucy(geometry);
			});	
		}catch(e){}
	}
	,createLucy:function(geometry){		
		this.lucy = new THREE.Mesh(
			geometry,
			new THREE.MeshPhongMaterial({color:0x030303,ambient:0x3333aa,specular:0xffaaaa,shininess:5})
		);
		this.lucy.scale.multiplyScalar(.1);
		this.lucy.position.set(100,129,100);
		this.lucy.receiveShadow=true;
		this.lucy.castShadow=true;
		this.getScene().add(this.lucy);
		this.playerEntity.position.set(400,150,400);
		this.playerEntity.rotatePOV(new THREE.Vector3(deg2rad(25),deg2rad(45),0));
		
		//walls
		var 
		wallmat = new THREE.MeshPhongMaterial({color:0x333333})
		,wallX = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)
		,wallY = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)
		,wallZ = new THREE.Mesh(
			new THREE.PlaneGeometry(200,200),
			wallmat
		)

		wallmat.side = THREE.FrontSide;

		wallX.position.setX(100);
		wallX.position.setY(100);
		wallX.receiveShadow = true;
		
		wallY.rotation.setY(deg2rad(90));
		wallY.position.setY(100);
		wallY.position.setZ(100);
		wallY.receiveShadow = true;
		
		wallZ.rotation.setX(deg2rad(-90));
		wallZ.position.setX(100);
		wallZ.position.setZ(100);
		wallZ.receiveShadow = true;
		
		this.scene.add(wallX);
		this.scene.add(wallY);
		this.scene.add(wallZ);

		//podest

		var shadowObj = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),wallmat);
		shadowObj.position.set(100,25,100);
		shadowObj.receiveShadow = true;
		shadowObj.castShadow = true;
		this.scene.add(shadowObj);

		//Lichter

		var l = new THREE.SpotLight(0x6666ff,1.5,1000);
		l.castShadow = true;
		l.shadowMapWidth = 1024;
		l.shadowMapHeight = 1024;
		l.shadowMapDarkness = 0.95;
		l.shadowCameraFov = 60;
		l.shadowCameraVisible = true;
		l.position.set(300, 300, 100);
		this.getScene().add(l);

		l = new THREE.SpotLight(0xff6666,1.5,1000);
		l.castShadow = true;
		l.shadowMapWidth = 1024;
		l.shadowMapHeight = 1024;
		l.shadowMapDarkness = 0.95;
		l.shadowCameraFov = 60;
		l.shadowCameraVisible = true;
		l.position.set(100, 300, 300);
		this.getScene().add(l);


		this.animation = new LGE.Animation(l.position,{y:50,x:200,z:400},{duration:10000,ease:"easeInOutQuad"});
	}
	,update:function(delta){
		var move = new THREE.Vector3(),speed=3;
		if(this.inputProcessor.isPressed(LGE.InputProcessor.KEY_W)){
			move.z -= speed;
		}
		if(this.inputProcessor.isPressed(LGE.InputProcessor.KEY_S)){
			move.z += speed;
		}
		if(this.inputProcessor.isPressed(LGE.InputProcessor.KEY_A)){
			move.x -= speed;
		}
		if(this.inputProcessor.isPressed(LGE.InputProcessor.KEY_D)){
			move.x += speed;
		}
		if(this.inputProcessor.isPressed(LGE.InputProcessor.SPACE)){
			this.playerEntity.velocity.y += 10;
		}
		this.playerEntity.movePOV(move);
		this.playerEntity.update(delta);

		if(this.lucy)
			this.lucy.rotation.y = (this.lucy.rotation.y + .005)%deg2rad(360);
		if(this.animation)
			this.animation.update(delta);
	}
});