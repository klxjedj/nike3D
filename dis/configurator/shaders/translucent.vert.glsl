#define PHONG

uniform mat3 tiledTransforms[2];

uniform int uvFlip;

varying float NdotE;
#if defined( USE_DIFFUSE_MAP ) || defined(USE_SUBSTANCE) || defined(USE_NORMALMAP) 
	varying vec2 tiledUv;
#endif
varying vec3 vViewPosition;

#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif

#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>


void main() {
	#include <uv_vertex>

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
	
	vec4 worldPos = modelMatrix * vec4( transformed, 1.0 );
	vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
	
	NdotE = dot(viewDir, vNormal);

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <envmap_vertex>
	//# include <fog_vertex>
}