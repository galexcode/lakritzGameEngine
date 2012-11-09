/**
 *class		 Entity
 *package	 LGE.ENTITIES
 *file 		 entity.js
 */

LGE.ENTITIES = {};

LGE.ENTITIES.Entity = lakritz.makeClass(Physijs.Mesh,{
	constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(geometry, material, friction, rest, mass, physijsMeshClass){
		friction = friction||0;
		rest = rest||0;
		mass = mass||0;
		physijsMeshClass = physijsMeshClass||Physijs.BoxMesh;
		physijsMeshClass.prototype.constructor.call(this,geometry,Physijs.createMaterial(material,friction,rest),mass);
		
		//overwrite that physijs crap ;)
		this.addEventListener = this.bind;
		this.removeEventListener = this.unbind;
		this.dispatchEvent = this.trigger;
	}
},{
	//http://bulletphysics.com/Bullet/BulletFull/classbtCollisionObject.html
	CF_STATIC_OBJECT: 1, 
	CF_KINEMATIC_OBJECT: 2, 
	CF_NO_CONTACT_RESPONSE: 4, 
	CF_CUSTOM_MATERIAL_CALLBACK: 8, 
	CF_CHARACTER_OBJECT: 16, 
	CF_DISABLE_VISUALIZE_OBJECT: 32, 
	CF_DISABLE_SPU_COLLISION_PROCESSING: 64 
});