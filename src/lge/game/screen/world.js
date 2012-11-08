/**
 *class		 World
 *package	 LGE
 *file 		 world.js
 */

if(console && !Physijs){
	console.warn("Physijs not found!");
}

LGE.World = LGE.Screen.extend({
	physicsPrecision:1
	,physics:true
	,delta:undefined
	,debugGraph:false
	,debugGraphObject:null
	,init:function(game){
		LGE.World.__super__.init.call(this,game);
		this.scene = new Physijs.Scene;
		
		var t=this;
		this.scene.addEventListener("update",function(e){
			if(t.physics && (t.game && !t.game.paused))
				t.scene.simulate(t.delta,t.physicsPrecision);
			t.debugGraphObject&&t.debugGraphObject.update();
		});

		this.game.bind("pause",function(e){
			if(!e.paused){
				t.scene.simulate(t.delta,t.physicsPrecision);
			}
		});

		this.setDebugSimulationGraph(this.game.getDebugGraph());
		this.game.bind("debug",function(e){
			t.setDebugSimulationGraph(e.show);
		});

		this.setGravity(new THREE.Vector3(0,-1000,0));
	}
	,update:function(delta){
		//this.delta = delta;
		if(this.scene && this.scene.children.length){
			var child = this.scene.children.length;
			while(child--){
				if(this.scene.children[child] instanceof LGE.ENTITIES.Entity){
					this.scene.children[child].dispatchEvent("update");
				}
			}
		}
	}
	,show:function(e){
		this.visible = true;
		this.scene.simulate(this.delta,this.physicsPrecision);
	}
	,hide:function(e){
		this.visible = false;
	}
	,setGravity:function(g){
		this.scene.setGravity(g);
		return this;
	}
	,setDebugSimulationGraph:function(bool){
		if(!Stats){
			this.debugGraph = false;
			return this;
		}

		if((this.debugGraph = bool) && !this.debugGraphObject){
			this.debugGraphObject = new Stats();
			$(this.debugGraphObject.domElement).css({
				'position':'absolute',
				'top':60,
				'left':10,
				'z-index':10
			}).appendTo(this.game.el);
		}else if(this.debugGraphObject){
			$(this.debugGraphObject.domElement).toggle(bool);
		}
	}
	,getDebugSimulationGraph:function(){
		return this.debugGraph;
	}
});