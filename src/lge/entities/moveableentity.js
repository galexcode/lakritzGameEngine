//deprecated
LGE.ENTITIES.MoveableEntity = LGE.ENTITIES.Entity.extend({
	velocity:null
	,friction:null
	,gravity:1
	,init:function(velocity,friction,gravity){
		LGE.ENTITIES.Entity.prototype.init.call(this);
		this.velocity = velocity||(new THREE.Vector3());
		this.friction = friction||(new THREE.Vector3(.5,.5,.5));
		this.gravity = !isNaN(gravity)?gravity:1;
	}
	,update:function(delta){
		this.position.addSelf(this.velocity);
		this.velocity.divideSelf({x:this.friction.x+1, y:this.friction.y+1, z:this.friction.z+1});
		this.velocity.y -= this.gravity;
	}
},{
	//TODO, doesnt really fix the collision problem, just sugar codes it
	maxVelocity:35
});
