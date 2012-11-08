/**
 *class		 InputProcessor
 *package	 LGE
 *file 		 inputprocessor.js
 */
LGE.InputProcessor = lakritz.Model.extend({
	game:null,
	keyboardFocus:false,
	keysPressed:[],
	projector:null,
	lastMouseX:0,
	lastMouseY:0,
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
			t.trigger({name:'mousemove',x:(t.lastMouseX = e.pageX-offset.left),y:(t.lastMouseY = e.pageY-offset.top)});
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
	//TODO
	//no no no... is no working -.-
	//not really sure if this works for local objects too...
	,isMouseOverObject:function(obj, camera, camPos, objPos){
		if(!this.projector){
			this.projector = new THREE.Projector();
		}

		camPos = camPos||camera.position;
		objPos = objPos||obj.position;
		var vector = new THREE.Vector3( this.lastMouseX, this.lastMouseY, 0.5 );
		this.projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );

		return ray.intersectObject(obj).length;
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