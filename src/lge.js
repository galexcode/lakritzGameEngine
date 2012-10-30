!function($,THREE,lakritz,undefined){

//FullscreenApi
var
    fullScreenApi = {
        supportsFullScreen: false,
        isFullScreen: function() { return false; },
        requestFullScreen: function() {},
        cancelFullScreen: function() {},
        fullScreenEventName: '',
        prefix: ''
    },
    browserPrefixes = 'webkit moz o ms khtml'.split(' ');

// check for native support
if (typeof document.cancelFullScreen != 'undefined') {
    fullScreenApi.supportsFullScreen = true;
} else {
    // check for fullscreen support by vendor prefix
    for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
        fullScreenApi.prefix = browserPrefixes[i];

        if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
            fullScreenApi.supportsFullScreen = true;
            break;
        }
    }
}

// update methods to do something useful
if (fullScreenApi.supportsFullScreen) {
    fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

    fullScreenApi.isFullScreen = function() {
        switch (this.prefix) {
            case '':
                return document.fullScreen;
            case 'webkit':
                return document.webkitIsFullScreen;
            default:
                return document[this.prefix + 'FullScreen'];
        }
    }
    fullScreenApi.requestFullScreen = function(el) {
        return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']($.browser.webkit?Element.ALLOW_KEYBOARD_INPUT:undefined);
    }
    fullScreenApi.cancelFullScreen = function(el) {
        return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
    }
}

// jQuery plugin
if (typeof jQuery != 'undefined') {
    jQuery.fn.requestFullScreen = function() {

        return this.each(function() {
            if (fullScreenApi.supportsFullScreen) {
                fullScreenApi.requestFullScreen(this);
            }
        });
    };
}

// export api
window.fullScreenApi = fullScreenApi;

// PointerLockApi
// todo, siehe: http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var pointerLockApi = (lakritz.Singleton.extend({
	supportsPointerLock:false,
	requestedElement:null,
	init:function(){
		this.supportsPointerLock = (
			'pointerLockElement' in document	||
			'mozPointerLockElement' in document ||
			'webkitPointerLockElement' in document 
		);
		
		var t=this,
		moveCallback = function(e){
			var x = (e.movementX!==undefined?e.movementX:
					e.mozMovementX!==undefined?e.mozMovementX:
					e.webkitMovementX!==undefined?e.webkitMovementX:
					0),
				y = (e.movementY!==undefined?e.movementY:
					e.mozMovementY!==undefined?e.mozMovementY:
					e.webkitMovementY!==undefined?e.webkitMovementY:
					0);
			t.trigger({name:"mousemove",movementX:x,movementY:y});
		},
		changeCallback = function(e){
			var locked = t.isPointerLocked();
			if(!t.requestedElement){
				return;
			}
			if(locked){
				t.requestedElement.addEventListener("mousemove",moveCallback,false);
			}else{
				t.requestedElement.removeEventListener("mousemove",moveCallback,false);
			}
			t.trigger({name:"pointerlockchange",islocked:locked});
		},
		errorCallback = function(){
			console.warn("could not lock pointer");
		};

		document.addEventListener('pointerlockchange', changeCallback, false);
		document.addEventListener('mozpointerlockchange', changeCallback, false);
		document.addEventListener('webkitpointerlockchange', changeCallback, false);

		document.addEventListener('pointerlockerror', errorCallback, false);
		document.addEventListener('mozpointerlockerror', errorCallback, false);
		document.addEventListener('webkitpointerlockerror', errorCallback, false);
	},
	isPointerLocked:function(){
		return (document.pointerLockElement === this.requestedElement ||
  				document.mozPointerLockElement === this.requestedElement ||
  				document.webkitPointerLockElement === this.requestedElement) && this.requestedElement!==null
	},
	requestPointerLock:function(el){
		this.requestedElement = el;
		el.requestPointerLock = el.requestPointerLock ||
			     el.mozRequestPointerLock ||
			     el.webkitRequestPointerLock;
		return el.requestPointerLock();
	},
	exitPointerLock:function(){
		return (document.exitPointerLock?document.exitPointerLock():
				document.mozExitPointerLock?document.mozExitPointerLock():
				document.webkitExitPointerLock?document.webkitExitPointerLock()
				:undefined);
	}
})).getInstance();

window.pointerLockApi = pointerLockApi;

//requestAnimationFrame shim
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.randRange = (function(){
	return 	window.random ||
			function(range,rangemax){
				if(!arguments.length){
					return Math.random();
				}else if(arguments.length==1){
					rangemax = range;
					range = 0;
				}
			return range + Math.random()*(rangemax-range);
			};
})();

