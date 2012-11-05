var Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new CollisionScreen(this));
	}
});


var CollisionScreen = LGE.SceneInspectorScreen.extend({
	boxes:[]
	,collisionList:[]
	,halftime:0
	,cameraLight:false
	,setupGroundGrid:function(){

	}
	,show:function(){
		CollisionScreen.__super__.show.call(this);

		var roomMat, room = this.room = new THREE.Mesh(
			new THREE.CubeGeometry(2000,1200,2000)
			,(roomMat = new THREE.MeshLambertMaterial({color:0xffffff}))
		);

		room.position.y = 599;
		roomMat.side = THREE.BackSide;
		this.camera.position.y = 600;
		this.camera.position.z = 1500;
	
		this.scene.add(room);

		var roomOuter =  new THREE.Mesh(
			new THREE.CubeGeometry(5000,300,5000)
			,roomMat.clone()
		);

		roomOuter.position.y = -150;
		room.receiveShadow = true;
		roomOuter.receiveShadow = true;
		this.game.getRenderer().shadowMapEnabled = true;
		this.scene.add(roomOuter);

		var light = new THREE.SpotLight(0xffffff,1.5);
		light.position.y = 400;
		light.position.z = 1000;
		light.position.x = 1000;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;
		light.shadowCameraFov = 90;
		light.castShadow = true;
		this.scene.add(light);


		var light = new THREE.PointLight(0xeeaa99,.5);
		light.position.y = 400;
		light.position.z = 500;
		light.position.x = 500;
		this.scene.add(light);

		var box;
		for(var i=0; i<100; i++){
			box = new LGE.ENTITIES.CollidableMeshEntity(
				new THREE.CubeGeometry(randRangeInt(80,150),randRangeInt(80,150),randRangeInt(80,150))
				,new THREE.MeshLambertMaterial({color:randRangeInt(0,0xffffff)})
				,new THREE.Vector3(randRange(-100,100),randRange(0,100),randRange(-100,100))
				,new THREE.Vector3(.5,.5,.5)
				,.7
				,randRange(.05,.5)
			);
			box.receiveShadow = true;
			box.castShadow = true;
			box.position = new THREE.Vector3(randRangeInt(-500,500), 500, randRangeInt(-500,500))
			//box.rotation = new THREE.Vector3(randRange(0,Math.PI/2), randRange(0,Math.PI/2), randRange(0,Math.PI/2))
			this.boxes.push(box);
			this.scene.add(box);
		}
		this.collisionList = [room];
		//this.collisionList = this.boxes.concat([room,roomOuter]);
		var t=this;
		this.game.getInputProcessor().bind("keyup",function(e){
			if(e.key == this.keys.KEY_R){
				t.randomize();
			}
		});
	}
	,randomize:function(){
		var boxIndex = this.boxes.length;
		while(boxIndex--){
			this.randomizeBox(this.boxes[boxIndex]);
		}
	}
	,randomizeBox:function(box){
		box.position = new THREE.Vector3(randRangeInt(-500,500), 500, randRangeInt(-500,500));
		box.velocity = new THREE.Vector3(randRange(-100,100),randRange(0,100),randRange(-100,100));
	}
	,update:function(delta){
		var boxIndex = this.boxes.length, t=this;
		while(boxIndex--){
			this.boxes[boxIndex].collides(this.collisionList);
			this.boxes[boxIndex].update(delta);
			
			/*with(this.boxes[boxIndex].velocity){
				if(!boxIndex)
					console.log(x,y,z);
				if(!x&&!y&&!z){
					t.randomizeBox(t.boxes[boxIndex]);
				}
			}*/
		}
	}
});

var CollisionScreen2 = LGE.SceneInspectorScreen.extend({
	show:function(e){
		LGE.SceneInspectorScreen.prototype.show.call(this,e);

		var ground = this.ground = new THREE.Mesh(new THREE.CubeGeometry(5000,10,5000),new THREE.MeshPhongMaterial({color:0xffffff}));
		ground.position.y = -10;
		this.scene.add(ground);

		this.scene.add(this.hb = new LGE.ENTITIES.CollidableHitboxEntity(50,50,50));
		this.hb.position = new THREE.Vector3(0,100,0);
		this.hb.gravity = .1;
		this.hb.velocity.x = .5;
		this.hb.setHitboxVisible(true);
		var t=this, s = new THREE.Mesh(
			new THREE.SphereGeometry(25,64,64)
			,new THREE.MeshPhongMaterial()
		);
		this.hb.add(s);
	}
	,update:function(delta){
		this.hb.collides([this.ground])
		this.hb.update(delta);
	}
});