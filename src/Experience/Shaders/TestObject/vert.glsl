#include "/node_modules/lygia/math/const.glsl"
#include "/node_modules/lygia/generative/cnoise.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform float uDistort;

varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform float uFrequency;

vec3 distort(vec3 p){
    // float noise=cnoise(p+iTime);
    // vNoise=noise;
    // p+=noise*normal*.3*uDistort;
    float offset=cnoise(p/uFrequency+iTime*.5);
    float t=(p.y+offset)*PI*12.;
    float noise=(sin(t)*p.x+cos(t)*p.z)*2.;
    noise*=uDistort;
    vNoise=noise;
    p+=noise*normal*.01;
    return p;
}

#include "../Common/fixNormal.glsl"

void main(){
    vec3 p=position;
    vec3 dp=distort(p);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(dp,1.);
    
    vUv=uv;
    // vNormal=(modelMatrix*vec4(normal,0.)).xyz;
    vec3 fNormal=fixNormal(p,dp,normal,RADIUS/SEGMENTS);
    vNormal=(modelMatrix*vec4(fNormal,0.)).xyz;
    vWorldPosition=vec3(modelMatrix*vec4(dp,1));
}