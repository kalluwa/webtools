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
		"backgroundTex":{value:null}
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
		
		"void main() {",
		
			"vec4 texel = texture2D( tDiffuse, vUv );",
			"vec4 backPix = texture2D(backgroundTex,vUv);",
			"float alpha = opacity;",
			"if(renderToScreen){ alpha =texel.a; }//if(texel.r + texel.b + texel.g<0.2)alpha=(texel.r + texel.b + texel.g)/2.0;}",
			"gl_FragColor = alpha * texel + (1.0 - alpha)*backPix;",

		"}"

	].join( "\n" )

};
