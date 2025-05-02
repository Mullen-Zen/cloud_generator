import { 
  WebGLRenderer, 
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight} from "three";
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
  app.renderer.setSize ( window.innerWidth, window.innerHeight);
  app.el.appendChild (app.renderer.domElement);

  app.scene = new Scene();
  app.camera =  new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const ambient = new AmbientLight(0xffffff, 0.6);
  app.scene.add(ambient);

  const sun = new DirectionalLight(0xffee88, 1);
  sun.position.set(5, 10, 2);
  app.scene.add(sun);

  // clouds --> two in foregroud, the rest scattered in the background
  const mainCloud1 = new Cloud({sphereCount: 25, spread: 4});
  mainCloud1.position.set(-5, 3, -10);
  app.scene.add(mainCloud1);

  const mainCloud2 = new Cloud({sphereCount: 30, spread: 5});
  mainCloud2.position.set(2, 4, -8);
  app.scene.add(mainCloud2);
};

const render = () => {
  requestAnimationFrame(render);
  app.renderer.render(app.scene, app.camera);
};

init();
render();
