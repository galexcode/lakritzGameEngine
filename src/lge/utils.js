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
