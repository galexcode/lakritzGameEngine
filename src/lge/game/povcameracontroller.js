//DEPRECATED
LGE.POVCameraController = lakritz.Model.extend({
	camera:null
	,object3D:null
	,mouseSensitivity:1000
	,mouseLook:false
	,mouseInvertY:false
	,init:function(fov,aspect,near,far,mouseLook){
		this.object3D = new THREE.Object3D;
		this.setCamera(new THREE.PerspectiveCamera(fov,aspect,near,far));
		this.object3D.add(this.getCamera());
		this.setMouseLook(mouseLook);
	}
	,getCamera:function(){
		return this.camera;
	}
	,setCamera:function(camera){
		this.camera = camera;
		return this;
	}
	,getObject3D:function(){
		return this.object3D;
	}
	,setObject3D:function(o3d){
		this.object3D = o3d;
		return this;
	}
	,movePOV:function(v){
		var headingX,headingY,headingZ;
		if(v.x!==0){
			headingX=(LGE.Math.rad2deg(this.object3D.rotation.y)+90)*LGE.POVCameraController.pi180;
			this.object3D.position.z += v.x * Math.cos(headingX);
			this.object3D.position.x += v.x * Math.sin(headingX);
		}
		if(v.y!==0){
			//todo hier noch den winkel umrechnen!
			this.object3D.position.y += v.y;
		}
		if(v.z!==0){
			headingZ=LGE.Math.rad2deg(this.object3D.rotation.y)*LGE.POVCameraController.pi180;
			this.object3D.position.z += v.z * Math.cos(headingZ);
			this.object3D.position.x += v.z * Math.sin(headingZ);
		}
	}
	,rotatePOV:function(v){
		this.camera.rotation.x += v.x;
		this.camera.rotation.z += v.z;
		this.object3D.rotation.y += v.y;

		this.camera.rotation.x = this.camera.rotation.x%LGE.POVCameraController.rad360;
		this.camera.rotation.z = this.camera.rotation.z%LGE.POVCameraController.rad360;
		this.object3D.rotation.y = this.object3D.rotation.y%LGE.POVCameraController.rad360;
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