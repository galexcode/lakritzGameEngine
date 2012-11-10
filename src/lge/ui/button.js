/**
 *class		 Button
 *package	 LGE.UI
 *file 		 button.js
 */

LGE.UI.Button = lakritz.makeClass(THREE.Mesh,{
	animations:null
	,label:null
	,state:0
	,geometry:null
	,material:null
	,constructor:function(label){
		var callInit=$.isFunction(this.init);	
		if(callInit){
			var initFunc = this.init;
			this.init = undefined;
			lakritz.Model.apply(this,arguments);
			this.init = initFunc;
		}else{
			lakritz.Model.apply(this,arguments);
		}

		this.animations = new LGE.AnimationManager;
		this.label = arguments[0] || "";
		this.state = 0;

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

		this.setState = function(state){
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
		};

		this.getState = function(){
			return this.state;
		};

		this.setStateAnimation = function(state, animation){
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

		this.getStateAnimation = function(state){
			return this.animations.getChildByName("state_"+state);
		}

		if(callInit)
			this.init.apply(this,arguments);
	}
},{
	STATE_DEFAULT:1
	,STATE_DISABLED:2
	,STATE_HOVER:4
	,STATE_PRESSED:8
	,STATE_FOCUS:16
});