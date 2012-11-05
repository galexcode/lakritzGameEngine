//Nasty extension hack, could be nicer, but works for now...
LGE.ENTITIES.CollidableMeshEntity = extendTHREEClass(THREE.Mesh,$.extend(Object.create(LGE.ENTITIES.CollidableEntityAbstract.prototype),{
	init:function(geometry,material,velocity,friction,gravity,repel){
		THREE.Mesh.call(this, geometry, material);
		LGE.ENTITIES.CollidableEntityAbstract.prototype.init.call(this, velocity, friction, gravity, repel);
	}
	,collides:function(collidableMeshList){
		var 
		originPoint = this.position.clone()
		,vertexIndex = this.geometry.vertices.length
		,localVertex
		,globalVertex
		,directionVector
		,ray
		,collisions
		,hitdirections = new LGE.ENTITIES.Collision;	
		while(vertexIndex--){
			localVertex = this.geometry.vertices[vertexIndex].clone();
			globalVertex = this.matrix.multiplyVector3(localVertex);
			directionVector = globalVertex.subSelf(this.position);
			ray = new THREE.Ray(
				originPoint,directionVector.clone().normalize(),
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionNear,
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionFar 
			);
			collisions = ray.intersectObjects(collidableMeshList);
			if(collisions.length && collisions[0].distance < directionVector.length()){
				
				if(directionVector.x<0&&directionVector.y>=0&&directionVector.z>=0){// Vorne Links Oben Ray
					hitdirections.tfl = true;
					hitdirections.collides = true;
				}else if(directionVector.x>=0&&directionVector.y>=0&&directionVector.z>=0){ // Vorne Rechts Oben Ray
					hitdirections.tfr = true;
					hitdirections.collides = true;
				}else if(directionVector.x<0&&directionVector.y>=0&&directionVector.z<0){ // Hinten Links Oben
					hitdirections.tbl = true;
					hitdirections.collides = true;
				}else if(directionVector.x>=0&&directionVector.y>=0&&directionVector.z<0){ // Hinten Rechts Oben
					hitdirections.tbr = true;
					hitdirections.collides = true;
				}else if(directionVector.x<0&&directionVector.y<0&&directionVector.z>=0){ // Vorne Links Unten
					hitdirections.bfl = true;
					hitdirections.collides = true;
				}else if(directionVector.x>=0&&directionVector.y<0&&directionVector.z>=0){ // Vorne Rechts Unten
					hitdirections.bfr = true;
					hitdirections.collides = true;
				}else if(directionVector.x<0&&directionVector.y<0&&directionVector.z<0){ // Hinten Links Unten
					hitdirections.bbl = true;
					hitdirections.collides = true;
				}else if(directionVector.x>=0&&directionVector.y<0&&directionVector.z<0){ // Hinten Rechts Unten
					hitdirections.bbr = true;
					hitdirections.collides = true;
				}
				
			}		
		}
		return (this.lastCollision = hitdirections);
	}
}));