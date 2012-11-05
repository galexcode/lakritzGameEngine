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