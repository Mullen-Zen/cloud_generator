import { 
  WebGLRenderer, 
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Fog,
  PCFSoftShadowMap,
  Vector2} from "three";
import { Cloud } from "./src/cloud";
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

let app = {
  el: document.getElementById("app"),
  scene: null,
  renderer: null,
  camera: null
}

function addCloudLayer(count, yRange, spread, density = 1.0) {
  for (let i = 0; i < count; i++) {
    const cloud = new Cloud({
      sphereCount: Math.floor(15 + Math.random() * 15 * density),
      spread: spread + Math.random() * 2,
    });

    cloud.position.set((Math.random() - 0.5) * 50, yRange[0] + Math.random() * (yRange[1] - yRange[0]), -30 + Math.random() * 50);

    app.scene.add(cloud);
    app.clouds.push(cloud);
  }
}

const init = () => {
  app.renderer = new WebGLRenderer({alpha: true});
  console.log(app.renderer);
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  app.renderer.shadowMap.enabled = true;
  app.renderer.shadowMap.type = PCFSoftShadowMap; 
  app.el.appendChild (app.renderer.domElement);

  app.composer = new EffectComposer(app.renderer);
  app.composer.addPass(new RenderPass(app.scene, app.camera));

  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0.5,
    1.5,
    0.0
  );
  app.composer.addPass(bloomPass);

  app.scene = new Scene();
  app.camera =  new PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );
  app.camera.position.set(-6,-15,0);
  app.camera.lookAt(-10,0,-10);
  app.scene.fog = new Fog(0xcce0ff, 10, 50);

  const ambient = new AmbientLight(0xffffff, 0.6);
  app.scene.add(ambient);

  const sun = new DirectionalLight(0xffffdd, 1);
  sun.position.set(5, 10, 2);
  sun.castShadow = true;
  app.scene.add(sun);

  // clouds
  app.clouds = []
  addCloudLayer(40, [0, 2.5], 2.5); // low
  addCloudLayer(30, [3.0, 5.0], 2.5);  // mid
  addCloudLayer(20, [5.5, 7.5], 4);  // high
  addCloudLayer(5, [2, 4], 2); // add small group at current cam height


};

let camAngle = 0;
const render = () => {
  requestAnimationFrame(render);

  // camera movement
  camAngle += 0.001;
  app.camera.position.x = Math.sin(camAngle) * 2;
  // app.camera.lookAt(0, 2, -10);

  // cloud bobbing and rolling in movement
  app.clouds.forEach((cloud) => {
    // moving up overhead
    const speed = 0.01 * (1 - cloud.position.y / 10) + 0.01;
    cloud.position.z += speed;
    // cloud.position.y += 0.005;
    cloud.rotation.y += Math.random() * .0005 + 0.0005;

    if (cloud.position.z > 10 || cloud.position.y > 20) {
      // cloud.position.z = -30 + Math.random() * 10;
      // cloud.position.x = (Math.random() - 0.5) * 50;
      // cloud.position.y = 1.5 + Math.random() * 6;
      cloud.position.z = -50 + Math.random() * 10;
      cloud.position.x = (Math.random() - 0.5) * 70
      cloud.position.y = 3 + Math.random() * 6;
    }
  });

  app.renderer.render(app.scene, app.camera);
};

init();
render();
