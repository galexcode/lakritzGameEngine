/**
 *class		 Unknown Class
 *package	 LGE
 *file 		 lgewrap.js
 */
})//close anonymous wrapper
(window.jQuery,window.THREE,window.lakritz,window.LGE,window.Physijs)
};//close define function

//include mainfile
(function(){
	var scripts=document.getElementsByTagName("script");
	for(var i in scripts){
		if(Object.prototype.hasOwnProperty.call(scripts[i].attributes,"data-main")){
			LGE.import(scripts[i].attributes["data-main"].value);
			return;
		}
	}
})();