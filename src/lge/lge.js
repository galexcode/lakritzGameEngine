/**
 *class		 Unknown Class
 *package	 LGE
 *file 		 lge.js
 */
if(!window.LGE){
	LGE = window.LGE = {
		VERSION:"0.0.09 pre-alpha"
		,physiconf:{
			worker:'physijs_worker.js'
			,ammo:'ammo.js'
		}
	};
}

LGE.typeof = function(o){var t=Object.prototype.toString.call(o).substr(8); return t.substr(0,t.length-1).toLowerCase();};

//sort of hack until i can think of something better, a js worker maybe or something... definitly not via ajax!
LGE.import = function(file,callback){
	document.write(unescape('%3Cscript src="'+file+'"%3E%3C/script%3E'));
	if(callback)
		callback();
}

LGE.__writePhysiConf = function(){
	if(window.Physijs){
			window.Physijs.scripts.worker = LGE.physiconf.worker;
			window.Physijs.scripts.ammo = LGE.physiconf.ammo;	
	}
}

LGE.load = function(files,callback){
	if(!callback && LGE.typeof(files)=="function"){
		LGE.__writePhysiConf();
		LGE.define();
		files();
		return;
	}else if(LGE.typeof(files) == "array"){
		var i=files.length;
		if(LGE.__loadCallback){
			LGE.__loadCallback();
			return;
		}
		LGE.__loadCallback = callback||(function(){});
		files.reverse();
		(function loadNext(){
			if(i--){
				LGE.import(files[i], loadNext);
			}else{
				if(callback){
					//TODO my god, such an ugly hack!..
					document.write(unescape('%3Cscript %3E '+escape("window.LGE.define();window.LGE.__writePhysiConf();if(window.LGE.__loadCallback)window.LGE.__loadCallback();")+' %3C/script%3E'));
				}
			}
		})();
	}
}

LGE.define = function(){(function($,THREE,LGE,Physijs){
	// definition of all LGE classes