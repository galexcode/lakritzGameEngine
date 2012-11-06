//deprecated
LGE.ENTITIES.CollidableHitboxEntity = LGE.ENTITIES.CollidableEntityAbstract.extend({
	hitbox:null
	,hitboxVisible:false
	,hitboxColor:0
	,init:function(width,height,depth,velocity,friction,gravity,repel){
		LGE.ENTITIES.CollidableHitboxEntity.__super__.init.call(this,velocity,friction,gravity,repel);
		width = width||10;
		height= height||10;
		depth = depth||10;
		this.hitbox = new THREE.Mesh(
			new THREE.CubeGeometry(width,height,depth)
			,new THREE.MeshBasicMaterial({color:this.hitboxColor||(this.hitboxColor = LGE.Math.randRangeInt(0,0xffffff)),wireframe:true})
		);
		this.setHitboxVisible(this.hitboxVisible);		
		this.add(this.hitbox);
	}
	,setHitboxVisible:function(b){
		this.hitboxVisible = this.hitbox.visible = b;
		return this;
	}
	,getHitboxVisible:function(){
		return this.hitboxVisible;
	}
	,collides:function(collidableMeshList){
		if(!this.hitbox){
			return new LGE.ENTITIES.Collision; 
		}

		var 
		originPoint = this.position.clone().addSelf(this.hitbox.position)
		,vertexIndex = this.hitbox.geometry.vertices.length
		,localVertex
		,globalVertex
		,directionVector
		,ray
		,collisions
		,hitdirections = new LGE.ENTITIES.Collision;
		while(vertexIndex--){
			localVertex = this.hitbox.geometry.vertices[vertexIndex].clone();
			globalVertex = this.matrix.multiplyVector3(localVertex).addSelf(this.hitbox.matrix.multiplyVector3(localVertex));
			directionVector = globalVertex.subSelf(originPoint);
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
		if(this.hitboxVisible){
			if(hitdirections.collides){
				this.hitbox.material.color.setHex(0xff0000);
			}else{
				this.hitbox.material.color.setHex(this.hitboxColor);
			}
		}
		return (this.lastCollision = hitdirections);
	}
});