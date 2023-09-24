import * as kokomi from "kokomi.js";
import * as THREE from "three";

import testObjectVertexShader from "../Shaders/TestObject/vert.glsl";
import testObjectFragmentShader from "../Shaders/TestObject/frag.glsl";

export default class TestObject extends kokomi.Component {
  constructor(base) {
    super(base);

    const params = {
      uDistort: {
        value: 1,
      },
      uFrequency: {
        value: 1.7,
      },
      uFresnelIntensity: {
        value: 0.2,
      },
      uLightIntensity: {
        value: 0.9,
      },
      uLight2Intensity: {
        value: 0.9,
      },
    };

    const colorParams = {
      themeColor: "#070618",
      lightColor: "#4cc2e9",
      light2Color: "#9743fe",
    };

    this.base.scene.background = new THREE.Color(colorParams.themeColor);

    // const geometry = new THREE.SphereGeometry(2, 64, 64);
    // const RADIUS = 2.001;
    // const SEGMENTS = 64.001;
    const RADIUS = 1.001;
    const SEGMENTS = 256.001;
    const geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
    // const geometry = new THREE.PlaneGeometry(
    //   RADIUS * 2,
    //   RADIUS * 2,
    //   SEGMENTS,
    //   SEGMENTS
    // );
    const material = new THREE.ShaderMaterial({
      vertexShader: testObjectVertexShader,
      fragmentShader: testObjectFragmentShader,
      defines: {
        RADIUS,
        SEGMENTS,
      },
    });
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;
    material.uniforms = {
      ...material.uniforms,
      ...uj.shadertoyUniforms,
      ...params,
      uThemeColor: {
        value: new THREE.Color(colorParams.themeColor),
      },
      uLightColor: {
        value: new THREE.Color(colorParams.lightColor),
      },
      uLight2Color: {
        value: new THREE.Color(colorParams.light2Color),
      },
    };

    const debug = this.base.debug;
    if (debug.active) {
      const debugFolder = debug.ui.addFolder("testObject");
      debugFolder
        .add(params.uDistort, "value")
        .min(0)
        .max(2)
        .step(0.01)
        .name("distort");
      debugFolder
        .add(params.uFrequency, "value")
        .min(0)
        .max(5)
        .step(0.01)
        .name("frequency");
      debugFolder.addColor(colorParams, "themeColor").onChange((val) => {
        material.uniforms.uThemeColor.value = new THREE.Color(val);
        this.base.scene.background = new THREE.Color(val);
      });
      debugFolder.addColor(colorParams, "lightColor").onChange((val) => {
        material.uniforms.uLightColor.value = new THREE.Color(val);
      });
      debugFolder
        .add(params.uFresnelIntensity, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("fresnelIntensity");
      debugFolder
        .add(params.uLightIntensity, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("lightIntensity");
      debugFolder.addColor(colorParams, "light2Color").onChange((val) => {
        material.uniforms.uLight2Color.value = new THREE.Color(val);
      });
      debugFolder
        .add(params.uLight2Intensity, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("light2Intensity");
    }
  }
  addExisting() {
    this.container.add(this.mesh);
  }
  update() {
    this.uj.injectShadertoyUniforms(this.material.uniforms);
  }
}
