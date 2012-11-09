/**
 *class		 Screen
 *package	 LGE
 *file 		 screen.js
 */
LGE.Screen = lakritz.Model.extend({
	scene:null,
	camera:null,
	game:null,
	init:function(game){
		var t=this;
		t.setGame(game);
		game.bind("resize",function(e){t.resize(e);});
		this.bind("show",this.show);
		this.bind("hide",this.hide);
		this.setupScene();
	},
	resize:function(e){
		if(this.camera){
			this.camera.aspect = e.aspect;
			this.camera.updateProjectionMatrix();
		}
	},
	update:function(delta){
		if(this.scene && this.scene.children.length){
			var child = this.scene.children.length;
			while(child--){
				if(this.scene.children[child].trigger){
					this.scene.children[child].trigger("update",delta);
				}
			}
		}
	},
	setupScene:function(){
		this.setScene(new THREE.Scene());
		this.setCamera(new THREE.PerspectiveCamera(
			45,
			this.game.getAspectRatio(),
			LGE.Screen.cameraDefaultNear,
			LGE.Screen.cameraDefaultFar
		));
		this.getScene().add(this.getCamera());
	},
	show:function(e){
		this.visible = true;
	},
	hide:function(e){
		this.visible = false;
	},
	destroy:function(e){

	},
	getCamera:function(){
		return this.camera;
	},
	setCamera:function(camera){
		this.camera = camera;
		return this;
	},
	getScene:function(){
		return this.scene;
	},
	setScene:function(scene){
		this.scene = scene;
		return this;
	},
	getGame:function(){
		return this.game;
	},
	setGame:function(game){
		this.game = game;
		return this;
	}
},{
	cameraDefaultNear:.1,
	cameraDefaultFar:10000
});