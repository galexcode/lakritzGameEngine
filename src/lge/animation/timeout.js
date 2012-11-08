/**
 *class		 Timeout
 *package	 LGE
 *file 		 timeout.js
 */
LGE.Timeout = lakritz.Model.extend({
	time:0,
	starttime:0,
	callback:null,
	isrunning:0,
	init:function(callback,delay){
		this.delay = parseInt(delay);
		this.callback = callback;
	},
	start:function(){
		this.isrunning = true;
		this.starttime = Date.now();
		return this;
	},
	update:function(delta){
		if(this.isrunning && this.starttime + this.delay < delta){
			this.isrunning=false;
			if(this.callback){
				this.callback();
			}
		}
	}
});