window.randRangeInt = (function(){
	return window.randRangeInt ||
	function(){
		return parseInt(window.randRange.apply(null,arguments));
	}
})();

window.deg2rad = function(deg){
	return deg / 57.2957795;
}

window.rad2deg = function(rad){
	return rad * 57.2957795;
}

document.onselectstart = function() {
  return false;
};

var ctor = function(){};
var extendTHREEClass = function(parent,protoProps,staticProps){
	var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){lakritz.Model.apply(this,arguments);};
    }

    // Inherit class (static) properties from parent.
    $.extend(child, parent);

    // Create a legit extension of the parent with Object.create
    child.prototype = $.extend(Object.create(parent.prototype),lakritz.Model.prototype);

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) $.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) $.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = child.prototype.__super__ = parent.prototype;

    child.extend = parent.extend || function(protoProps,staticProps){
    	return extendTHREEClass(this,protoProps,staticProps);
    };
    return child;
}

var LGE = window.LGE = {
	VERSION:"0.0.02 pre-alpha"
};

//htmlLauncher
$(function(){
	$(document.body).find('[data-lge-object!=""]').each(function(){
		var el = $(this), args = el.data(), gameClass = args.lgeObject,obj;
		if(!window[gameClass]){
			return;
		}
		obj = new window[gameClass](el,args);
	});
})

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
		$(window).focus(function(){t.bypassRendering = false;}).blur(function(){t.bypassRendering = true;});
		
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

		if((this.bool = bool) && !this.debugGraphObject){
			this.debugGraphObject = new Stats();
			$(this.debugGraphObject.domElement).css({
				'position':'absolute',
				'top':10,
				'left':10,
				'z-index':10
			}).appendTo(this.el);
		}else{
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
		requestAnimFrame(function(){t.renderLoop();});

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

LGE.GameWidget = LGE.Game.extend({
	clearColor:null,
	useWidgetControls:true,
	usePointerLock:true,
	init:function(container){
		LGE.Game.prototype.init.call(this,container);
		var t=this;

		if(this.clearColor!==null)
			this.renderer.setClearColorHex( this.clearColor, 1 );
		
		this.getInputProcessor().bind("keyup",function(e){
			if(!t.useWidgetControls)
				return;
			switch(e.key){
				case LGE.InputProcessor.ESCAPE:
					this.trigger("blur");
				break;
				case LGE.InputProcessor.SPACE:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setPaused(!t.getPaused());
				break;
				case LGE.InputProcessor.BACKSPACE:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setMaximized(!t.getMaximized());
				break;
				case LGE.InputProcessor.ENTER:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setFullScreen(!t.getFullScreen());
				break;
			}
		}).bind("focus",function(){
			if(!t.usePointerLock)
				return;
			if(!pointerLockApi.isPointerLocked()){
				pointerLockApi.requestPointerLock(t.renderer.domElement);
			}
		}).bind("blur",function(){
			if(!t.usePointerLock)
				return;
			if(pointerLockApi.isPointerLocked() && pointerLockApi.requestedElement === t.renderer.domElement){
				pointerLockApi.exitPointerLock();
			}
		});
	}
});

LGE.Screen = lakritz.Model.extend({
	scene:null,
	camera:null,
	game:null,
	init:function(game){
		var t=this;
		t.setGame(game);
		game.bind("resize",function(e){t.resize(e);});
		this.bind("show",this.show);
		this.bind("hide",this.hide);
	},
	resize:function(e){
		if(this.camera){
			this.camera.aspect = e.aspect;
			this.camera.updateProjectionMatrix();
		}
	},
	update:function(){},
	show:function(){
		this.setScene(new THREE.Scene());
		this.setCamera(new THREE.PerspectiveCamera(
			45,
			this.game.getAspectRatio(),
			LGE.Screen.cameraDefaultNear,
			LGE.Screen.cameraDefaultFar
		));
		this.getScene().add(this.getCamera());
	},
	hide:function(){},
	destroy:function(){},
	getCamera:function(){
		return this.camera;
	},
	setCamera:function(camera){
		this.camera = camera;
		return this;
	},
	getScene:function(){
		return this.scene;
	},
	setScene:function(scene){
		this.scene = scene;
		return this;
	},
	getGame:function(){
		return this.game;
	},
	setGame:function(game){
		this.game = game;
		return this;
	}
},{
	cameraDefaultNear:.1,
	cameraDefaultFar:10000
});

//TODO focus für game.el abfragen
LGE.InputProcessor = lakritz.Model.extend({
	game:null,
	keyboardFocus:false,
	keysPressed:[],
	init:function(game){
		this.game = game;
		this.keys = LGE.InputProcessor;
		var t=this,offset=game.el.offset()||{left:0,top:0};

		this.bind("focus",function(){this.keyboardFocus=true;}).bind("blur",function(){this.keyboardFocus=false;});

		game.bind("resize",function(){
			offset = this.el.offset();
		});

		$(window).keydown(function(e){
			if(!t.keyboardFocus)
				return;
			e.stopPropagation();
			e.preventDefault();
			t.keysPressed[e.keyCode] = true;
			t.trigger({name:"keydown",key:e.keyCode});
		}).keyup(function(e){
			if(!t.keyboardFocus)
				return;
			e.stopPropagation();
			e.preventDefault();
			t.keysPressed[e.keyCode] = false;
			t.trigger({name:"keyup",key:e.keyCode});
		})

		$(this.game.getRenderer().domElement).mousedown(function(e){
			e.preventDefault();
			e.stopPropagation();
			
			if(!t.keyboardFocus){
				t.trigger("focus");
			}

			var button;
			switch(e.button){
				case 0:
					t.keysPressed[button = LGE.InputProcessor.MOUSE1]=true;
				break;
				case 1:
					t.keysPressed[button = LGE.InputProcessor.MOUSE3]=true;
				break;
				case 2:
					t.keysPressed[button = LGE.InputProcessor.MOUSE2]=true;
				break;
				default:
					button=-1;
			}
			t.trigger({name:'mousedown',button:button,x:e.pageX-offset.left,y:e.pageY-offset.top});
			return false;
		}).mousemove(function(e){
			e.preventDefault();
			e.stopPropagation();
			t.trigger({name:'mousemove',x:e.pageX-offset.left,y:e.pageY-offset.top});
		}).bind("contextmenu",function(e){
			e.preventDefault();
			e.stopPropagation();
			return false;
		});

		$(window).mouseup(function(e){
			e.preventDefault();
			e.stopPropagation();
			var button,target=e.target||e.srcElement;
			if(target !== t.game.getRenderer().domElement && t.keyboardFocus){
				t.trigger("blur");
			}	
			switch(e.button){
				case 0:
					t.keysPressed[button = LGE.InputProcessor.MOUSE1]=false;
				break;
				case 1:
					t.keysPressed[button = LGE.InputProcessor.MOUSE3]=false;
				break;
				case 2:
					t.keysPressed[button = LGE.InputProcessor.MOUSE2]=false;
				break;
				default:
					button=-1;
			}
			t.trigger({name:'mouseup',button:button,x:e.pageX-offset.left,y:e.pageY-offset.top});
		})
	}
	,isPressed:function(code){
		return !!(this.keysPressed[code]);
	}
},{
	MOUSE1:0
	,MOUSE2:1
	,MOUSE3:2
	,BACKSPACE:8
	,TAB:9
	,ENTER:13
	,SHIFT:16
	,CTRL:17
	,ALT:18
	,PAUSE:19
	,CAPSLOCK:20
	,ESCAPE:27
	,SPACE:32
	,PAGEUP:33
	,PAGEDOWN:34
	,END:35
	,HOME:36
	,ARROWLEFT:37
	,ARROWUP:38
	,ARROWRIGHT:39
	,ARROWDOWN:40
	,INSERT:45
	,DELETE:46
	,KEY_0:48
	,KEY_1:49
	,KEY_2:50
	,KEY_3:51
	,KEY_4:52
	,KEY_5:53
	,KEY_6:54
	,KEY_7:55
	,KEY_8:56
	,KEY_9:57
	,KEY_A:65
	,KEY_B:66
	,KEY_C:67
	,KEY_D:68
	,KEY_E:69
	,KEY_F:70
	,KEY_G:71
	,KEY_H:72
	,KEY_I:73
	,KEY_J:74
	,KEY_K:75
	,KEY_L:76
	,KEY_M:77
	,KEY_N:78
	,KEY_O:79
	,KEY_P:80
	,KEY_Q:81
	,KEY_R:82
	,KEY_S:83
	,KEY_T:84
	,KEY_U:85
	,KEY_V:86
	,KEY_W:87
	,KEY_X:88
	,KEY_Y:89
	,KEY_Z:90
	,NP_0:96
	,NP_1:97
	,NP_2:98
	,NP_3:99
	,NP_4:100
	,NP_5:101
	,NP_6:102
	,NP_7:103
	,NP_8:104
	,NP_9:105
	//TODO restliche tasten definieren, 
	//siehe: http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
});

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
		var t=this;
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
		for(prop in this._initialValues){
			this._target[prop] = this._isreverse?this._values[prop]:this._initialValues[prop];
		}
		return this;
	},
	end:function(){
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

LGE.ENTITIES = {};

LGE.ENTITIES.Entity = extendTHREEClass(THREE.Object3D,{
	init:function(){
		THREE.Object3D.prototype.constructor.call(this);
	}
});

LGE.ENTITIES.MoveableEntity = LGE.ENTITIES.Entity.extend({
	velocity:null
	,friction:null
	,gravity:1
	,init:function(velocity,friction,gravity){
		LGE.ENTITIES.Entity.prototype.init.call(this);
		this.velocity = velocity||(new THREE.Vector3());
		this.friction = friction||(new THREE.Vector3(.5,.5,.5));
		this.gravity = !isNaN(gravity)?gravity:1;
	}
	,update:function(delta){
		this.position.addSelf(this.velocity);
		this.velocity.divideSelf({x:this.friction.x+1, y:this.friction.y+1, z:this.friction.z+1});
		this.velocity.y -= this.gravity;
	}
},{
	//TODO, doesnt really fix the collision problem, just sugar codes it
	maxVelocity:35
});

LGE.ENTITIES.Collision = lakritz.Model.extend({
	tfl:false
	,tfr:false
	,tbl:false
	,tbr:false
	,bfl:false
	,bfr:false
	,bbl:false
	,bbr:false
	,collides:false
	,init:undefined
	,constructor:function(params){
		$.extend(this,params);
	}
});

LGE.ENTITIES.CollidableEntityAbstract = LGE.ENTITIES.MoveableEntity.extend({
	lastCollision:null
	,repel:.1
	,precision:.1
	,autoCollisionAgainst:null
	,init:function(velocity,friction,gravity,repel){
		LGE.ENTITIES.CollidableEntityAbstract.__super__.init.call(this,velocity,friction,gravity);
		this.repel = !isNaN(repel)?repel:.1;
	}
	//abstract
	,collides:function(collidableMeshList){
		return new LGE.ENTITIES.Collision;
	}
	/**
	* TODO if the change in Position is bigger than the actual mesh itself, collision detection fails on Planes, because the mesh practically teleports
	* from in front of the hittable object to in back of it. here needs to be some sort of exception if the Mesh should have hit, but didn't...
	*/
	,update:function(delta){
		var hitsGround=false;
		if(this.autoCollisionAgainst){
			this.collides(this.autoCollisionAgainst);
		}

		if(this.lastCollision && this.lastCollision.collides){
			//Collision on x axis			
			if
			(
				(this.velocity.x > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.bbr) &&
						(this.lastCollision.tbr&&this.lastCollision.bfr)
					)
				)
				||
				(this.velocity.x < 0 && 
					(
						(this.lastCollision.tfl&&this.lastCollision.bbl) &&
						(this.lastCollision.tbl&&this.lastCollision.bfl)
					)
				)
			){
				this.velocity.x *= this.repel * -1;
				this.velocity.y /= this.friction.y+1;
				this.velocity.z /= this.friction.z+1;
			}

			//Collision on y axis			
			if
			(
				(this.velocity.y > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.tbl) &&
						(this.lastCollision.tfl&&this.lastCollision.tbr)
					)
				)
				||
				(this.velocity.y < 0 && 
					(
						(this.lastCollision.bfr&&this.lastCollision.bbl) &&
						(this.lastCollision.bfl&&this.lastCollision.bbr)
					)
				)
			){
				this.velocity.y *= this.repel * -1;
				this.velocity.x /= this.friction.x+1;
				this.velocity.z /= this.friction.z+1;
				hitsGround=true;
			}

			//Collision on z axis			
			if
			(
				(this.velocity.z > 0 && 
					(
						(this.lastCollision.tfr&&this.lastCollision.bfl) &&
						(this.lastCollision.tfl&&this.lastCollision.bfr)
					)
				)
				||
				(this.velocity.z < 0 && 
					(
						(this.lastCollision.tbl&&this.lastCollision.bbr) &&
						(this.lastCollision.tbr&&this.lastCollision.bbl)
					)
				)
			){
				this.velocity.z *= this.repel * -1;
				this.velocity.x /= this.friction.x+1;
				this.velocity.y /= this.friction.y+1;
			}
		}
		if(Math.abs(this.velocity.x)<this.precision){
			this.velocity.x = 0;
		}else if(this.velocity.x > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.x = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.x < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.x = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		if(Math.abs(this.velocity.y)<this.gravity+this.precision && hitsGround){
			this.velocity.y = 0;
		}else if(this.velocity.y > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.y = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.y < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.y = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		if(Math.abs(this.velocity.z)<this.precision){
			this.velocity.z = 0;
		}else if(this.velocity.z > LGE.ENTITIES.MoveableEntity.maxVelocity){
			this.velocity.z = LGE.ENTITIES.MoveableEntity.maxVelocity;
		}else if(this.velocity.z < LGE.ENTITIES.MoveableEntity.maxVelocity *-1){
			this.velocity.z = LGE.ENTITIES.MoveableEntity.maxVelocity*-1;
		}
		this.position.addSelf(this.velocity);
		this.velocity.y -= this.gravity;
	}
},{
	defaultCollisionNear:0
	,defaultCollisionFar:Number.MAX_VALUE
});

