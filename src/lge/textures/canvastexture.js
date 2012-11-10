LGE.TEXTURES.CanvasTexture = lakritz.makeClass(THREE.Texture,{
	domElement:null
	,context:null
	,constructor:function(){
		lakritz.Model.apply(this,arguments);
	}
	,init:function(canvas, width, height, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy){
		this.domElement = canvas || document.createElement("canvas");
		width = width||256;
		height= height||256;
		this.context = this.domElement.getContext("2d");
		this.setSize(width,height);
		THREE.Texture.call(this,this.domElement, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
		this.needsUpdate = true;
	}
	,setSize:function(width,height){
		if(isNaN(width)){
			return this;
		}
		this.domElement.width = width;
		this.domElement.height = height===undefined?width:height;
		return this;
	}
	,getSize:function(){
		return {
			width:this.domElement.width
			,height:this.domElement.height
		}
	}
});