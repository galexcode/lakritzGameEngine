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
		/*var tb = new LGE.UI.Button2D("Button 1",150,30);
		tb.position.x = this.stage.width / 2 - 75;
		tb.position.y = this.stage.height / 2;
		//tb.rotation = 45;
		this.add(tb);

		tb = new LGE.UI.Button2D("Button 2",150,30);
		tb.position.x = this.stage.width / 2 - 75;
		tb.position.y = this.stage.height / 2 + 35;
		//tb.rotation = 45;
		this.add(tb);

		tb = new LGE.UI.Button2D("Button 3",150,30);
		tb.position.x = this.stage.width / 2 - 75;
		tb.position.y = this.stage.height / 2 + 70;
		tb.rotation = 45;
		tb.alpha = .3;
		this.add(tb);*/

		var tf = new LGE.UI.Textfield2D("",new LGE.UI.Textfield2D.DefaultStyle({
			textStyle:new LGE.UI.Text2D.DefaultStyle({
				color:"red"
				,weight:"bold"
			})
			,boxStyle:new LGE.UI.Box2D.DefaultStyle({
				color:"#efefef"
				,border:"#dddddd"
				,borderSize:1
			})
			,padding:15
		}),200,200);
		tf.position.x = this.stage.width/2 - 100;
		tf.position.y = this.stage.height/2 - 100;
		tf.alpha = 0;
		tf.text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.";
		tf.text += "\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr.";
		tf.text += "\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr.";
		this.add(tf);

		var tanim = new LGE.Animation(tf,{alpha:1},{delay:1000,duration:1000,ease:"easeInOutQuad"}).start();
		this.bind("update",function(delta){
			tanim.update(delta);
		});

		/*var testshape = new LGE.UI.Shape2D(100,100);
		testshape.context.color = "black";
		testshape.context.fillRect(0,0,100,100);
		testshape.position.x = 200;
		testshape.position.y = 200;
		this.add(testshape);*/

		var style = new LGE.UI.Style({
			derp:1
			,herp:2
		});
		style.bind("change",function(param,value){console.log(param,value)});
		style.derp=2;
		style.herp=1337;
		console.log(style);
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
