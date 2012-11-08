/**
 *class		 Entity
 *package	 LGE.ENTITIES
 *file 		 entity.js
 */

LGE.ENTITIES = {};

LGE.ENTITIES.Entity = extendTHREEClass(Physijs.Mesh,{
	init:function(mesh, material, friction, rest, mass, physijsMeshClass){
		friction = friction||0;
		rest = rest||0;
		mass = mass||0;
		physijsMeshClass = physijsMeshClass||Physijs.BoxMesh;
		physijsMeshClass.prototype.constructor.call(this,mesh,Physijs.createMaterial(material,friction,rest),mass);
		
		this.bind = this.addEventListener;
		this.unbind = this.removeEventlistener;
		this.trigger = this.dispatchEvent;
	}
});