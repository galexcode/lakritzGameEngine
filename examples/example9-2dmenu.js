'use strict';

var WebFontConfig = {
	google: { families: [ 'Audiowide::latin' ] }
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();


LGE.physiconf.worker = 'assets/js/physijs_worker.js';
LGE.load('assets/js/jquery-1.8.1.min.js;assets/js/three.min.js;assets/js/physi.js;assets/js/stats.min.js'.split(';'),
function(){
window.Example = LGE.GameWidget.extend({
	usePointerLock:false
	,init:function(container){
		LGE.GameWidget.prototype.init.call(this,container);
		this.setScreen(new MenuScreen(this));
	}
});

var MenuScreen = LGE.Screen.extend({
	setupScene:function(){
		MenuScreen.__super__.setupScene.call(this);
		this.setCamera(new THREE.PerspectiveCamera(65,this.game.getAspectRatio(),LGE.Screen.cameraDefaultNear,LGE.Screen.cameraDefaultFar));
		//this.setCamera(new THREE.OrthographicCamera(this.game.width/-2,this.game.height/2,this.game.width/2,this.game.height/-2,1,1000));
		this.scene.add(this.camera);
		
		this.scene.add(this.sphere = new THREE.Mesh(new THREE.OctahedronGeometry(35,2),new THREE.MeshBasicMaterial({color:0xaaaaaa,wireframe:true})));
		this.sphere.position.z =-75;
		var gui = new myUi(this.game);
		this.scene.add(gui);
	}
	,update:function(delta){
		LGE.Screen.prototype.update.call(this,delta);
		this.sphere.rotation.z += .001;
		this.sphere.rotation.y += .003;
	}
});

var myUi = LGE.UI.Layer2D.extend({
	op:0
	,textOp:1
	,game:null
	,animationManager:null
	,init:function(game){
		this.game = game;
		LGE.UI.Layer2D.prototype.init.call(this,game.width>game.height?game.width:game.height);
		this.draw();
		this.animationManager = new LGE.AnimationManager;
		this.bind("update",function(delta){this.animationManager.update(delta);this.draw();});
		
		var buttonFlicker = new LGE.AnimationQueue()
		.queue(new LGE.Animation(this,{textOp:0},{delay:1000,duration:1000,ease:"easeInQuad"}))
		.queue(new LGE.Animation(this,{textOp:1},{duration:1000,ease:"easeOutQuad"}))
		.bind("complete",function(){this.start();})
		.start();
		
		this.animationManager.add(buttonFlicker);
		this.animationManager.add(new LGE.Animation(this,{op:.7},{duration:5000,ease:"easeOutQuad"}).start());
		var t=this;
		this.game.bind("resize",function(){if(!t.visible)return; t.map.setSize(this.width); t.draw();})
	}
	,draw:function(){
		//dimm scene

		var c = this.context;
		c.save();	
		c.clearRect(0,0,this.game.width,this.game.height);
		//c.fillStyle="rgba(255,128,0,"+this.op+")";
		c.fillStyle="rgba(0,0,0,"+this.op+")";
		c.fillRect(0,0,this.game.width,this.game.height);
		c.restore();

		c.save();
		c.fillStyle="rgba(255,255,230,"+this.textOp+")";
		//c.font = "36pt Impact, Charcoal, sans-serif";
		//c.font = "32pt Trebuchet-MS, Helvetica";
		c.font = "32pt 'Audiowide', cursive";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.shadowBlur = 30;
		c.shadowColor = 'rgba(255,250,100,'+this.textOp+')';
		c.fillText("[press any key to start]",this.game.width / 2,this.game.height / 2);
		c.restore();

		this.map.needsUpdate = true;
	}
});

});