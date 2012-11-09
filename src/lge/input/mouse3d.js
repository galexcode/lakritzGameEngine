/**
 *class		Mouse3D
 *package	 LGE
 *file 		 mouse3d.js
 */
LGE.Mouse3D = lakritz.Model.extend({
	game:null
	,camera:null
	,position:null
	,projector:null
	,targets:null
	,disabled:false
	,init:function(game,camera){
		this.game = game;
		this.camera = camera;
		this.position = new THREE.Vector3;
		this.projector = new THREE.Projector;
		this.targets = [];
		var t=this;
		this.game.getInputProcessor().bind("mousedown",function(){
			if(t.disabled)
				return;
			t.trigger({"name":"mousedown",position:t.position});
			t.childrenCheckMouseState("mousedown");
		}).bind("mouseup",function(e){
			if(t.disabled)
				return;
			t.trigger({"name":"mouseup",position:t.position});
			t.childrenCheckMouseState("mouseup");
		}).bind("mousemove",function(e){
			if(t.disabled)
				return;
			t.updatePosition(e.x,e.y);
			t.trigger({"name":"mousemove",position:t.position});
			t.childrenCheckMouseOver();
		});
	}
	,add:function(object){
		object.__hasMouse = false;
		this.targets.push(object);
		return this;
	}
	,remove:function(object){
		var index = this.target.indexOf(object);
		if(index > -1){
			object.__hasMouse = undefined;
			this.targets.splice(index,1);
		}
		return this;
	}
	,updatePosition:function(mx,my){
		// Find where mouse cursor intersects the target plane
		var vector = new THREE.Vector3(
			( mx / this.game.width ) * 2 - 1,
			-( ( my / this.game.height ) * 2 - 1 ),
			.5
		);
		this.projector.unprojectVector( vector, this.camera );
		vector.subSelf( this.camera.position ).normalize();
		this.position = vector;
	}
	,getPositionOnPoint:function(target,axis){
		axis = (axis=="y"?"z":(axis=="z"?"y":(axis!="x"?"z":axis)));
		var coefficient = ((target[axis] - this.camera.position[axis]) / this.position[axis]);
		return this.camera.position.clone().addSelf(this.position.clone().multiplyScalar(coefficient));
	}
	,getPositionAtDistance:function(dist){
		return this.camera.position.clone().addSelf(this.position.clone().multiplyScalar(dist));
	}
	,mouseOverObject:function(object){
		var pos = this.getPositionAtDistance(this.camera.position.distanceTo(object.position));
		if(pos.distanceTo(object.position)<=object.boundRadius * object.boundRadiusScale){
			return true;
		}
		return false;
	}
	,childrenCheckMouseOver:function(){
		var t=this,child = t.targets.length;
		while(child--){
			if(t.mouseOverObject(t.targets[child])){
				if(!t.targets[child].__hasMouse){
					t.targets[child].__hasMouse = true;
					if(t.targets[child].trigger){
						t.targets[child].trigger("mouseover");
					}
				}
			}else{
				if(t.targets[child].__hasMouse){
					t.targets[child].__hasMouse = false;
					if(t.targets[child].trigger){
						t.targets[child].trigger("mouseout");
					}
				}
			}
		}
	}
	,childrenCheckMouseState:function(state){
		var t=this,child = t.targets.length;
		while(child--){
			if(t.targets[child].__hasMouse){
				t.targets[child].trigger(state);
			}
		}
	}
});