LGE.ENTITIES.CollidableHitboxEntity = LGE.ENTITIES.CollidableEntityAbstract.extend({
	hitbox:null
	,hitboxVisible:false
	,hitboxColor:0
	,init:function(width,height,depth,velocity,friction,gravity,repel){
		LGE.ENTITIES.CollidableHitboxEntity.__super__.init.call(this,velocity,friction,gravity,repel);
		width = width||10;
		height= height||10;
		depth = depth||10;
		this.hitbox = new THREE.Mesh(
			new THREE.CubeGeometry(width,height,depth)
			,new THREE.MeshBasicMaterial({color:this.hitboxColor||(this.hitboxColor = randRangeInt(0,0xffffff)),wireframe:true})
		);
		this.setHitboxVisible(this.hitboxVisible);		
		this.add(this.hitbox);
	}
	,setHitboxVisible:function(b){
		this.hitboxVisible = this.hitbox.visible = b;
		return this;
	}
	,getHitboxVisible:function(){
		return this.hitboxVisible;
	}
	,collides:function(collidableMeshList){
		if(!this.hitbox){
			return new LGE.ENTITIES.Collision; 
		}

		var 
		originPoint = this.position.clone().addSelf(this.hitbox.position)
		,vertexIndex = this.hitbox.geometry.vertices.length
		,localVertex
		,globalVertex
		,directionVector
		,ray
		,collisions
		,hitdirections = new LGE.ENTITIES.Collision;
		while(vertexIndex--){
			localVertex = this.hitbox.geometry.vertices[vertexIndex].clone();
			globalVertex = this.matrix.multiplyVector3(localVertex).addSelf(this.hitbox.matrix.multiplyVector3(localVertex));
			directionVector = globalVertex.subSelf(originPoint);
			ray = new THREE.Ray(
				originPoint,directionVector.clone().normalize(),
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionNear,
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionFar 
			);
			collisions = ray.intersectObjects(collidableMeshList);
			if(collisions.length && collisions[0].distance < directionVector.length()){
				with(directionVector){
					if(x<0&&y>=0&&z>=0){// Vorne Links Oben Ray
						hitdirections.tfl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y>=0&&z>=0){ // Vorne Rechts Oben Ray
						hitdirections.tfr = true;
						hitdirections.collides = true;
					}else if(x<0&&y>=0&&z<0){ // Hinten Links Oben
						hitdirections.tbl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y>=0&&z<0){ // Hinten Rechts Oben
						hitdirections.tbr = true;
						hitdirections.collides = true;
					}else if(x<0&&y<0&&z>=0){ // Vorne Links Unten
						hitdirections.bfl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y<0&&z>=0){ // Vorne Rechts Unten
						hitdirections.bfr = true;
						hitdirections.collides = true;
					}else if(x<0&&y<0&&z<0){ // Hinten Links Unten
						hitdirections.bbl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y<0&&z<0){ // Hinten Rechts Unten
						hitdirections.bbr = true;
						hitdirections.collides = true;
					}
				}
			}		
		}
		if(this.hitboxVisible){
			if(hitdirections.collides){
				this.hitbox.material.color.setHex(0xff0000);
			}else{
				this.hitbox.material.color.setHex(this.hitboxColor);
			}
		}
		return (this.lastCollision = hitdirections);
	}
});

