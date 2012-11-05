LGE.ENTITIES.POVCameraEntity = LGE.ENTITIES.MoveableEntity.extend({
	camera:null
	,cameraTrain:null
	,mouseSensitivity:1000
	,mouseLook:false
	,mouseInvertY:false
	,init:function(fov,aspect,near,far,mouseLook,velocity,friction){
		LGE.ENTITIES.MoveableEntity.prototype.init.call(this,velocity,friction);
		this.add(this.cameraTrain = new THREE.Object3D);
		this.setCamera(new THREE.PerspectiveCamera(fov,aspect,near,far));
		this.cameraTrain.add(this.camera);
		this.setMouseLook(mouseLook);
	}
	,getCameraTrain:function(){
		return this.cameraTrain;
	}
	,setCameraTrain:function(train){
		this.cameraTrain = train;
		return this;
	}
	,getCamera:function(){
		return this.camera;
	}
	,setCamera:function(camera){
		this.camera = camera;
		return this;
	}
	,translatePOV:function(v,addToVelocity){
		var headingX,headingY,headingZ,target=addToVelocity?this.velocity:this.position;
		if(v.x!==0){
			headingX=(LGE.Math.rad2deg(this.rotation.y)+90)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.x * Math.cos(headingX);
			target.x += v.x * Math.sin(headingX);
		}
		if(v.y!==0){
			headingY=LGE.Math.rad2deg(this.rotation.x)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.y * Math.cos(headingY);
			target.y += v.y * Math.sin(headingY);
		}
		if(v.z!==0){
			headingZ=LGE.Math.rad2deg(this.rotation.y)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.z * Math.cos(headingZ);
			target.x += v.z * Math.sin(headingZ);
		}
	}
	,movePOV:function(v){
		return this.translatePOV(v,true);
	}
	,rotatePOV:function(v){
		this.cameraTrain.rotation.x += v.x;
		this.cameraTrain.rotation.z += v.z;
		this.rotation.y += v.y;
		this.cameraTrain.rotation.x = this.cameraTrain.rotation.x%LGE.ENTITIES.POVCameraEntity.rad360;
		this.cameraTrain.rotation.z = this.cameraTrain.rotation.z%LGE.ENTITIES.POVCameraEntity.rad360;
		this.rotation.y = this.rotation.y%LGE.ENTITIES.POVCameraEntity.rad360;
	}
	,setMouseLook:function(b){
		var t=this, mousemoveCallback = function(e){
			t.rotatePOV(new THREE.Vector3(
				e.movementY/t.mouseSensitivity*(t.mouseInvertY?1:-1),
				e.movementX/t.mouseSensitivity*-1,
				0
			));
		};
		if(!this.mouseLook && b){
			pointerLockApi.bind("mousemove",mousemoveCallback);
		}else if(this.mouseLook && !b){
			pointerLockApi.unbind("mousemove",mousemoveCallback);
		}
		this.mouseLook = b;
		return this;
	}
	,getMouseLook:function(){
		return this.mouseLook;
	}
	,setMouseSensitivity:function(n){
		this.mouseSensitivity = n;
		return this;
	}
	,getMouseSensitivity:function(){
		return this.mouseSensitivity;
	}
	,setMouseInvertY:function(b){
		this.mouseInvertY = b;
		return this;
	}
	,getMouseInvertY:function(){
		return this.mouseInvertY;
	}
},{
	rad360:LGE.Math.deg2rad(360)
	,pi180:Math.PI/180
});