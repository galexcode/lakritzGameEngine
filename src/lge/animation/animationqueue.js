/**
 *class		 AnimationQueue
 *package	 LGE
 *file 		 animationqueue.js
 */
//TODO Reverse not usable yet! (initialValues need to be overwritten)
LGE.AnimationQueue = lakritz.Model.extend({
	animations:null
	,current:0
	,isrunning:false
	,lastdelta:0
	,isreverse:false
	,init:function(){this.animations = [];}
	,queue:function(animation){
		if(lakritz.isObject(animation)){
			var t=this;
			animation.bind("complete",function(){t.onAnimationComplete();});
			this.animations.push(animation);
		}else if(lakritz.isArray(animation) && animation.length){
			var t=this,animationIndex=animation.length,longestDuration=0,completeTarget=0;
			while(animationIndex--){
				if(longestDuration<animation[animationIndex]._options.duration + animation[animationIndex]._options.delay){
					longestDuration = animation[animationIndex]._options.duration + animation[animationIndex]._options.delay;
					completeTarget = animationIndex;
				}
			}
			animation[completeTarget].bind("complete",function(){t.onAnimationComplete();});
			this.animations.push(animation);
		}
			
		return this;
	}
	,delay:function(delay){
		delay = parseInt(delay);
		if(delay>0){
			var t=this;
			this.animations.push(new LGE.Timeout(function(){t.onAnimationComplete();},delay));
		}
		return this;
	}
	,onAnimationComplete:function(){
		if(this.isreverse){
			this.current--;
		}else{
			this.current++;
		}

		if((this.isreverse&&this.current<=0)||(!this.isreverse&&this.current>=this.animations.length)){
			this.stop(true);
		}else{
			var t=this;
			this.trigger("next");
			this.each(this.current,function(){
				if(this.updateStartValues)
					this.updateStartValues()
				this.start(t.isreverse);
			});
		}
	}
	,start:function(reverse){
		if(this.isrunning || !this.animations.length){
			return this;
		}
		this.reset();
		this.isrunning = true;
		this.lastdelta = Date.now();
		this.isreverse = reverse?true:false;
		this.current = this.isreverse?this.animations.length-1:0;
		var t=this;
		this.each(this.current,function(){
			this.start(t.isreverse);
		});
		this.trigger("start");
		return this;
	}
	,stop:function(dontSetFinalValues){
		if(!this.isrunning || !this.animations.length){
			return this;
		}
		this.isrunning = false;
		if(!dontSetFinalValues){
			this.end();
		}
		this.trigger("complete");
		return this;
	}
	,reset:function(){
		if(!this.animations.length)
			return this;
		for(var i=this.animations.length-1;i>=0;i--){
			this.each(i,function(){
				if(this.reset)
					this.reset();
			});
		}
		return this;
	}
	,end:function(){
		if(!this.animations.length)
			return this;
		for(var i=this.animations.length-1;i>=0;i--){
			this.each(i,function(){
				if(this.end)
					this.end();
			});
		}
		return this;
	}
	,updateStartValues:function(){
		for(var i=this.animations.length-1;i>=0;i--){
			this.each(i,function(){
				if(this.updateStartValues)
					this.updateStartValues();
			});
		}
		return this;
	}
	,update:function(delta){
		if(this.animations[this.current] && this.isrunning){
			this.each(this.current,function(){
				this.update(delta);
			});
		}
	},
	each:function(index,func){
		if(lakritz.isArray(this.animations[index])){
				var subAnim=this.animations[index].length;
				while(subAnim--){
					func.call(this.animations[index][subAnim]);
				}
		}else{
			func.call(this.animations[index]);
		}
	}
});