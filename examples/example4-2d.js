var Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new TestWorld(this));
		//this.setMaximized(true);
	}
});

var World = LGE.Screen.extend({
	update:function(delta){
		var child;
		if(!this.scene || !(child = this.scene.children.length)){
			return
		}
		while(child--){
			if(this.scene.children[child].update){
				this.scene.children[child].update(delta);
			}
		}
	}
});



var TestWorld = World.extend({
	show:function(e){
		TestWorld.__super__.show.call(this,e);
		this.game.getRenderer().setClearColorHex(0,1);
		this.makeTerrain();
		this.insertPlayer();
	}
	,makeTerrain:function(){
		this.terrain = new THREE.Object3D();
		with(this.terrain){
			add(new THREE.Mesh(
				new THREE.CubeGeometry(1000,100,1000)
				,new THREE.MeshPhongMaterial({color:0x552211})
			))
			children[children.length - 1].position.y = -50;
			children[children.length - 1].position.z = -500;
			add(new THREE.Mesh(
				new THREE.CubeGeometry(10,100,1000)
				,new THREE.MeshPhongMaterial({color:0xaaaaaa})
			))
			children[children.length - 1].position.y = 50;
			children[children.length - 1].position.z = -500;
		}
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.terrain.position.y = 0;
		this.scene.add(this.terrain);
	}
	,insertPlayer:function(){
		this.scene.remove(this.camera);
		var player = new LGE.ENTITIES.CollidableMeshEntity(new THREE.CubeGeometry(20,35,10),new THREE.MeshBasicMaterial({color:0x00ff00}),null,null,.1,.5);
		player.add(this.camera);
		this.camera.position.z = 1000;
		player.position.y = 100;
		player.position.x = 10;
		player.position.z = -50;
		player.friction = new THREE.Vector3();
		player.autoCollisionAgainst = this.terrain.children;
		this.scene.add(player);

		//controls
		var movespeed=5,jumpadd=2;
		this.game.getInputProcessor().bind("keydown",function(e){
			switch(e.key){
				case this.keys.KEY_A:
					player.velocity.x = movespeed*-1;
				break;
				case this.keys.KEY_D:
					player.velocity.x = movespeed;
				break;
				case this.keys.KEY_W:
					player.velocity.y += jumpadd;
					jumpadd=0;
				break;
			}
		}).bind("keyup",function(e){
			switch(e.key){
				case this.keys.KEY_A:
				case this.keys.KEY_D:
					player.velocity.x = 0;
				break;
				case this.keys.KEY_W:
					jumpadd=2;
				break;
			}
		});
	}
});
