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
	,scale:null	
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(position,rotation,scale){
		this.position = position || new THREE.Vector2(0,0);
		this.rotation = rotation || 0;
		this.scale = scale || new THREE.Vector2(1,1);
		
		var alpha = 1;
		this.__defineSetter__("alpha",function(a){
			alpha = a>1?1:(a<0?0:a);
		});

		this.__defineGetter__("alpha",function(a){
			return alpha;
		});	
	}
	,draw:null
});