//Nasty extension hack, could be nicer, but works for now...
LGE.ENTITIES.CollidableMeshEntity = extendTHREEClass(THREE.Mesh,$.extend(Object.create(LGE.ENTITIES.CollidableEntityAbstract.prototype),{
	init:function(geometry,material,velocity,friction,gravity,repel){
		THREE.Mesh.call(this, geometry, material);
		LGE.ENTITIES.CollidableEntityAbstract.prototype.init.call(this, velocity, friction, gravity, repel);
	}
	,collides:function(collidableMeshList){
		var 
		originPoint = this.position.clone()
		,vertexIndex = this.geometry.vertices.length
		,localVertex
		,globalVertex
		,directionVector
		,ray
		,collisions
		,hitdirections = new LGE.ENTITIES.Collision;	
		while(vertexIndex--){
			localVertex = this.geometry.vertices[vertexIndex].clone();
			globalVertex = this.matrix.multiplyVector3(localVertex);
			directionVector = globalVertex.subSelf(this.position);
			ray = new THREE.Ray(
				originPoint,directionVector.clone().normalize(),
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionNear,
				LGE.ENTITIES.CollidableEntityAbstract.defaultCollisionFar 
			);
			collisions = ray.intersectObjects(collidableMeshList);
			if(collisions.length && collisions[0].distance < directionVector.length()){
				with(directionVector){
					if(x<0&&y>=0&&z>=0){// Vorne Links Oben Ray
						hitdirections.tfl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y>=0&&z>=0){ // Vorne Rechts Oben Ray
						hitdirections.tfr = true;
						hitdirections.collides = true;
					}else if(x<0&&y>=0&&z<0){ // Hinten Links Oben
						hitdirections.tbl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y>=0&&z<0){ // Hinten Rechts Oben
						hitdirections.tbr = true;
						hitdirections.collides = true;
					}else if(x<0&&y<0&&z>=0){ // Vorne Links Unten
						hitdirections.bfl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y<0&&z>=0){ // Vorne Rechts Unten
						hitdirections.bfr = true;
						hitdirections.collides = true;
					}else if(x<0&&y<0&&z<0){ // Hinten Links Unten
						hitdirections.bbl = true;
						hitdirections.collides = true;
					}else if(x>=0&&y<0&&z<0){ // Hinten Rechts Unten
						hitdirections.bbr = true;
						hitdirections.collides = true;
					}
				}
			}		
		}
		return (this.lastCollision = hitdirections);
	}
}));


