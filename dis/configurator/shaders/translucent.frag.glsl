// TRANSLUCENT SHADER

#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;

uniform vec3 specular;
//uniform float specularStrength;
uniform float glossiness;
uniform float specularPower;
uniform float opacity;

uniform vec4 aoChannelMask;
varying float NdotE;
#if defined( USE_DIFFUSE_MAP ) || defined(USE_SUBSTANCE) || defined(USE_NORMALMAP) 
	varying vec2 tiledUv;
#endif

uniform float opticalDensity;
uniform int uvFlip;


// Inverted parallax map values.
uniform float interiorDepth; // -0.015
uniform sampler2D interiorMap;

uniform vec3 gumColor;  // vec3(0.7098039215686275, 0.7764705882352941, 0.8313725490196078);
uniform float gumMix;   // 0.7
uniform float interiorIntensity; // 0.78

#ifdef USE_NORMALMAP
	uniform mat4 normalTiledMatrix;
#endif

#ifdef USE_DIFFUSE_MAP
	uniform sampler2D diffuseMap;
#endif

#ifdef USE_COLOR_LOOKUP
	uniform sampler2D colorLookupMap;
	uniform sampler2D colorMap;
#endif


#ifdef USE_SUBSTANCE
	uniform sampler2D substanceMap;
#endif

uniform mat4 mirroredNormalMatrix;

#ifdef USE_AOMAP
 
    float aoSample;
    uniform vec4 aoMapChannel;
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;

#endif

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <envmap_pars_fragment>

#ifdef USE_NORMALMAP

uniform sampler2D normalMap;
uniform vec2 normalScale;

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 normalMapSample, vec2 normScale ) {

	// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

	vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
	vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
	vec2 st0 = dFdx( vUv.st );
	vec2 st1 = dFdy( vUv.st );

	float scale = sign( st1.t * st0.s - st0.t * st1.s ); // we do not care about the magnitude

	vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
	vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
	vec3 N = normalize( surf_norm );
	mat3 tsn = mat3( S, T, N );

	// note: normalMapSample values assumed to already be scaled to -1 to 1 since they have been 
	// transformed prior to being passed into this function.
	vec3 mapN = normalMapSample;

	mapN.xy *= normScale;
	mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

	return normalize( tsn * mapN );
}

#endif


vec2 perturbUv( vec2 sourceUv, vec3 position, vec3 faceNormal, vec3 viewPosition, float depth ) {

	vec2 texDx = dFdx( sourceUv );
	vec2 texDy = dFdy( sourceUv );

	vec3 ddx = dFdx( position );
	vec3 ddy = dFdy( position );
	vec3 vR1 = cross( ddy, faceNormal );
	vec3 vR2 = cross( faceNormal, ddx );
	float fDet = dot( ddx, vR1 );

	vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
	vec3 vProjVtex;

	vProjVtex.xy = (texDx * vProjVscr.x) + (texDy * vProjVscr.y);
	vProjVtex.z = dot( faceNormal, viewPosition );

	vec2 offsetUv = depth * vProjVtex.xy / vProjVtex.z;

	return sourceUv + offsetUv;
}


