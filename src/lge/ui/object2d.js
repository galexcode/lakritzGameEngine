/**
 *class		Object2D
 *package	 LGE.UI
 *file 		 object2d.js
 */
LGE.UI.Object2D = lakritz.Model.extend({
	visible:true
	,position:null
	,rotation:0
	,parent:null
	,stage:null
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(position,rotation){
		this.position = position || new THREE.Vector2(0,0);
		this.rotation = rotation || 0;
	}
	,draw:null
});