#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;

uniform vec3 specular;
//uniform float specularStrength;
uniform float glossiness;
uniform float specularPower;
uniform float opacity;

uniform vec4 aoChannelMask;

#if defined( TRANSPARENT ) && defined( TRANSLUCENT )
	varying float NdotE;
	uniform float opticalDensity;
#endif

#if defined( USE_DIFFUSE_MAP ) || defined(USE_SUBSTANCE) || defined(USE_NORMALMAP) 
	varying vec2 tiledUv;
#endif 

uniform int uvFlip;

#ifdef USE_NORMALMAP
	uniform mat4 normalTiledMatrix;
#endif

#ifdef USE_DIFFUSE_MAP
	uniform sampler2D diffuseMap;
#endif


#ifdef USE_SUBSTANCE
	uniform sampler2D substanceMap;
	uniform vec3 substanceMin;
	uniform vec3 substanceMax;
#endif

#ifdef USE_COLOR_LOOKUP
	uniform sampler2D colorLookupMap;
	uniform sampler2D colorMap;
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
		uniform float patternNormalScale;
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
//# //include <tonemapping_pars_fragment>

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

	// note: normalMapSample values assumed to already be scaled to -1 to 1.
	vec3 mapN = normalMapSample;

	mapN.xy *= normScale;
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
		diffuseColor = mapTexelToLinear( texture2D(diffuseMap, tiledUv) ) * diffuseColor;
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
		
		#ifdef MIP_BIAS
			highp vec4 substanceSample = texture2D(substanceMap, tiledUv, MIP_BIAS);
		#else
			highp vec4 substanceSample = texture2D(substanceMap, tiledUv);
		#endif

		// substance map is multiplied over the base color/spec/gloss values.	
		highp vec3 dsgMultiplier    = clamp( mix(substanceMin, substanceMax, substanceSample.rgb), vec3(0.0), vec3(1.0));
		
		diffuseColor.rgb *= dsgMultiplier.r;
		specularSample   *= dsgMultiplier.g;
		glossinessSample *= dsgMultiplier.b;

		specularSample   = clamp(specularSample, 0.0, 1.0);
		glossinessSample = clamp(glossinessSample, 0.01, 1000.0);
	#endif


	#ifdef USE_PATTERN
		
		vec4 patternDiffuseSample = mapTexelToLinear( texture2D( patternDiffuseMap, patternUv) );
		//vec4 patternDiffuseSample = texture2D( patternDiffuseMap, patternUv);

		float patternTintAmount = step(patternTintThreshold, patternDiffuseSample.a);

		patternDiffuseSample.rgb = mix(patternDiffuseSample.rgb, patternDiffuseSample.rgb * patternDiffuse, patternTintAmount);
		vec3 tmpEmissive = totalEmissiveRadiance;
		totalEmissiveRadiance = mix(tmpEmissive, patternEmissive, patternDiffuseSample.a);

		// override the diffuse color with the pattern color based on the pattern diffuse map alpha channel
		diffuseColor.rgb = mix(diffuseColor.rgb, patternDiffuseSample.rgb, patternDiffuseSample.a);

		specularSample   = mix(specularSample,   patternSpecularPower, patternDiffuseSample.a);
		glossinessSample = mix(glossinessSample, patternGlossiness,    patternDiffuseSample.a);
		
		#ifdef TRANSPARENT
			//diffuseColor.a = mix(diffuseColor.a, patternDiffuseSample.a, patternThickness * patternDiffuseSample.a);

			diffuseColor.a = mix(diffuseColor.a, 1.0, patternDiffuseSample.a);
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
			totalEmissiveRadiance = mix(tmpEmissive, patternEmissive, patternSubstance.a);
		
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
			//diffuseColor.a = diffuseColor.a * patternDiffuseSample.a;
		#endif
		
		// override the diffuse color based on decal alpha channel
		diffuseColor.rgb = mix( diffuseColor.rgb, decalDiffuseSample, decalTexel.a );
		//totalEmissiveRadiance = mix(totalEmissiveRadiance, patternEmissive, patternDiffuseSample.a);
		totalEmissiveRadiance = mix(totalEmissiveRadiance, vec3(0, 0, 0), decalTexel.a);

		// override spec/gloss based on decal 
		specularSample = mix(specularSample, decalSpecularPower, decalThickness * decalTexel.a);
		glossinessSample = mix(glossinessSample, decalGlossiness, decalThickness * decalTexel.a);
	#endif


	#ifdef USE_NORMALMAP

		#ifdef MIP_BIAS
			vec3 normalSample = texture2D( normalMap, tiledUv, MIP_BIAS ).xyz;
		#else
			vec3 normalSample = texture2D( normalMap, tiledUv ).xyz;
		#endif

		// normal maps are associated with the base/substance layer and may be transformed.
		normalSample = normalSample * 2.0 - 1.0;
		normalSample = (normalTiledMatrix * vec4(normalSample, 1.0)).xyz;
		
		
		#ifdef USE_PATTERN_SUBSTANCE
			
			#ifdef USE_PATTERN_NORMAL
				vec4 patternNormalTex = texture2D(patternNormalMap, patternUv);
				vec3 patternNormalSample = patternNormalTex.xyz;

				patternNormalSample = patternNormalSample * 2.0 - 1.0;
				patternNormalSample = (_patternNormalMatrix * vec4(patternNormalSample, 1.0)).xyz;

			    normalSample = mix(normalSample, patternNormalSample, patternThickness * patternNormalTex.a);
			#else 
				// patterns can only cancel out the normal map, they don't have normal maps of their own.
				//vec3 flatNormal = (normalTiledMatrix * vec4(vec3(0.5, 0.5, 1.0), 1.0)).xyz
				normalSample = mix(normalSample, vec3(0.0, 0.0, 1.0), patternThickness * patternSubstance.a);

			#endif
		
		#elif defined USE_PATTERN

			#ifdef USE_PATTERN_NORMAL
				vec4 patternNormalTex = texture2D(patternNormalMap, patternUv);
				vec3 patternNormalSample = patternNormalTex.xyz;
				
				patternNormalSample = patternNormalSample * 2.0 - 1.0;

				patternNormalSample = (patternNormalMatrix * vec4(patternNormalSample, 1.0)).xyz;
				
				patternNormalSample = normalize(mix(vec3(0.0, 0.0, 1.0), patternNormalSample, patternNormalScale));

				normalSample = mix(normalSample, patternNormalSample, patternThickness * patternNormalTex.a);

			#else
				vec3 patternNormalSample = vec3(0.0, 0.0, 1.0);
				normalSample = mix(normalSample, patternNormalSample, patternThickness);// * patternDiffuseSample.a);
			#endif
		
		#endif
		
		#ifdef USE_DECAL
			normalSample = mix(normalSample, vec3(0.0, 0.0, 1.0), decalThickness * decalTexel.a);
		#endif


		#ifdef USE_DECAL_NORMAL
			vec4 decalNormalSample = texture2D( decalNormalMap, decalUv );
			normalSample = mix(normalSample, decalNormalSample.rgb, decalNormalSample.a);
		#endif

		normal = perturbNormal2Arb( -vViewPosition, normal, normalSample, normalScale );

	#elif defined USE_DECAL_NORMAL

		vec3 decalNormalSample = texture2D( decalNormalMap, decalUv ).rgb;
		normal = perturbNormal2Arb( -vViewPosition, normal, decalNormalSample, normalScale );

	#else 
		
		//diffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
		//normal = normalize( normalMatrix * normal );
		//perturbNonormal = perturbNormal2Arb( -vViewPosition, normal, decalNormalSample );rmal2Arb

	#endif
	
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

	#ifdef USE_SUBSTANCE
		///reflectedLight.directDiffuse *= dsgAdjusted.r;
	#endif

	#ifdef USE_ENVMAP
	//	vec3 wn = inverseTransformDirection( normal, viewMatrix );
	//	vec4 giSample = textureCubeLodEXT( envMap, wn, 8.5 );
	//	reflectedLight.indirectDiffuse += giSample.rgb;
	#endif

	// modulation
	#include <aomap_fragment>

	#ifdef USE_AOMAP
	reflectedLight.directDiffuse *= aoSample;
	#endif
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	
	float a = clamp(diffuseColor.a + reflectedLight.directSpecular.r + reflectedLight.indirectSpecular.r, 0.0, 1.0);

	//outgoingLight.a = diffuseColor.a;
	
	#include <envmap_fragment>
	
