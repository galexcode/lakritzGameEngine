LGE.GameWidget = LGE.Game.extend({
	clearColor:null,
	useWidgetControls:true,
	usePointerLock:true,
	init:function(container){
		LGE.Game.prototype.init.call(this,container);
		var t=this;

		if(this.clearColor!==null)
			this.renderer.setClearColorHex( this.clearColor, 1 );
		
		this.getInputProcessor().bind("keyup",function(e){
			if(!t.useWidgetControls)
				return;
			switch(e.key){
				case LGE.InputProcessor.ESCAPE:
					this.trigger("blur");
				break;
				case LGE.InputProcessor.SPACE:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setPaused(!t.getPaused());
				break;
				case LGE.InputProcessor.BACKSPACE:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setMaximized(!t.getMaximized());
				break;
				case LGE.InputProcessor.ENTER:
					if(this.isPressed(LGE.InputProcessor.CTRL))
						t.setFullScreen(!t.getFullScreen());
				break;
			}
		}).bind("focus",function(){
			if(!t.usePointerLock)
				return;
			if(!pointerLockApi.isPointerLocked()){
				pointerLockApi.requestPointerLock(t.renderer.domElement);
			}
		}).bind("blur",function(){
			if(!t.usePointerLock)
				return;
			if(pointerLockApi.isPointerLocked() && pointerLockApi.requestedElement === t.renderer.domElement){
				pointerLockApi.exitPointerLock();
			}
		});
	}
});