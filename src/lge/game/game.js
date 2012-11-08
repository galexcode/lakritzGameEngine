/**
 *class		 Game
 *package	 LGE
 *file 		 game.js
 */
LGE.Game = lakritz.Model.extend({
	width:720,
	height:405,
	widthBeforeFullScreen:0,
	heightBeforeFullScreen:0,
	aspect:16 / 9,
	el:null,
	renderer:null,
	screen:null,
	paused:false,
	debugGraph:true,
	debugGraphObject:null,
	updateRate:1000/60,
	renderRate:1000/60, //deprecated
	bypassRendering:false,
	lastUpdate:0,
	lastRender:0,
	inputProcessor:null,
	fullscreen:false,
	maximized:false,
	rendererParameters:{
		precision:"mediump",
		antialias:true,
		clearColor:0,
		clearAlpha:0,
		maxLights:100
	},
	init:function(container,options){
		console.log("lakritz game engine v"+LGE.VERSION);
		options = options||{};
		var t=this;
		if($(container).width()){
			this.width = $(container).innerWidth();
		}
		this.height = this.width * (1/this.aspect);
		if(lakritz.isObject(options.renderer)){
			$.extend(true,this.rendererParameters,options.renderer);
		}
		this.renderer = new THREE.WebGLRenderer(this.rendererParameter);
		this.renderer.setSize(this.width,this.height);
		this.el = $('<div />').css('position','relative').appendTo(container).append(this.renderer.domElement);

		//renderersize update on resize
		this.bind("resize",function(e){this.renderer.setSize(e.width,e.height);});
		this.setupFullScreenListener();

		//idle state
		$(window).focus(function(){
			t.bypassRendering = false;			
		}).blur(function(){
			t.bypassRendering = true;
		});
		
		this.setDebugGraph(this.debugGraph);
		this.renderLoop();
	},
	getDomElement:function(){
		return this.el[0];
	},
	setDomElement:function(el){
		this.el = $(el);
		return this;
	},
	setSize:function(width,height){
		this.width = width;
		this.height = height;
		this.setAspectRatio(width / height);
		this.trigger({name:"resize",width:width,height:height,aspect:this.aspect});
		return this;
	},
	getSize:function(){
		return {
			width:this.width,
			height:this.height
		}
	},
	getAspectRatio:function(){
		return this.aspect;
	},
	setAspectRatio:function(aspect){
		this.aspect = aspect;
		return this;
	},
	getScreen:function(){
		return this.screen;
	},
	setScreen:function(screen){
		if(this.screen !== screen){
			this.screen&&this.screen.trigger("hide");
		}else{
			return this;
		}
		if(this.screen){
			this.screen = screen;
			this.screen.trigger("show");
		}else{
			this.screen = screen;
			this.screen.trigger("show");
			if(this.renderer)
				this.renderLoop();
		}
		return this;
	},
	getRenderer:function(){
		return this.renderer;
	},
	setRenderer:function(renderer){
		if(this.renderer&&this.renderer!==renderer){
			$(this.renderer.domElement).detach();
		}
		this.renderer = renderer;
		if(renderer){
			this.el.prepend(renderer.domElement);
		}
		return this;
	},
	setDebugGraph:function(bool){
		if(!Stats){
			this.debugGraph = false;
			return this;
		}
		this.trigger({name:"debug",show:bool});
		if((this.debugGraph = bool) && !this.debugGraphObject){
			this.debugGraphObject = new Stats();
			$(this.debugGraphObject.domElement).css({
				'position':'absolute',
				'top':10,
				'left':10,
				'z-index':10
			}).appendTo(this.el);
		}else if(this.debugGraphObject){
			$(this.debugGraphObject.domElement).toggle(bool);
		}
	},
	getDebugGraph:function(){
		return this.debugGraph;
	},
	getInputProcessor:function(){
		if(!this.inputProcessor){
			this.setInputProcessor(new LGE.InputProcessor(this));
		}
		return this.inputProcessor;
	},
	setInputProcessor:function(processor){
		this.inputProcessor = processor;
		return this;
	},
	setPaused:function(paused){
		if(this.paused && !paused){
			this.paused = paused;
			this.renderLoop();
		}else{
			this.paused = paused;
		}
		this.trigger({name:"pause",paused:paused});
		return this;
	},
	getPaused:function(){
		return this.paused;
	},
	setupFullScreenListener:function(){
		var t=this;
		$(document).bind(fullScreenApi.fullScreenEventName,function(e){
			t.fullscreen = fullScreenApi.isFullScreen();
			if(t.fullscreen){
				t.el.css('position','absolute');
				t.setSize(window.innerWidth,window.innerHeight);
			}else{
				t.el.css('position','relative');
				t.setSize(
					t.widthBeforeFullScreen,
					t.heightBeforeFullScreen
				);
			}
		});
	},
	setFullScreen:function(fullscreen){
		if(!fullScreenApi.supportsFullScreen){
			fullscreen = false;
			this.setMaximized(fullscreen);
		}else{
			if(fullscreen && !this.fullscreen){
				this.widthBeforeFullScreen = this.width;
				this.heightBeforeFullScreen = this.height;				
				fullScreenApi.requestFullScreen(this.el[0]);
			}else if(this.fullscreen && !fullscreen){
				fullScreenApi.cancelFullScreen();
			}
		}
		return this;
	},
	getFullScreen:function(){
		return this.fullscreen;
	},
	setMaximized:function(maximize){
		if(this.maximized == maximize){
			return this;
		}
		this.maximized = maximize;
		if(maximize){
			this.widthBeforeFullScreen = this.width;
			this.heightBeforeFullScreen = this.height;	
			this.el.css({
				'position':'absolute',
				'top':0,
				'left':0
			});
			this.setSize($("html").innerWidth(),$("html").innerHeight());
			$(document.body).css('overflow','hidden');
		}else{
			this.el.css('position','relative');
			$(document.body).css('overflow','auto');
			this.setSize(
				this.widthBeforeFullScreen,
				this.heightBeforeFullScreen
			);
		}
		return this;
	},
	getMaximized:function(){
		return this.maximized;
	},
	renderLoop:function(){
		if(this.paused || !this.screen){
			return;
		}
		var t=this;
		window.setTimeout(function(){t.renderLoop();},this.updateRate);
		//window.requestAnimFrame(function(){t.renderLoop();});

		var tsUpdate = Date.now();
		if( tsUpdate - this.lastUpdate > this.updateRate){
			this.lastUpdate = tsUpdate;
			this.screen.update(tsUpdate);
		}
		this.debugGraphObject&&this.debugGraphObject.update();

		if(!this.bypassRendering)
			this.renderer.render(this.screen.scene,this.screen.camera);
	}
});