//TODO Reverse not usable yet! (initialValues need to be overwritten)
LGE.AnimationQueue = lakritz.Model.extend({
	animations:[]
	,current:0
	,isrunning:false
	,lastdelta:0
	,isreverse:false
	,queue:function(animation){
		if(lakritz.isObject(animation)){
			var t=this;
			animation.bind("complete",function(){t.onAnimationComplete();});
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
			this.stop();
		}else{
			this.trigger("next");
			this.animations[this.current].start(this.isreverse);
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
		this.animations[this.current].start(this.isreverse);
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
			if(this.animations[i].reset)
				this.animations[i].reset();
		}
		return this;
	}
	,end:function(){
		if(!this.animations.length)
			return this;
		for(var i=this.animations.length-1;i>=0;i--){
			if(this.animations[i].end)
				this.animations[i].end();
		}
		return this;
	}
	,update:function(delta){
		if(this.animations[this.current] && this.isrunning){
			this.animations[this.current].update(delta);
		}
	}
});