LGE.ENTITIES.POVCameraEntity = LGE.ENTITIES.MoveableEntity.extend({
	camera:null
	,cameraTrain:null
	,mouseSensitivity:1000
	,mouseLook:false
	,mouseInvertY:false
	,init:function(fov,aspect,near,far,mouseLook,velocity,friction){
		LGE.ENTITIES.MoveableEntity.prototype.init.call(this,velocity,friction);
		this.add(this.cameraTrain = new THREE.Object3D);
		this.setCamera(new THREE.PerspectiveCamera(fov,aspect,near,far));
		this.cameraTrain.add(this.camera);
		this.setMouseLook(mouseLook);
	}
	,getCameraTrain:function(){
		return this.cameraTrain;
	}
	,setCameraTrain:function(train){
		this.cameraTrain = train;
		return this;
	}
	,getCamera:function(){
		return this.camera;
	}
	,setCamera:function(camera){
		this.camera = camera;
		return this;
	}
	,translatePOV:function(v,addToVelocity){
		var headingX,headingY,headingZ,target=addToVelocity?this.velocity:this.position;
		if(v.x!==0){
			headingX=(rad2deg(this.rotation.y)+90)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.x * Math.cos(headingX);
			target.x += v.x * Math.sin(headingX);
		}
		if(v.y!==0){
			headingY=rad2deg(this.rotation.x)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.y * Math.cos(headingY);
			target.y += v.y * Math.sin(headingY);
		}
		if(v.z!==0){
			headingZ=rad2deg(this.rotation.y)*LGE.ENTITIES.POVCameraEntity.pi180;
			target.z += v.z * Math.cos(headingZ);
			target.x += v.z * Math.sin(headingZ);
		}
	}
	,movePOV:function(v){
		return this.translatePOV(v,true);
	}
	,rotatePOV:function(v){
		this.cameraTrain.rotation.x += v.x;
		this.cameraTrain.rotation.z += v.z;
		this.rotation.y += v.y;
		this.cameraTrain.rotation.x = this.cameraTrain.rotation.x%LGE.ENTITIES.POVCameraEntity.rad360;
		this.cameraTrain.rotation.z = this.cameraTrain.rotation.z%LGE.ENTITIES.POVCameraEntity.rad360;
		this.rotation.y = this.rotation.y%LGE.ENTITIES.POVCameraEntity.rad360;
	}
	,setMouseLook:function(b){
		var t=this, mousemoveCallback = function(e){
			t.rotatePOV(new THREE.Vector3(
				e.movementY/t.mouseSensitivity*(t.mouseInvertY?1:-1),
				e.movementX/t.mouseSensitivity*-1,
				0
			));
		};
		if(!this.mouseLook && b){
			pointerLockApi.bind("mousemove",mousemoveCallback);
		}else if(this.mouseLook && !b){
			pointerLockApi.unbind("mousemove",mousemoveCallback);
		}
		this.mouseLook = b;
		return this;
	}
	,getMouseLook:function(){
		return this.mouseLook;
	}
	,setMouseSensitivity:function(n){
		this.mouseSensitivity = n;
		return this;
	}
	,getMouseSensitivity:function(){
		return this.mouseSensitivity;
	}
	,setMouseInvertY:function(b){
		this.mouseInvertY = b;
		return this;
	}
	,getMouseInvertY:function(){
		return this.mouseInvertY;
	}
},{
	rad360:deg2rad(360)
	,pi180:Math.PI/180
});

