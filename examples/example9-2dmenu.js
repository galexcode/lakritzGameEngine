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
		this.scene.add(new LGE.UI.Layer2D(this.game.width,this.game.height,new myGUI));
	}
	,update:function(delta){
		LGE.Screen.prototype.update.call(this,delta);
		this.sphere.rotation.z += .001;
		this.sphere.rotation.y += .003;
	}
});

var myGUI = LGE.UI.Object2DContainer.extend({
	init:function(){
		LGE.UI.Object2DContainer.prototype.init.call(this);	
		this.bind("addedToStage",this.addedToStage);
	}
	,addedToStage:function(){
		this.unbind("addedToStage",this.addedToStage);
		var tb = new LGE.UI.Button2D("test123");
		tb.position.x = this.stage.width / 2;
		tb.position.y = this.stage.height / 2;
		tb.scale.x = 1;
		tb.scale.y = 1;
		tb.rotation = 45;
		this.add(tb);
	}
});

var myTestO2D = lakritz.makeClass(LGE.UI.Object2D,{
	init:function(){
		LGE.UI.Object2D.prototype.init.call(this);
	}
	,draw:function(context){
		context.fillStyle = "#ff0000";
		context.fillRect(-50,-50,100,100);
		this.rotation += .01;
	}
});

});