//	gl_FragColor = vec4(outgoingOld, diffuseColor.a);

	vec3 outgoingOld = outgoingLight;
	outgoingLight = vec3(0.0, 0.0, 0.0);
	//outgoingLight = vec3(0,0,0);

	#ifdef TRANSPARENT
	
		gl_FragColor = vec4(outgoingOld, diffuseColor.a);

		#ifdef TRANSLUCENT
			gl_FragColor.rgb = outgoingLight + outgoingOld;
			gl_FragColor.a = outgoingLight.r + a + pow(1.0 - clamp(NdotE, 0.0, 1.0), opticalDensity);
		#endif
	#else
		gl_FragColor = vec4(outgoingOld.rgb, 1.0);
	#endif
	//gl_FragColor = vec4( outgoingLight, diffuseColor.a);
	//gl_FragColor = vec4(envColor, 1.0);// vec4( outgoingLight, diffuseColor.a) + vec4(reflectedLight.directSpecular, reflectedLight.directSpecular.r) + vec4(reflectedLight.indirectSpecular, reflectedLight.indirectSpecular.r);

	//gl_FragColor = aoChannelMask;
	//gl_FragColor = vec4( diffuseColor.a, diffuseColor.a, diffuseColor.a , 1.0);
	//gl_FragColor = diffuseColor;
	

	//float n = 1.0;

	//gl_FragColor = vec4(vec3(diffuseColor.r), 1.0);
	#ifdef USE_AOMAP
		/*float a = texture2D( aoMap, vUv ).r;
		a -= 0.5;
		a *= 2.0;
       	gl_FragColor = vec4(a, a, a, 1.0);*/
	#endif

	#ifdef USE_ENVMAP
		//gl_FragColor = vec4(envColor.rgb, 1.0);
	#endif

	#ifdef USE_NORMALMAP
		//gl_FragColor = vec4(normal, 1.0);
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
		//gl_FragColor = vec4(diffuseColor.rgb, 1.0);
	    //gl_FragColor.rgb = vec3(dsgAdjusted.r);//substanceSample.rgb;//vec3(dsgAdjusted.b);
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