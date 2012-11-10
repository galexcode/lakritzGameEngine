/**
 *class		Button3D
 *package	 LGE.UI
 *file 		 button3d.js
 */

LGE.UI.Button3D = lakritz.makeClass(THREE.Mesh,{
	constructor:function(){
		LGE.UI.Button.apply(this,arguments);
	}
	,init:function(label,geometry,material){
		geometry = geometry || new THREE.CubeGeometry(100,50,10);
		material = material || new THREE.MeshBasicMaterial();
		THREE.Mesh.call(this,geometry, material);
	}
});