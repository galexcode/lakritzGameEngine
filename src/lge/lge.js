if(!lakritz.isObject(LGE)){
	LGE = window.LGE = {};
}
$.extend(LGE, {
	VERSION:"0.0.03 pre-alpha"
});

document.onselectstart = function() {
  return false;
};

//htmlLauncher
$(function(){
	$(document.body).find('[data-lge-object!=""]').each(function(){
		var el = $(this), args = el.data(), gameClass = args.lgeObject,obj;
		if(!window[gameClass]||el.data("game")){
			return;
		}
		obj = new window[gameClass](el,args);
		el.data("game",obj);
	});
})