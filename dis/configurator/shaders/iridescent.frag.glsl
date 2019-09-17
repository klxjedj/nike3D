// IRIDESCENT SHADER

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
varying vec2 tiledUv;

uniform float opticalDensity;
uniform int uvFlip;

#ifdef USE_NORMALMAP
	uniform mat4 normalTiledMatrix;
#endif

#ifdef USE_DIFFUSE_MAP
	uniform sampler2D diffuseMap;
	uniform sampler2D colorMap;
	uniform sampler2D alphaMap;
#endif


#ifdef USE_SUBSTANCE
	uniform sampler2D substanceMap;
#endif


#ifdef USE_PATTERN
	
	varying vec2 patternUv;

	uniform vec3 patternDiffuse;
	uniform vec3 patternEmissive;
	uniform float patternTintThreshold;

	uniform sampler2D patternDiffuseMap;
	uniform float patternThickness;
	
	#ifdef USE_PATTERN_SUBSTANCE
		uniform sampler2D patternSubstanceMap;
	#endif

	#ifdef USE_PATTERN_NORMAL
		uniform sampler2D patternNormalMap;
		uniform mat4 patternNormalMatrix;
	#endif
	
	uniform float patternGlossiness;
	uniform float patternSpecularPower;
#endif

uniform mat4 mirroredNormalMatrix;

#ifdef USE_DECAL
	varying vec2 decalUv;
	uniform vec3 decalDiffuse;
	uniform float decalTintThreshold;

	uniform sampler2D decalDiffuseMap;
	uniform float decalThickness;
	
	#ifdef USE_DECAL_NORMAL
		// todo: implement this if needed.
		uniform sampler2D decalNormalMap;
	#endif

	uniform float decalGlossiness;
	uniform float decalSpecularPower;
#endif

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

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 normalMapSample ) {

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

	// note: normalMapSample values assumed to already be scaled to -1 to 1.
	vec3 mapN = normalMapSample;

	mapN.xy *= normalScale;
	mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

	return normalize( tsn * mapN );
}

#endif



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
		diffuseColor = mapTexelToLinear( texture2D(diffuseMap, tiledUv * 4.0) ) * diffuseColor;
		//diffuseColor = texture2D(diffuseMap, tiledUv) * diffuseColor;
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


	#ifdef USE_PATTERN
		
		vec4 patternDiffuseSample =  mapTexelToLinear( texture2D( patternDiffuseMap, patternUv) );

		float patternTintAmount = step(patternTintThreshold, patternDiffuseSample.r);
		
		patternDiffuseSample.rgb = mix(patternDiffuseSample.rgb, patternDiffuseSample.rgb * patternDiffuse, patternTintAmount);

		totalEmissiveRadiance = mix(totalEmissiveRadiance, patternEmissive, patternDiffuseSample.a);

		// override the diffuse color with the pattern color based on the pattern diffuse map alpha channel
		diffuseColor.rgb = mix(diffuseColor.rgb, patternDiffuseSample.rgb, patternDiffuseSample.a);

		specularSample   = mix(specularSample,   patternSpecularPower, patternDiffuseSample.a);
		glossinessSample = mix(glossinessSample, patternGlossiness,    patternDiffuseSample.a);
		
		#ifdef TRANSPARENT
			diffuseColor.a = mix(diffuseColor.a, patternDiffuseSample.a, patternThickness * patternDiffuseSample.a);
		#endif

		#ifdef CUT_OUT 
			diffuseColor.a = diffuseColor.a * patternDiffuseSample.a;
		#endif

		#ifdef USE_PATTERN_SUBSTANCE
			
			vec4 patternSubstance = texture2D( patternSubstanceMap, patternUv );

			// override spec/gloss according to the alpha channel of the pattern substance map.
			
			specularSample = mix(specularSample, patternSubstance.g * patternSpecularPower, patternSubstance.a);
			glossinessSample = mix(glossinessSample, patternSubstance.b * patternGlossiness, patternSubstance.a);

			diffuseColor.rgb = mix(diffuseColor.rgb, patternDiffuseSample.rgb, patternSubstance.a);
		
		// #else 
			
			//diffuseColor *= patternDiffuse;

		#endif

	#endif

	

	#ifdef USE_DECAL

		vec4 decalTexel = texture2D( decalDiffuseMap, decalUv );
		//vec4 decalTexel = texture2D( decalDiffuseMap, decalUv );
		vec3 decalDiffuseSample = decalTexel.rgb;

		float decalTintAmount = step(decalTintThreshold, decalDiffuseSample.r);
		
		decalDiffuseSample = mix(decalDiffuseSample, decalDiffuseSample * decalDiffuse, decalTintAmount);

		#ifdef TRANSPARENT 
			diffuseColor.a = diffuseColor.a * patternDiffuseSample.a;
		#endif
		
		// override the diffuse color based on decal alpha channel
		diffuseColor.rgb = mix( diffuseColor.rgb, decalDiffuseSample, decalTexel.a );
		totalEmissiveRadiance = mix(totalEmissiveRadiance, vec3(0,0,0), decalTexel.a);

		// override spec/gloss based on decal 
		specularSample = mix(specularSample, decalSpecularPower, decalThickness * decalTexel.a);
		glossinessSample = mix(glossinessSample, decalGlossiness, decalThickness * decalTexel.a);

	#endif


	#ifdef USE_NORMALMAP

		vec3 normalSample = texture2D( normalMap, tiledUv ).xyz;

		// normal maps are associated with the base/substance layer and may be transformed.
		 normalSample = normalSample * 2.0 - 1.0;
		normalSample = (normalTiledMatrix * vec4(normalSample, 1.0)).xyz;
		
		normal = perturbNormal2Arb( -vViewPosition, normal, normalSample );

	#endif
	
	#include <emissivemap_fragment>

	BlinnPhongMaterial material;

	material.diffuseColor = vec3(1.0);  // diffuseColor.rgb;
	material.specularColor = vec3(1.0); // specular;
	material.specularShininess = glossinessSample;
	material.specularStrength = specularSample;

	float specularStrength = specularSample;

	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	//# include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	
	float a = clamp(diffuseColor.a + reflectedLight.directSpecular.r + reflectedLight.indirectSpecular.r, 0.0, 1.0);
	//outgoingLight.a = diffuseColor.a;

	
	vec3 outgoingOld = outgoingLight;

