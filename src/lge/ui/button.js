/**
 *class		 Button
 *package	 LGE.UI
 *file 		 button.js
 */

LGE.UI = {};

LGE.UI.Button = lakritz.makeClass(THREE.Mesh,{
	animations:null
	,label:null
	,state:0
	,geometry:null
	,material:null
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(label,geometry,material){
		this.geometry = geometry || new THREE.CubeGeometry(100,50,10);
		this.material = material || new THREE.MeshBasicMaterial();
		THREE.Mesh.call(this,this.geometry, this.material);

		this.label = label||"";
		this.animations = new LGE.AnimationManager;

		this
		.bind("mouseover",function(){
			if(this.state === LGE.UI.Button.STATE_DISABLED)
				return;
			if((this.state&LGE.UI.Button.STATE_FOCUS)>0){
				this.setState(LGE.UI.Button.STATE_FOCUS|LGE.UI.Button.STATE_HOVER)
			}else{
				this.setState(LGE.UI.Button.STATE_HOVER)
			}
		})
		.bind("mouseout",function(){
			if(this.state === LGE.UI.Button.STATE_DISABLED)
				return;
			if((this.state&LGE.UI.Button.STATE_FOCUS)>0){
				this.setState(LGE.UI.Button.STATE_FOCUS)
			}else{
				this.setState(LGE.UI.Button.STATE_DEFAULT)
			}
		})
		.bind("mousedown",function(){
			if(this.state === LGE.UI.Button.STATE_DISABLED)
				return;	
			if((this.state&LGE.UI.Button.STATE_FOCUS)>0){
				this.setState(LGE.UI.Button.STATE_PRESSED|LGE.UI.Button.STATE_FOCUS)
			}else{
				this.setState(LGE.UI.Button.STATE_PRESSED)
			}
		})
		.bind("mouseup",function(){
			if(this.state === LGE.UI.Button.STATE_DISABLED)
				return;
			if((this.state&LGE.UI.Button.STATE_FOCUS)>0){
				this.setState(LGE.UI.Button.STATE_HOVER|LGE.UI.Button.STATE_FOCUS)
			}else{
				this.setState(LGE.UI.Button.STATE_HOVER)
			}
		})
		.bind("focus",function(){
			if(this.state == LGE.UI.Button.STATE_DISABLED)
				return;
			this.setState(LGE.UI.Button.STATE_FOCUS);
		})
		.bind("blur",function(){
			if(this.state == LGE.UI.Button.STATE_DISABLED)
				return;
			this.setState(LGE.UI.Button.STATE_DEFAULT);
		})
		.bind("update",function(delta){this.animations.update(delta)});

	}
	,setState:function(state){
		if(this.state != state){
			this.state = state;

			var anim = this.animations.children.length;
			while(anim--){
				var stateMap = parseInt(this.animations.children[anim].name.substr(6));
				if((stateMap&state)==0){
					this.animations.children[anim].stop(true);
				}else if(!this.animations.children[anim]._running && !this.animations.children[anim].isrunning){
					this.animations.children[anim].updateStartValues().start();
				}
			}

			this.trigger("statechange",state);
		}
		return this;
	}
	,getState:function(){
		return this.state;
	}
	,setStateAnimation:function(state, animation){
		var previousAnimation = this.animations.getChildByName("state_"+state);
		if(previousAnimation){
			this.animations.remove(previousAnimation);
			previousAnimation.name = undefined;
		}
		if(animation){
			animation.name = "state_"+state;
			this.animations.add(animation);
		}
		return this;
	}
	,getStateAnimation:function(state){
		return this.animations.getChildByName("state_"+state);
	}
},{
	STATE_DEFAULT:1
	,STATE_DISABLED:2
	,STATE_HOVER:4
	,STATE_PRESSED:8
	,STATE_FOCUS:16
});