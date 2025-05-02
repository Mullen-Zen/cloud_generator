import { 
  WebGLRenderer, 
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Fog,
  PCFSoftShadowMap} from "three";
import { Cloud } from "./src/cloud";

let app = {
  el: document.getElementById("app"),
  scene: null,
  renderer: null,
  camera: null
}

const init = () => {
  app.renderer = new WebGLRenderer();
  console.log(app.renderer);
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  app.renderer.setClearColor(0xcce0ff);
  app.renderer.shadowMap.enabled = true;
  app.renderer.shadowMap.type = PCFSoftShadowMap; 
  app.el.appendChild (app.renderer.domElement);

  app.scene = new Scene();
  app.camera =  new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  app.scene.fog = new Fog(0xcce0ff, 10, 50);

  const ambient = new AmbientLight(0xffffff, 0.6);
  app.scene.add(ambient);

  const sun = new DirectionalLight(0xffffaa, 1);
  sun.position.set(5, 10, 2);
  sun.castShadow = true;
  app.scene.add(sun);

  // clouds --> two in foregroud, the rest scattered in the background
  app.clouds = []

  const mainCloud1 = new Cloud({sphereCount: 25, spread: 4});
  mainCloud1.position.set(-5, 3, -10);
  app.scene.add(mainCloud1);
  app.clouds.push(mainCloud1);

  const mainCloud2 = new Cloud({
    sphereCount: 30, 
    spread: 5});
  mainCloud2.position.set(2, 4, -8);
  app.scene.add(mainCloud2);
  app.clouds.push(mainCloud2);

  for (let i = 0; i < 10; i++) {
    const cloud = new Cloud({
      sphereCount: 20, 
      spread: 3 + Math.random() * 2
    });
    cloud.position.set((Math.random() - 0.5) * 20, 2 + Math.random() * 3, -15 + Math.random() * 10);
    app.scene.add(cloud);
    app.clouds.push(cloud);
  }
};

let camAngle = 0;
const render = () => {
  requestAnimationFrame(render);

  // camera movement
  camAngle += 0.001;
  app.camera.position.x = Math.sin(camAngle) * 2;
  app.camera.lookAt(0, 2, -10);

  // cloud bobbing and rolling in movement
  app.clouds.forEach((cloud, i) => {
    // bobbing
    const t = performance.now() * 0.001 + 1;
    cloud.position.y += Math.sin(t * 0.5) * 0.002;
    cloud.rotation.y += 0.001;

    // rolling in
    cloud.position.z += 0.002;
    if (cloud.position.z > 5) cloud.position.z = -20;
  });

  app.renderer.render(app.scene, app.camera);
};

init();
render();