void main() {

	#ifdef USE_AOMAP
		vec4 aoChannels = texture2D( aoMap, vUv ) * aoChannelMask;
		aoSample = max(max(aoChannels.r, aoChannels.g), max(aoChannels.b, aoChannels.a));
		aoSample -= 0.5;
		aoSample *= 2.0;
	#endif

	#include <clipping_planes_fragment>
	
	#ifdef TRANSPARENT
		vec4 diffuseColor = vec4( diffuse, opacity );
	#else 
		vec4 diffuseColor = vec4( diffuse, 1.0 );
	#endif
	
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#ifdef USE_DIFFUSE_MAP
		diffuseColor = mapTexelToLinear( texture2D(diffuseMap, tiledUv) ) * diffuseColor;
		diffuseColor.a *= opacity;
		//diffuseColor = texture2D(diffuseMap, tiledUv) * diffuseColor;
	#endif

	#ifdef USE_COLOR_LOOKUP
		vec4 lookupValue = mapTexelToLinear( texture2D(colorMap, vUv));
		float lookupX = (lookupValue.r * COLOR_LOOKUP_TEXEL_RANGE) + COLOR_LOOKUP_TEXEL_OFFSET;
		vec4 colorValue = mapTexelToLinear( texture2D(colorLookupMap, vec2(lookupX, 0.5)));

		//diffuseColor.rgb = colorValue.rgb;
		diffuseColor.rgb = colorValue.rgb;
		totalEmissiveRadiance = diffuseColor.rgb * colorValue.a;
	#endif


	#include <logdepthbuf_fragment>
	
    #include <color_fragment>
	//#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>

	float specularSample = specularPower;
	float glossinessSample = glossiness;
	

	#ifdef USE_SUBSTANCE
		
		vec4 substanceSample = texture2D(substanceMap, tiledUv);

		// substance map is multiplied over the base color/spec/gloss values.	
		
		diffuseColor.rgb *= substanceSample.r;
		specularSample *= substanceSample.g;
		glossinessSample *= substanceSample.b;

		diffuseColor.a *= substanceSample.a;
	#endif

	#ifdef USE_NORMALMAP

		vec3 normalSample = texture2D( normalMap, tiledUv ).xyz;

		// normal maps are associated with the base/substance layer and may be transformed.
		normalSample = normalSample * 2.0 - 1.0;
		normalSample = (normalTiledMatrix * vec4(normalSample, 1.0)).xyz;
		
		normal = perturbNormal2Arb( -vViewPosition, normal, normalSample, normalScale );

	#endif


	vec2 tUV = perturbUv(vUv, -vViewPosition, normalize( normal ), normalize( vViewPosition ), interiorDepth);
	vec3 depthSample = texture2D(interiorMap, tUV).rgb;
	
	//float interiorDarkenAmount = mix(interiorIntensity, 1.0, depthSample.r);

	// blend the surface color according to the inteior map.
	vec3 depthColor = mix(diffuseColor.rgb, depthSample.rgb * diffuseColor.rgb, interiorIntensity);
	//float interiorBrightness = length(depthSample.rgb) / 3.0;
	//float gumAmount = 1.0 - ((depthSample.r) * clamp(0.0, 1.0, NdotE));
	float gumAmount = 1.0 - (clamp(0.0, 1.0, NdotE));

	vec3 gum = mix(gumColor, depthColor, gumMix);

	vec3 exteriorColor = mix( depthColor, gum, gumAmount);
	
	diffuseColor.rgb = exteriorColor;

	#include <emissivemap_fragment>

	BlinnPhongMaterial material;

	material.diffuseColor = diffuseColor.rgb;
	material.specularColor = specular;
	material.specularShininess = glossinessSample;
	material.specularStrength = specularSample;

	float specularStrength = specularSample;

	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	#ifdef USE_AOMAP
		reflectedLight.directDiffuse *= aoSample;
	#endif

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	
	float a = clamp(diffuseColor.a + reflectedLight.directSpecular.r + reflectedLight.indirectSpecular.r, 0.0, 1.0);
	//outgoingLight.a = diffuseColor.a;

	//gl_FragColor = vec4(outgoingLight, diffuseColor.a);
	gl_FragColor = vec4(outgoingLight, diffuseColor.a);
	//gl_FragColor = vec4( diffuseColor.rgb, 1.0);
//	gl_FragColor = vec4(vec3(a), 1.0);
	//vec3 outgoingOld = outgoingLight;

	//outgoingLight = vec3(0.0, 0.0, 0.0);
	//outgoingLight = vec3(0,0,0);
	#include <envmap_fragment>
	
	//gl_FragColor = vec4(outgoingLight + outgoingOld, a);
//	gl_FragColor = texture2D(chungusMap, tiledUv);
//	gl_FragColor.a = 1.0;
	#ifdef TRANSPARENT
		#ifdef TRANSLUCENT
			//gl_FragColor.rgb = outgoingLight + outgoingOld;
			//gl_FragColor.a = outgoingLight.r + a + pow(1.0 - clamp(NdotE, 0.0, 1.0), opticalDensity);
		#endif
	#endif

	

	#ifdef USE_AOMAP
		/*float a = texture2D( aoMap, vUv ).r;
		a -= 0.5;
		a *= 2.0;
       	gl_FragColor = vec4(a, a, a, 1.0);*/
	#endif
	
	#ifdef USE_NORMALMAP
		// gl_FragColor = vec4(normalSample, 1.0);
	#endif

	#ifdef USE_SUBSTANCE
		// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * pow(substanceSample.r, 6.0);
		// gl_FragColor = substanceSample;
	#endif

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <premultiplied_alpha_fragment>
}