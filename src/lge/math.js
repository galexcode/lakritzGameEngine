LGE.Math = {};

LGE.Math.randRange = window.randRange = (function(){
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

LGE.Math.randRangeInt = window.randRangeInt = (function(){
	return window.randRangeInt ||
	function(){
		return parseInt(window.randRange.apply(null,arguments));
	}
})();

LGE.Math.deg2rad = window.deg2rad = function(deg){
	return deg / 57.2957795;
}

LGE.Math.rad2deg = window.rad2deg = function(rad){
	return rad * 57.2957795;
}