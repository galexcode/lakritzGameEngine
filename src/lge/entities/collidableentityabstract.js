LGE.ENTITIES.CollidableEntityAbstract = LGE.ENTITIES.MoveableEntity.extend({
	lastCollision:null
	,repel:.1
	,precision:.1
	,autoCollisionAgainst:null
	,init:function(velocity,friction,gravity,repel){
		LGE.ENTITIES.CollidableEntityAbstract.__super__.init.call(this,velocity,friction,gravity);
		this.repel = !isNaN(repel)?repel:.1;
	}
	//abstract
	,collides:function(collidableMeshList){
		return new LGE.ENTITIES.Collision;
	}
	/**
	* TODO if the change in Position is bigger than the actual mesh itself, collision detection fails on Planes, because the mesh practically teleports
	* from in front of the hittable object to in back of it. here needs to be some sort of exception if the Mesh should have hit, but didn't...
	*/
	,update:function(delta){
		var hitsGround=false;
		if(this.autoCollisionAgainst){
			this.collides(this.autoCollisionAgainst);
		}

		if(this.lastCollision && this.lastCollision.collides){
			//Collision on x axis			
			
			if
			(
				(this.velocity.x > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.bbr) &&
						(this.lastCollision.tbr&&this.lastCollision.bfr)
					)
				)
				||
				(this.velocity.x < 0 && 
					(
						(this.lastCollision.tfl&&this.lastCollision.bbl) &&
						(this.lastCollision.tbl&&this.lastCollision.bfl)
					)
				)
			){
				this.velocity.x *= this.repel * -1;
				this.velocity.y /= this.friction.y+1;
				this.velocity.z /= this.friction.z+1;
			}

			if
			(
				(this.velocity.y > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.tbl) &&
						(this.lastCollision.tfl&&this.lastCollision.tbr)
					)
				)
				||
				(this.velocity.y < 0 && 
					(
						(this.lastCollision.bfr&&this.lastCollision.bbl) &&
						(this.lastCollision.bfl&&this.lastCollision.bbr)
					)
				)
			){
				this.velocity.y *= this.repel * -1;
				this.velocity.x /= this.friction.x+1;
				this.velocity.z /= this.friction.z+1;
				hitsGround=true;
			}

			//Collision on z axis			
			if
			(
				(this.velocity.z > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.bfl) &&
						(this.lastCollision.tfl&&this.lastCollision.bfr)
					)
				)
				||
				(this.velocity.z < 0 && 
					(
						(this.lastCollision.tbl&&this.lastCollision.bbr) &&
						(this.lastCollision.tbr&&this.lastCollision.bbl)
					)
				)
			){
				this.velocity.z *= this.repel * -1;
				this.velocity.x /= this.friction.x+1;
				this.velocity.y /= this.friction.y+1;
			}
		}
		if(Math.abs(this.velocity.x)<this.precision){
			this.velocity.x = 0;
		}else if(this.velocity.x > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.x = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.x < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.x = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		if(Math.abs(this.velocity.y)<this.gravity+this.precision && hitsGround){
			this.velocity.y = 0;
		}else if(this.velocity.y > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.y = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.y < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.y = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		if(Math.abs(this.velocity.z)<this.precision){
			this.velocity.z = 0;
		}else if(this.velocity.z > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.z = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.z < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.z = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		this.position.addSelf(this.velocity);
		this.velocity.y -= this.gravity;
	}
},{
	defaultCollisionNear:0
	,defaultCollisionFar:Number.MAX_VALUE
});