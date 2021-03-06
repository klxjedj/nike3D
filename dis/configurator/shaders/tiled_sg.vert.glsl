//# define PHYSICAL
#define PHONG

uniform mat3 tiledTransforms[2];

uniform int uvFlip;

#if defined( TRANSPARENT ) && defined( TRANSLUCENT )
	varying float NdotE;
#endif

#if defined( USE_DIFFUSE_MAP ) || defined(USE_SUBSTANCE) || defined(USE_NORMALMAP) 
varying vec2 tiledUv;
#endif
varying vec3 vViewPosition;

#ifdef USE_NORMALMAP
	//uniform mat4 normalTransforms[2];
	//varying mat4 normalTiledMatrix;
#endif

#ifdef USE_PATTERN
	uniform mat3 patternTransforms[2];
	varying vec2 patternUv;
#endif


#ifdef USE_DECAL
	uniform mat3 decalTransforms[2];
	varying vec2 decalUv;
#endif


#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif


#include <common>

#if defined(USE_AOMAP) || defined(USE_NORMALMAP) || defined(USE_PATTERN_NORMAL) || defined(USE_COLOR_LOOKUP) || defined(USE_DECAL_NORMAL)
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif

#include <envmap_pars_vertex>
//# include <uv2_pars_vertex>
//# include <displacementmap_pars_vertex>
#include <color_pars_vertex>
//# include <fog_pars_vertex>

//# include <morphtarget_pars_vertex>
//# include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
//varying vec3 vWorldPosition;

void main() {

	#if defined(USE_AOMAP) || defined(USE_NORMALMAP) || defined(USE_PATTERN_NORMAL) || defined(USE_COLOR_LOOKUP) || defined(USE_DECAL_NORMAL)
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif

	vec3 uv3 = vec3(uv, 1);

	#if defined( USE_DIFFUSE_MAP ) || defined(USE_SUBSTANCE) || defined(USE_NORMALMAP) 
		tiledUv = ( tiledTransforms[uvFlip] * uv3 ).xy;
	#endif

	#ifdef USE_NORMALMAP
		//normalTiledMatrix = normalTransforms[uvFlip];
	#endif

	#ifdef USE_PATTERN
		patternUv = ( patternTransforms[uvFlip] * uv3 ).xy;
	#endif

	#ifdef USE_DECAL
		decalUv = ( decalTransforms[uvFlip] * uv3 ).xy;
	#endif

	//# include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	#include <begin_vertex>
	//# include <morphtarget_vertex>
	//# include <skinning_vertex>
	//# include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;

	#if defined( TRANSPARENT ) && defined( TRANSLUCENT )
		vec4 worldPos = modelMatrix * vec4( transformed, 1.0 );
		vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
	
		NdotE = dot(viewDir, vNormal);
	#endif
	
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <envmap_vertex>
	//# include <fog_vertex>
}