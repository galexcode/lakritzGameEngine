var Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new W2DTest(this));
		//this.setMaximized(true);
	}
});

LGE.World2D = LGE.ENTITIES.Entity.extend({
	init:function(){
		LGE.World2D.__super__.init.call(this);
	},
	update:function(delta){
		var len = this.children.length;
		while(len--){
			if(this.children[len] instanceof LGE.ENTITIES.MoveableEntity){
				if(this.children[len] instanceof LGE.ENTITIES.CollidableEntity){
					this.children[len].checkCollision(this.children);
				}
				this.children[len].update(delta);
			}
		}
	}
});

LGE.Assets.getInstance().add({
	"vector-sky":"assets/textures/vector_sky.jpg"
});

var W2DTest = LGE.Screen.extend({
	world:null,
	show:function(){
		W2DTest.__super__.show.call(this);
		this.scene.add(this.world = new LGE.World2D());
		var initTexture = THREE.ImageUtils.generateDataTexture(1, 1, new THREE.Color(0x000000));
		var mapbg = new THREE.Mesh(new THREE.PlaneGeometry(10000,2000),new THREE.MeshBasicMaterial({color:0xffffff, map:initTexture}));
		mapbg.position.z = -10000;
		var skyTexture = THREE.ImageUtils.loadTexture( LGE.Assets.getInstance().get("vector-sky"), undefined, function(tex) { mapbg.material.map = tex; } );
		this.world.add(mapbg);
	},
	update:function(delta){
		var ip = this.game.getInputProcessor();
		if(ip.isPressed(ip.keys.ARROWUP)){
			this.camera.position.z -= 10;
		}

		if(ip.isPressed(ip.keys.ARROWDOWN)){
			this.camera.position.z += 10;
		}

		if(ip.isPressed(ip.keys.ARROWLEFT)){
			this.camera.position.x += 10;
		}

		if(ip.isPressed(ip.keys.ARROWRIGHT)){
			this.camera.position.x -= 10;
		}
	}
});