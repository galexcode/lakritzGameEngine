var Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new CollisionScreen(this));
		this.setMaximized(true);
	}
});

var CollisionScreen = LGE.SceneInspectorScreen.extend({
	boxes:[]
	,collisionList:[]
	,halftime:0
	,show:function(){
		CollisionScreen.__super__.show.call(this);

		var roomMat, room = this.room = new THREE.Mesh(
			new THREE.CubeGeometry(1000,1000,1000)
			,(roomMat = new THREE.MeshLambertMaterial({color:0xffffff}))
		);

		room.position.y = 499;
		roomMat.side = THREE.BackSide;
		this.camera.position.y = 600;
		this.camera.position.z = 1500;
	
		this.scene.add(room);

		var light = new THREE.PointLight(0xffffff,.5);
		light.position.y = 900;
		//this.scene.add(light);
		var box;
		for(var i=0; i<100; i++){
			box = new LGE.ENTITIES.CollidableMeshEntity(
				new THREE.CubeGeometry(randRangeInt(80,100),randRangeInt(80,100),randRangeInt(80,100))
				,new THREE.MeshLambertMaterial({color:randRangeInt(0,0xffffff)})
				,new THREE.Vector3(randRange(-10,10),randRange(0,15),randRange(-10,10))
				,new THREE.Vector3(.005,.005,.005)
				,2
				,.3
			);
			box.position.y = 500;
			this.boxes.push(box);
			this.scene.add(box);
		}
		this.collisionList = [room];//this.boxes.concat([room]);
		var t=this;
		this.game.getInputProcessor().bind("keyup",function(e){
			if(e.key == this.keys.KEY_R){
				t.randomize();
			}
		});
		//this.camera.position = this.boxes[0].position;
	}
	,randomize:function(){
		var boxIndex = this.boxes.length;
		while(boxIndex--){
			this.randomizeBox(this.boxes[boxIndex]);
		}
	}
	,randomizeBox:function(box){
		box.position = new THREE.Vector3(0,500,0);
		box.velocity = new THREE.Vector3(randRange(-10,10),randRange(0,15),randRange(-10,10));
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