LGE.POVCameraController = lakritz.Model.extend({
	camera:null
	,object3D:null
	,mouseSensitivity:1000
	,mouseLook:false
	,mouseInvertY:false
	,init:function(fov,aspect,near,far,mouseLook){
		this.object3D = new THREE.Object3D;
		this.setCamera(new THREE.PerspectiveCamera(fov,aspect,near,far));
		this.object3D.add(this.getCamera());
		this.setMouseLook(mouseLook);
	}
	,getCamera:function(){
		return this.camera;
	}
	,setCamera:function(camera){
		this.camera = camera;
		return this;
	}
	,getObject3D:function(){
		return this.object3D;
	}
	,setObject3D:function(o3d){
		this.object3D = o3d;
		return this;
	}
	,movePOV:function(v){
		var headingX,headingY,headingZ;
		if(v.x!==0){
			headingX=(rad2deg(this.object3D.rotation.y)+90)*LGE.POVCameraController.pi180;
			this.object3D.position.z += v.x * Math.cos(headingX);
			this.object3D.position.x += v.x * Math.sin(headingX);
		}
		if(v.y!==0){
			//todo hier noch den winkel umrechnen!
			this.object3D.position.y += v.y;
		}
		if(v.z!==0){
			headingZ=rad2deg(this.object3D.rotation.y)*LGE.POVCameraController.pi180;
			this.object3D.position.z += v.z * Math.cos(headingZ);
			this.object3D.position.x += v.z * Math.sin(headingZ);
		}
	}
	,rotatePOV:function(v){
		this.camera.rotation.x += v.x;
		this.camera.rotation.z += v.z;
		this.object3D.rotation.y += v.y;

		this.camera.rotation.x = this.camera.rotation.x%LGE.POVCameraController.rad360;
		this.camera.rotation.z = this.camera.rotation.z%LGE.POVCameraController.rad360;
		this.object3D.rotation.y = this.object3D.rotation.y%LGE.POVCameraController.rad360;
	}
	,setMouseLook:function(b){
		var t=this, mousemoveCallback = function(e){
			t.rotatePOV(new THREE.Vector3(
				e.movementY/t.mouseSensitivity*(t.mouseInvertY?1:-1),
				e.movementX/t.mouseSensitivity*-1,
				0
			));
		};
		if(!this.mouseLook && b){
			pointerLockApi.bind("mousemove",mousemoveCallback);
		}else if(this.mouseLook && !b){
			pointerLockApi.unbind("mousemove",mousemoveCallback);
		}
		this.mouseLook = b;
		return this;
	}
	,getMouseLook:function(){
		return this.mouseLook;
	}
	,setMouseSensitivity:function(n){
		this.mouseSensitivity = n;
		return this;
	}
	,getMouseSensitivity:function(){
		return this.mouseSensitivity;
	}
	,setMouseInvertY:function(b){
		this.mouseInvertY = b;
		return this;
	}
	,getMouseInvertY:function(){
		return this.mouseInvertY;
	}
},{
	rad360:deg2rad(360)
	,pi180:Math.PI/180
});

