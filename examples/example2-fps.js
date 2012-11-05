var Example = LGE.GameWidget.extend({
	init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new MenuScreen(this));
	}
});

var MenuScreen = LGE.SceneInspectorScreen.extend({
	weaponZoomed:false,
	weaponZoomAnim:null,
	shooting:false,
	shootingAnim:null,
	isrunning:false,
	weaponswingAnim:null,
	runningAnim:null,
	moveSpeed:10,
	moveSpeedZoomed:7,
	setupCamera:function(){
		this.scene.add(this.cameraController = new LGE.ENTITIES.POVCameraEntity(50,this.game.getAspectRatio(),.1,5000,true));
		this.setCamera(this.cameraController.getCamera());
		/*var flashlight = new THREE.PointLight(0xeeffff,1);
		flashlight.position.y = 50;
		flashlight.rotation.x = -Math.PI/2;
		this.cameraController.getCameraTrain().add(flashlight);*/
		this.getCamera().position.y=100;
		this.runningAnim = new LGE.Animation(this.cameraController.getCameraTrain().position,{y:-50},{duration:200,ease:"easeInSine"})
		.bind("complete",function(){this.start(true);})
		.start();
	}
	,setupGroundGrid:function(){
		// ground
		var initColor = new THREE.Color( 0x00ff00 );
		initColor.setHSV( 0.25, 0.85, 0.5 );
		var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

		var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture, perPixel: true } );

		var groundTexture = THREE.ImageUtils.loadTexture( "assets/textures/grasslight-big.jpg", undefined, function() { groundMaterial.map = groundTexture } );
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set( 25, 25 );
		groundTexture.anisotropy = 16;

		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
		mesh.position.y = -250;
		mesh.rotation.x = - Math.PI / 2;
		mesh.receiveShadow = true;

		this.scene.add( mesh );

		var blockInitColor = new THREE.Color( 0x334433 );
		var blockInitTexture = THREE.ImageUtils.generateDataTexture( 1, 1, blockInitColor );
		var blockMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, map: blockInitTexture, perPixel: true });
		var someBlock = new THREE.Mesh(
			new THREE.CubeGeometry(500,2000,500)
			,blockMaterial
		)
		someBlock.position.y = 480;
		someBlock.castShadow = true;
		someBlock.receiveShadow = true;
		this.scene.add(someBlock);
		var blockTexture = THREE.ImageUtils.loadTexture( "assets/textures/alien-metal.jpg", undefined, function() { blockMaterial.map = blockTexture } );
		blockTexture.wrapS = blockTexture.wrapT = THREE.RepeatWrapping;
		blockTexture.repeat.set( 1, 1 );
		blockTexture.anisotropy = 16;

		this.game.getRenderer().shadowMapEnabled = true;
		var blockLight = new THREE.DirectionalLight(0xffeeaa,1);
		blockLight.castShadow = true;
		blockLight.position.y = 1100;
		blockLight.position.x = 2000;
		this.scene.add(blockLight);

		var blockLight2 = new THREE.DirectionalLight(0xaaeeff,1);
		blockLight2.castShadow = true;
		blockLight2.position.y = 900;
		blockLight2.position.z -= 2000;
		blockLight2.position.x = 2000;
		this.scene.add(blockLight2);

		var block2 = someBlock.clone();
		block2.position.z = 1000;
		block2.rotation.y = Math.PI/4;
		block2.receiveShadow = true;
		block2.castShadow = true;
		this.scene.add(block2);
	}
	,show:function(){
		LGE.SceneInspectorScreen.prototype.show.call(this);
		this.scene.add(new THREE.AmbientLight(0x002233));
		this.scene.fog = new THREE.Fog(0x002233,3000,5000);
		this.game.getRenderer().setClearColor(this.scene.fog.color);

		var t=this, sceneAddM4A1 = function(geometry){
			geometry.materials[0].shading = THREE.FlatShading;
			//geometry.materials[0].morphTargets = true;
			t.m4a1 = new THREE.Mesh(
				geometry,
				mat = new THREE.MeshPhongMaterial({color:0x111111,ambient:0x666666,specular:0xaaaaaa,shininess:20})//new THREE.MeshFaceMaterial()
			);

			//mat.wireframe = true;
			mat.side = THREE.DoubleSide;
			t.m4a1.scale.multiplyScalar(4);
			t.m4a1.rotation.y = deg2rad(180);
			t.m4a1.position.z = -45;
			t.m4a1.position.x = 25;
			t.m4a1.position.y = 50;
			t.m4a1.receiveShadow = true;
			t.cameraController.getCameraTrain().add(t.m4a1);
			t.game.getInputProcessor().bind("mouseup",function(e){
				if(e.button==LGE.InputProcessor.MOUSE2){
					t.weaponToggleZoom();
				}
				if(e.button==LGE.InputProcessor.MOUSE1){
					t.shooting=false;
				}
			}).bind("mousedown",function(e){
				if(e.button==LGE.InputProcessor.MOUSE1){
					t.shooting=true;
				}
			});

			t.shootingAnim = new LGE.Animation(t.m4a1.position,{z:-55},{duration:100,ease:"easeInCirc",repeat:true}).start();
			t.weaponswingAnim = new LGE.Animation(t.m4a1.position,{y:48,x:24},{duration:200,ease:"easeInOutQuad"})
			.bind("complete",function(){this.start(true);})
			.start();
		}

		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load('assets/models/m4a1SF.ForrestPL/m4a1SF.js',sceneAddM4A1);
	},
	weaponToggleZoom:function(){
		this[!this.weaponZoomed?"weaponZoomIn":"weaponZoomOut"]();
	},
	weaponZoomIn:function(){
		if(this.weaponZoomAnim){
			this.weaponZoomAnim.stop(true);
		}
		this.weaponZoomed = true;
		this.weaponZoomAnim = new LGE.Animation(this.m4a1.position,{x:0,y:55,z:-40},{duration:500,ease:"easeOutBack"}).start();
		this.camera.fov = 35;
		this.camera.updateProjectionMatrix();
	},
	weaponZoomOut:function(){
		if(this.weaponZoomAnim){
			this.weaponZoomAnim.stop(true);
		}
		this.weaponZoomed = false;
		this.weaponZoomAnim = new LGE.Animation(this.m4a1.position,{x:25,y:50,z:-45},{duration:500,ease:"easeOutBack"}).start();
		this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	},
	resize:function(e){
		LGE.Screen.prototype.resize.call(this,e);
	},
	hide:function(){

	},
	update:function(delta){
		var ip = this.game.getInputProcessor(), mVec = new THREE.Vector3(), s=this.weaponZoomed?this.moveSpeedZoomed:this.moveSpeed;
		if(this.animqueue){
			this.animqueue.update(delta);
		}

		this.isrunning = false;
		if(ip.isPressed(ip.keys.KEY_W)){
			mVec.z -= s;
			this.isrunning = true;
		}

		if(ip.isPressed(ip.keys.KEY_A)){
			mVec.x -= s;
			this.isrunning = true;	
		}

		if(ip.isPressed(ip.keys.KEY_S)){
			mVec.z += s;
			this.isrunning = true;
		}

		if(ip.isPressed(ip.keys.KEY_D)){
			mVec.x += s;
			this.isrunning = true;
		}

		this.cameraController.movePOV(mVec);
		this.cameraController.update(delta);

		if(this.weaponZoomAnim){
			this.weaponZoomAnim.update(delta);
		}

		if(this.shooting && this.shootingAnim){
			this.shootingAnim.update(delta);
		}

		if(this.runningAnim && this.isrunning){
			this.runningAnim.update(delta);
			if(!this.weaponZoomed&&this.weaponswingAnim){
				this.weaponswingAnim.update(delta);
			}
		}
	}
});