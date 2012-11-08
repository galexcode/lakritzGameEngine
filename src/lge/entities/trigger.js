LGE.ENTITIES.Trigger = LGE.ENTITIES.Entity.extend({
	__collisionListeners:null,
	init:function(geometry,meshtype){
		LGE.ENTITIES.Entity.prototype.init.call(this,geometry,new THREE.MeshBasicMaterial({color:LGE.Math.randRangeInt(0,0xffffff),wireframe:true}),0,0,0,meshtype);
		this._physijs.collision_flags = LGE.ENTITIES.Entity.CF_NO_CONTACT_RESPONSE;
		this.__defineSetter__('debug',function(v){
			this.material.visible = v;
		});
		this.__defineGetter__('debug',function(){
			this.material.visible;
		});
		this.debug = false;
		
		this.__collisionListeners = [];

		var t=this;
		this.bind("collision",function(obj,vec1,vec2){
			t.onCollision(obj,vec1,vec2);
		});

	},
	addCollisionListener:function(target,callback){
		if(!LGE.typeof(callback) == "function"){
			return this;
		}
		this.__collisionListeners.push({target:target,callback:callback});
		return this;
	},
	removeCollisionListener:function(target,callback){
		var listener = this.__collisionListeners.length;
		while(listener--){
			if(this.__collisionListeners[listener].target===target && this.__collisionListeners[listener].callback===callback){
				this.__collisionListeners.splice(listener,1);
			}
		}
		return this;
	},
	onCollision:function(obj,vec1,vec2){
		var listener = this.__collisionListeners.length;
		while(listener--){
			switch(LGE.typeof(this.__collisionListeners[listener].target)){
				case "function":
					if(obj instanceof this.__collisionListeners[listener].target){
						this.__collisionListeners[listener].callback(obj,vec1,vec2);
					}
				break;
				case "object":
					if(obj === this.__collisionListeners[listener].target){
						this.__collisionListeners[listener].callback(obj,vec1,vec2);
					}
				break;
				case "number":
					if(obj._physijs.id === this.__collisionListeners[listener].target){
						this.__collisionListeners[listener].callback(obj,vec1,vec2);
					}
				break;
				case "string":
					if(obj.name === this.__collisionListeners[listener].target){
						this.__collisionListeners[listener].callback(obj,vec1,vec2);	
					}
				break;
			}
		}
	}
});