LGE.SceneInspectorScreen = LGE.Screen.extend({
	areaSize:0
	,gridColor:0
	,bgColor:0
	,addGrid:true
	,addAxisCross:true
	,cameraController:null
	,cameraLookSpeed:[500,300]
	,cameraMoveSpeed:[10,2]
	,cameraLight:true
	,init:function(game,gridColor,bgColor,areaSize){
		LGE.Screen.prototype.init.call(this,game);
		this.gridColor = gridColor!==undefined?gridColor:0x333333;
		this.bgColor = bgColor!==undefined?bgColor:0xBBBBBB;
		this.areaSize=areaSize?areaSize:5000;
	}
	,show:function(){
		this.setScene(new THREE.Scene());
		if(this.addGrid)
			this.setupGroundGrid();
		if(this.addAxisCross)
			this.setupCoordCross();
		this.setupCamera();
		this.getGame().getRenderer().setClearColorHex( this.bgColor, 1 );
	}
	,setupGroundGrid:function(){
		var 
		material = new THREE.LineBasicMaterial({color:this.gridColor,opacity:.5})
		,geometry = new THREE.Geometry()
		,grid = new THREE.Line(geometry,material,THREE.LinePieces)
		,size = this.areaSize
		,step = 10;

		for(var i=-size; i<=size;i+=step){
			geometry.vertices.push(new THREE.Vector3(-size,0,i));
			geometry.vertices.push(new THREE.Vector3( size,0,i));

			geometry.vertices.push(new THREE.Vector3( i,0,-size));
			geometry.vertices.push(new THREE.Vector3( i,0,size));
		}

		this.getScene().add(grid);
	}
	,setupCoordCross:function(){
		var matX = new THREE.LineBasicMaterial({color:0xFF0000,opacity:1})
		,matY = new THREE.LineBasicMaterial({color:0x00FF00,opacity:1})
		,matZ = new THREE.LineBasicMaterial({color:0x0000FF,opacity:1})
		,geometryX = new THREE.Geometry()
		,geometryY = new THREE.Geometry()
		,geometryZ = new THREE.Geometry()
		,size = this.areaSize;

		geometryX.vertices.push(new THREE.Vector3(0,0,0));
		geometryX.vertices.push(new THREE.Vector3(size,0,0));

		geometryY.vertices.push(new THREE.Vector3(0,0,0));
		geometryY.vertices.push(new THREE.Vector3(0,size,0));

		geometryZ.vertices.push(new THREE.Vector3(0,0,0));
		geometryZ.vertices.push(new THREE.Vector3(0,0,size));

		this.scene.add(new THREE.Line(geometryX,matX,THREE.LinePieces));
		this.scene.add(new THREE.Line(geometryY,matY,THREE.LinePieces));
		this.scene.add(new THREE.Line(geometryZ,matZ,THREE.LinePieces));
	}
	,setupCamera:function(){
		var 
		t=this
		,startX
		,startY
		,fast=1
		,camlight
		,camController = this.cameraController = new LGE.POVCameraController(45,this.getGame().getAspectRatio(),.1,10000)
		;
		
		//Kameralicht
		if(this.cameraLight){
			camlight=new THREE.PointLight(0xffffff,1);
			camController.getObject3D().add(camlight);	
		}
		
		//Kamera registrieren
		this.getScene().add(camController.getObject3D());
		this.setCamera(camController.getCamera());

		//Auflösungsänderung abfangen
		this.getGame().bind("resize",function(e){
			camController.getCamera().aspect = e.aspect;
			camController.getCamera().updateProjectionMatrix();
		});

		//Steuerung und kamerabewegung
		this.getGame().getInputProcessor()
		.bind("keydown",function(e){
			if(e.key == LGE.InputProcessor.SHIFT){
				fast = 0;
			}
		})
		.bind("keyup",function(e){
			if(e.key == LGE.InputProcessor.SHIFT){
				fast = 1;
			}
		})
		.bind("mousedown",function(e){
			startX=e.x;
			startY=e.y;
		})
		.bind("mousemove",function(e){
			if(this.isPressed(LGE.InputProcessor.MOUSE1) && !this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.movePOV(new THREE.Vector3(
					(e.x - startX)/t.cameraMoveSpeed[fast]*-1,
					0,
					(e.y - startY)/t.cameraMoveSpeed[fast]*-1
				));
			}else if(this.isPressed(LGE.InputProcessor.MOUSE1) && this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.movePOV(new THREE.Vector3(
					0,
					(e.y - startY)/t.cameraMoveSpeed[fast],
					0
				));
			}else if(!this.isPressed(LGE.InputProcessor.MOUSE1) && this.isPressed(LGE.InputProcessor.MOUSE2)){
				camController.rotatePOV(new THREE.Vector3(
					(e.y - startY)/t.cameraLookSpeed[fast]*-1,
					(e.x - startX)/t.cameraLookSpeed[fast]*-1,
					0
				));
			}
			startX =e.x;
			startY =e.y;
		});

		//Kamera startposition
		camController.getObject3D().position.set(0,100,300);
		camController.rotatePOV(new THREE.Vector3(deg2rad(-25)));
	}
});


LGE.Assets = lakritz.Singleton.extend({
	add:function(name,file){
		if(lakritz.isObject(name)){
			$.extend(LGE.Assets.files,name);
		}else if(lakritz.isString(name) && lakritz.isString(file)){
			LGE.Assets.files[name] = file;
		}
		return this;
	},
	get:function(name){
		return LGE.Assets.files[name];
	}
},{
	files:{}
});

}(jQuery,THREE,lakritz);