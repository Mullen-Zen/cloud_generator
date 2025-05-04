// main.js
// Garrison Mullen

// imports
import { 
  WebGLRenderer, 
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Fog} from "three";
import { Cloud } from "./src/cloud";

let app = {
  el: document.getElementById("app"),
  scene: null,
  renderer: null,
  camera: null
}
let camAngle = 0;

// creates a set number of clouds in a given area
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

// updates clock element with current time and changes colors to match the time of day
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  document.getElementById("clock").textContent = `${hours}:${minutes}`;

  // update fog color and sky gradient to match time of day
  let tstVal = 0;
  app.scene.fog = new Fog((now.getHours() + tstVal <= 5 || now.getHours() + tstVal >= 19) ? 0x1a2e40 : (now.getHours() + tstVal <= 8 || now.getHours() + tstVal >= 17) ? 0xfce9d4 : 0xcce0ff, 10, 50);
  if (now.getHours() + tstVal <= 5 || now.getHours() + tstVal >= 19) {
    document.getElementById("bod").style.background = "linear-gradient(to top, #0a1c2c 0%, #1a2e40 100%)";
  } else if (now.getHours() + tstVal <= 8 || now.getHours() + tstVal >= 17) {
    document.getElementById("bod").style.background = "linear-gradient(to top, #c2875c 0%, #fce9d4 30%, #cce0ff 100%)";
  } else document.getElementById("bod").style.background = "linear-gradient(to top, #d1eaf5 0%, #ffffff 100%)";
}

const init = () => {
  app.renderer = new WebGLRenderer({alpha: true});
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  app.el.appendChild (app.renderer.domElement);

  app.scene = new Scene();
  app.camera =  new PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );
  app.camera.position.set(-6,-15,0);
  app.camera.lookAt(-10,0,-10);

  const ambient = new AmbientLight(0xffffff, 0.6);
  app.scene.add(ambient);

  const sun = new DirectionalLight(0xffffdd, 1);
  sun.position.set(-6, 30, 30);
  sun.target.position.set(-10, 0, -10);
  sun.castShadow = true;
  app.scene.add(sun);
  app.scene.add(sun.target);

  app.clouds = []
  addCloudLayer(40, [-.5, 2.5], 3); // low
  addCloudLayer(30, [3.0, 5.0], 3);  // mid
  addCloudLayer(20, [5.5, 7.5], 4);  // high
  addCloudLayer(5, [2, 4], 2); // another small group


};

const render = () => {
  requestAnimationFrame(render);

  app.clouds.forEach((cloud) => {
    const speed = 0.01 * (1 - cloud.position.y / 10) + 0.01;
    cloud.position.z += speed; // higher clouds move slower and v.v.
    cloud.rotation.y += Math.random() * .0005 + 0.0005;

    // respawn clouds as they move out of sight
    if (cloud.position.z > 10 || cloud.position.y > 20) {
      cloud.position.x = (Math.random() - 0.5) * 70
      cloud.position.y = 3 + Math.random() * 6;
      cloud.position.z = -50 + Math.random() * 10;
    }
  });

  app.renderer.render(app.scene, app.camera);
};

init();
render();
setInterval(updateClock, 1000);
updateClock();
