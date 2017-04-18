/**
* test bloom pass based on unreal bloom pass
*
*/

THREE.BloomExPass = function (resolution ,strength,radius,threshold){
	//继承
	THREE.Pass.call(this);
	
	this.strength = ( strength != undefined) ? strength : 1;
	this.radius = radius;
	this.threshold = threshold;
	
	this.resolution = (resolution != undefined)?new THREE.Vector2(resolution.x,resolution.y) : new THREE.Vector2(256,256);
	
	//rendertarget
	var pars = {minFilter: THREE.LinearFilter,magFilter:THREE.LinearFilter,format : THREE.RGBAFormat};
	this.rendertargetsHorizontal = [];
	this.rendertargetsVertical = [];
	//使用5个rendertarget 1/2 1/4 1/8 1/16 1/32
	this.nMips = 5;
	var resX = Math.round(this.resolution.x / 2);
	var resY = Math.round(this.resolution.y / 2);
	
	//提取发光部分的数据
	this.renderTargetBright = new THREE.WebGLRenderTarget(resX,resY,pars);
	this.renderTargetBright.texture.generateMipmaps = false;
	
	//生成每一个bloom
	for(var i=0;i<this.nMips;i++){
		//水平
		var renderTarget = new THREE.WebGLRenderTarget(resX,resY,pars);
		renderTarget.generateMipmaps = false;
		this.renderTargetsHorizontal.push(renderTarget);
		
		//垂直
		var renderTarget = new THREE.WebGLRenderTarget(resX,resY,pars);
		renderTarget.generateMipmaps = false;
		this.renderTargetsVertical.push(renderTarget);
		
		//下一层bloom分辨率减半
		resX = Math.round(resX/2);
		resY = Math.round(resY/2);
	}
	
	//-------------------------------------------
	//高亮部分提取
	if(THREE.HighPassExShader == undefined)
		console.error("HighPassExShader is NULL");
	
	var highPassShader = THREE.HighPassExShader;
	this.highPassUniforms = THREE.UniformsUtils.clone(highPassShader.uniforms);
	
	this.materialHighPassFilter = new THREE.ShaderMaterial({
		uniforms : this.highPassUniforms,
		
		vertexShader : highPassShader.vertexShader,
		fragmentShader : highPassShader.fragmentShader,
		defines : {}
	});
	
	//高斯模糊
	this.separableBlurMaterials = [];
	var kernelSizeArray = [3,5,7,9,11];
	var resX = Math.round(this.resolution.x/ 2);
	var resY = Math.round(this.resolution.y /2);
	
	for(var i=0;i<this.nMips;i++){
		this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray);
		this.separableBlurMaterials[i].uniforms["texSize"].value = new THREE.Vector2(resX,resY);
		
		//降采样
		resX = Math.round(resX / 2);
		resY = Math.round(resY / 2);
		
	}
	
    //合成数据
	this.compositeMaterial = this.getCompositeMaterial(this.nMips);
	this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
	this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
	this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
	this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
	this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
	
	this.compositeMaterial.uniforms["bloomStrength"].value = strength;
	this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
	
	var bloomFactors = [1.0,0.8,0.6,0.4,0.2];
	this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
	
	//copy material
	if(THREE.CopyShader == undefined)
		console.error("BloomPass 依赖于copyshader");
	var copyShader = THREE.CopyShader;
	
	this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);
	this.copyUniforms["opacity"].value = 1.0;
	
	this.materialCopy = new THREE.ShaderMaterial({
		uniforms : this.copyUniforms,
		vertexShader : copyShader.vertexShader,
		fragmentShader : copyShader.fragmentShader,
		blending : THREE.A
	});
	
}
