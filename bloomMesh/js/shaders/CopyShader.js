/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity":  { value: 1.0 },
		"renderToScreen":{value:0.0},
		"backgroundTex":{value:null},
		"foregroundTex":{value:null}
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"uniform bool renderToScreen;",
		
		"uniform sampler2D backgroundTex;",
		
		"uniform sampler2D foregroundTex;",
		
		"void main() {",
		
			"vec4 texel = texture2D( tDiffuse, vUv );",
			"vec4 backPix = texture2D(backgroundTex,vUv);",
			"vec4 foreTex = texture2D(foregroundTex,vUv);",
			"vec4 mergeBackPixel = backPix*(1.0 - foreTex.a) + foreTex.a * foreTex; ",
			"float alpha = opacity;",
			"if(renderToScreen){ alpha =texel.r / 1.5; }//if(texel.r + texel.b + texel.g<0.2)alpha=(texel.r + texel.b + texel.g)/2.0;}",
			"gl_FragColor = alpha * texel + mergeBackPixel;",

		"}"

	].join( "\n" )

};
