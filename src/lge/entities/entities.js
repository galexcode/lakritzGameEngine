LGE.ENTITIES = {};

LGE.ENTITIES.Entity = extendTHREEClass(THREE.Object3D,{
	init:function(){
		THREE.Object3D.prototype.constructor.call(this);
	}
});