//	outgoingLight = vec3(0.0, 0.0, 0.0);
	//outgoingLight = vec3(0,0,0);
	#include <envmap_fragment>
	
	gl_FragColor = vec4(outgoingLight + outgoingOld, a);

	#ifdef TRANSPARENT
		#ifdef TRANSLUCENT
			gl_FragColor.rgb = outgoingLight + outgoingOld;
			gl_FragColor.a = outgoingLight.r + a + pow(1.0 - clamp(NdotE, 0.0, 1.0), opticalDensity);
		#endif
	#endif
	//gl_FragColor = vec4( outgoingLight, diffuseColor.a);
	//gl_FragColor = vec4(reflectedLight.indirectSpecular, 1.0);// vec4( outgoingLight, diffuseColor.a) + vec4(reflectedLight.directSpecular, reflectedLight.directSpecular.r) + vec4(reflectedLight.indirectSpecular, reflectedLight.indirectSpecular.r);

	//gl_FragColor = aoChannelMask;
	//gl_FragColor = vec4( diffuseColor.a, diffuseColor.a, diffuseColor.a , 1.0);
	//gl_FragColor = diffuseColor;
	float tmp = NdotE;
	tmp = dot(normalize(vViewPosition), normal);
	float NdE = clamp(tmp, 0.0, 1.0);

	//float n = 1.0;
	vec4 spectrumSample = texture2D(colorMap, vec2((diffuseColor.r * 0.5) + NdE, 0.25));
	float intensity = pow(NdE, 1.75) * 0.5;
	
	intensity = mix(0.35, 1.0, clamp(intensity + reflectedLight.directSpecular.r, 0.0, 1.0));
	
	gl_FragColor = vec4(spectrumSample.rgb, intensity * diffuseColor.a * opacity);
	vec4 maskTexel = texture2D( alphaMap, vUv );
	
	gl_FragColor.a *= saturate(maskTexel.r);
	// gl_FragColor.a = 1.0;
	// gl_FragColor.rgb = maskTexel.rgb;
//gl_FragColor = vec4(vec3(reflectedLight.directSpecular.r), 1.0);
	
	#ifdef USE_AOMAP
		/*float a = texture2D( aoMap, vUv ).r;
		a -= 0.5;
		a *= 2.0;
       	gl_FragColor = vec4(a, a, a, 1.0);*/
	#endif
	
	#ifdef USE_NORMALMAP
		// gl_FragColor = vec4(normalSample, 1.0);
	#endif

	#ifdef USE_DECAL_NORMAL
		// gl_FragColor = decalNormalSample;
	#endif

	#ifdef USE_PATTERN
		//gl_FragColor = diffuseColor;
	#endif

	#ifdef USE_PATTERN_NORMAL
		// gl_FragColor = vec4(patternNormalSample, 1.0);
	#endif

	#ifdef USE_SUBSTANCE
		// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * pow(substanceSample.r, 6.0);
		// gl_FragColor = substanceSample;
	#endif

	#ifdef USE_PATTERN_SUBSTANCE
		//gl_FragColor = patternSubstance;
		// gl_FragColor = vec4(patternSubstance.a, 0.0, 0.0, 1.0);
	#endif

	#ifdef USE_PATTERN
		// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		// gl_FragColor = patternDiffuseSample;
	#endif

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <premultiplied_alpha_fragment>
}