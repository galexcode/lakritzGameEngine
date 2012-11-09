/**
 *class		AnimationManager
 *package	 LGE
 *file 		 animationmanager.js
 */

LGE.AnimationManager = lakritz.Model.extend({
	children:null
	,init:function(){
		this.children = [];
	}
	,add: function ( object ) {

		if ( object === this ) {

			console.warn( 'THREE.Object3D.add: An object can\'t be added as a child of itself.' );
			return;

		}

		if(this.children.indexOf(object)>-1){
			console.warn( 'Animation already in AnimationManager' );
			return;
		}

		this.children.push( object );

	}
	,remove: function ( object ) {

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			this.children.splice( index, 1 );
			return true;
		}else{
			return false;
		}

	}
	,getChildByName: function ( name ) {

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];

			if ( child.name === name ) {

				return child;

			}

		}

		return undefined;

	}
	,update:function(delta){
		var child = this.children.length;
		while(child--){
			this.children[child].update(delta);
		}
	}
});