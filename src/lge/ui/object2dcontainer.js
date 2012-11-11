/**
 *class		Layer2DContainer
 *package	 LGE.UI
 *file 		 layer2dContainer.js
 */
LGE.UI.Object2DContainer = lakritz.makeClass(LGE.UI.Object2D,{
	children:null
	,init:function(position,rotation){
		LGE.UI.Object2D.prototype.init.call(this,position,rotation);
		this.children = [];
		this.bind("update",this.update);
		this.bind("addedToStage",function(){
			var child = this.children.length;
			while(child--){
				this.children[child].stage = this.stage;
				this.children[child].trigger("addedToStage");
			}
		});
		this.bind("removedFromStage",function(){
			var child = this.children.length;
			while(child--){
				this.children[child].stage = this.stage;
				this.children[child].trigger("removedFromStage");
			}
		});
	}
	,drawChildren:function(context){
		var child = 0, len=this.children.length;
		while(child<len){
			if(this.children[child].visible){
				context.save();
				context.translate(this.children[child].position.x, this.children[child].position.y);
				if(this.children[child].rotation!==0){
					context.rotate(this.children[child].rotation);
				}
				this.children[child].draw(context);
				context.restore();
			}
			++child;
		}
	}
	,update:function(delta){
		var child = this.children.length;
		while(child--){
			if(this.children[child].trigger){
				this.children[child].trigger("update",delta);
			}
		}
	}
	,draw:function(context){
		this.drawChildren(context);
	}
	,add: function ( object ) {

		if( !(object instanceof LGE.UI.Object2D ) ){
			console.warn( 'LGE.UI.Object2DContainer.add: Invalid Object' );
			return;
		}

		if ( object === this ) {

			console.warn( 'LGE.UI.Object2DContainer.add: An object can\'t be added as a child of itself.' );
			return;

		}

		if(this.children.indexOf(object)>-1){
			console.warn( 'Can\'t add the same object twice' );
			return;
		}

		object.parent = this;

		if(this.stage){
			object.stage = this.stage;
			object.trigger("addedToStage");
		}

		this.children.push( object );

	}
	,remove: function ( object ) {

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {
			if(object.parent){
				object.parent = undefined;
				if(object.stage){
					object.stage = null;
					object.trigger("removedFromStage");
				}
			}
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
});