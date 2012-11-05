LGE.SceneInspectorScreen = LGE.Screen.extend({
	areaSize:0
	,gridColor:0
	,bgColor:0
	,addGrid:true
	,addAxisCross:true
	,cameraController:null
	,cameraLookSpeed:[500,300]
	,cameraMoveSpeed:[10,2]
	,cameraLight:true
	,init:function(game,gridColor,bgColor,areaSize){
		LGE.Screen.prototype.init.call(this,game);
		this.gridColor = gridColor!==undefined?gridColor:0x333333;
		this.bgColor = bgColor!==undefined?bgColor:0xBBBBBB;
		this.areaSize=areaSize?areaSize:5000;
	}
	,show:function(){
		this.setScene(new THREE.Scene());
		if(this.addGrid)
			this.setupGroundGrid();
		if(this.addAxisCross)
			this.setupCoordCross();
		this.setupCamera();
		this.getGame().getRenderer().setClearColorHex( this.bgColor, 1 );
	}
	,setupGroundGrid:function(){
		var 
		material = new THREE.LineBasicMaterial({color:this.gridColor,opacity:.5})
		,geometry = new THREE.Geometry()
		,grid = new THREE.Line(geometry,material,THREE.LinePieces)
		,size = this.areaSize
		,step = 10;

		for(var i=-size; i<=size;i+=step){
			geometry.vertices.push(new THREE.Vector3(-size,0,i));
			geometry.vertices.push(new THREE.Vector3( size,0,i));

			geometry.vertices.push(new THREE.Vector3( i,0,-size));
			geometry.vertices.push(new THREE.Vector3( i,0,size));
		}

		this.getScene().add(grid);
	}
	,setupCoordCross:function(){
		var matX = new THREE.LineBasicMaterial({color:0xFF0000,opacity:1})
		,matY = new THREE.LineBasicMaterial({color:0x00FF00,opacity:1})
		,matZ = new THREE.LineBasicMaterial({color:0x0000FF,opacity:1})
		,geometryX = new THREE.Geometry()
		,geometryY = new THREE.Geometry()
		,geometryZ = new THREE.Geometry()
		,size = this.areaSize;

		geometryX.vertices.push(new THREE.Vector3(0,0,0));
		geometryX.vertices.push(new THREE.Vector3(size,0,0));

		geometryY.vertices.push(new THREE.Vector3(0,0,0));
		geometryY.vertices.push(new THREE.Vector3(0,size,0));

		geometryZ.vertices.push(new THREE.Vector3(0,0,0));
		geometryZ.vertices.push(new THREE.Vector3(0,0,size));

		this.scene.add(new THREE.Line(geometryX,matX,THREE.LinePieces));
		this.scene.add(new THREE.Line(geometryY,matY,THREE.LinePieces));
		this.scene.add(new THREE.Line(geometryZ,matZ,THREE.LinePieces));
	}
	,setupCamera:function(){
		var 
		t=this
		,startX
		,startY
		,fast=1
		,camlight
		,camController = this.cameraController = new LGE.POVCameraController(45,this.getGame().getAspectRatio(),.1,10000)
		;
		
		//Kameralicht
		if(this.cameraLight){
			camlight=new THREE.PointLight(0xffffff,1);
			camController.getObject3D().add(camlight);	
		}
		
		//Kamera registrieren
		this.getScene().add(camController.getObject3D());
		this.setCamera(camController.getCamera());

		//Auflösungsänderung abfangen
		this.getGame().bind("resize",function(e){
			camController.getCamera().aspect = e.aspect;
			camController.getCamera().updateProjectionMatrix();
		});

		//Steuerung und kamerabewegung
		this.getGame().getInputProcessor()
		.bind("keydown",function(e){
			if(e.key == LGE.InputProcessor.SHIFT){
				fast = 0;
			}
		})
		.bind("keyup",function(e){
			if(e.key == LGE.InputProcessor.SHIFT){
				fast = 1;
			}
		})
		.bind("mousedown",function(e){
			startX=e.x;
			startY=e.y;
		})
		.bind("mousemove",function(e){
			if(this.isPressed(LGE.InputProcessor.MOUSE1) && !this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.movePOV(new THREE.Vector3(
					(e.x - startX)/t.cameraMoveSpeed[fast]*-1,
					0,
					(e.y - startY)/t.cameraMoveSpeed[fast]*-1
				));
			}else if(this.isPressed(LGE.InputProcessor.MOUSE1) && this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.movePOV(new THREE.Vector3(
					0,
					(e.y - startY)/t.cameraMoveSpeed[fast],
					0
				));
			}else if(!this.isPressed(LGE.InputProcessor.MOUSE1) && this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.rotatePOV(new THREE.Vector3(
					(e.y - startY)/t.cameraLookSpeed[fast]*-1,
					(e.x - startX)/t.cameraLookSpeed[fast]*-1,
					0
				));
			}
			startX =e.x;
			startY =e.y;
		});

		//Kamera startposition
		camController.getObject3D().position.set(0,100,300);
		camController.rotatePOV(new THREE.Vector3(LGE.Math.deg2rad(-25)));
	}
});