LGE.Animation = lakritz.Model.extend({
	_target:null,
	_values:null,
	_currentValues:null,
	_options:null,
	_initialValues:null,
	_startValues:null,
	_interval:null,
	_startTime:0,
	_ease:null,
	_running:false,
	_isreverse:false,
	_repeatCount:0,
	init:function(target,values,options){
		if(!target||!values){
			return;
		}
		var t=this,prop;
		this._target = target;
		this._values = values;
		this._initialValues = {};
		
		this._options = {
			duration:1000,
			ease:'linear',
			delay:0
		};

		for(prop in this._values){
			if(this._values.hasOwnProperty(prop)){
				this._initialValues[prop] = this._target[prop];
			}
		}

		if(lakritz.isObject(options)){
			for(prop in options){
				if(options.hasOwnProperty(prop)){
					this._options[prop] = options[prop];
				}
			}
		}
		
		this._ease = $.isFunction(this._options.ease)?this._options.ease:LGE.Animation.equations[this._options.ease];
		if(!$.isFunction(this._ease)){
			throw new Error("Ease is not a function");
		}
		if(options.autostart === true)
			this.start();
	},
	/**
 * starts the animation by creating a new interval, triggers animation:start
 * @returns {void}
 */
	start:function(isreverse,iteration){
		var t=this, prop;
		if(this._isreverse){
			this._isreverse = !isreverse;
		}else{
			this._isreverse = !!isreverse;
		}
		this._startTime = Date.now();
		this._running = true;
		this._repeatCount = iteration||0;
		this._startValues = {};
		for(prop in this._values){
			if(this._values.hasOwnProperty(prop)){
				this._startValues[prop] = this._target[prop];
			}
		}
		this.trigger('start');
		return this;
	},
/**
 * is called once per 1000/60 ms, and sets the new values to the target Object, which where provided by the easing function
 * @returns {void}
 */
	update:function(delta){
		if(!this._running){
			return;
		}
		var prop,wait=this._options.delay,time = delta - this._startTime;
		
		if(time < this._options.delay){
			return;
		}
		
		for(prop in this._values){
			this._target[prop] = this._ease(
				null,
				time-wait,
				this._isreverse?this._values[prop]:this._startValues[prop],
				this._isreverse?this._initialValues[prop]-this._startValues[prop]:this._values[prop]-this._startValues[prop],
				this._options.duration
			);
		}
		
		this.trigger({name:"tick",progress:(time-wait)/this._options.duration});
		
		if(time-wait>=this._options.duration){
			if(this._options.repeat){
				this._repeatCount +=1;
				if(this._options.repeat===true||this._repeatCount<this._options.repeat){
					this.reset();
					this.start(this._isreverse,this._repeatCount);
				}else{
					this.stop();
				}
			}else{
				this.stop();	
			}
		}
	},
/**
 * stops the current animation, triggers animation:complete
 * @returns {void}
 */
	stop:function(dontSetFinalValues){
		var prop;
		if(!this._running){
			return;
		}
		if(!dontSetFinalValues){
			this.end();
		}
		this._running = false;
		this.trigger('complete');
		return this;
	},
	reset:function(){
		var prop;
		for(prop in this._initialValues){
			this._target[prop] = this._isreverse?this._values[prop]:this._initialValues[prop];
		}
		return this;
	},
	end:function(){
		var prop;
		for(prop in this._values){
			this._target[prop] = this._isreverse?this._initialValues[prop]:this._values[prop];
		}
		return this;
	}
},{
	equations:{
		linear:function(x, t, b, c, d){
		return ((t/=d) * c) + b;
		}
	}
});