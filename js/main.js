import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';
// import stars1Texture from '../img/stars1.jpg';
// import stars2Texture from '../img/stars2.jpg';
// import stars3Texture from '../img/stars3.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';
import moonTexture from '../img/moon.jpg';


const scene = new THREE.Scene();

// environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMap = cubeTextureLoader.load([
  starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture
]);

scene.background = environmentMap;
scene.environment = environmentMap;


const canvas = document.querySelector('canvas.webgl');

const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
camera.position.set(-90, 140, 140);


scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas
});

renderer.setSize(size.width, size.height);
renderer.render(scene, camera);



const textureLoader = new THREE.TextureLoader()
// ###############        sun          ####################
const sunGeo = new THREE.SphereGeometry(16, 30, 30)
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
})

const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun)
// ###############        sun          ####################

// ###############        createPlanet function          ####################

function createPlanet(size, texture, position, ring) {
  const obj = new THREE.Object3D();

  const geo = new THREE.SphereGeometry(size, 30, 30)
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  })

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = position;
  obj.add(mesh);
  if (ring) {

    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide
    })

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh)
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  return { mesh, obj };
}



const earthObj = new THREE.Object3D();
const earthGeo = new THREE.SphereGeometry(6, 30, 30)
const earthMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(earthTexture)
})

const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.position.x = 62;
earthObj.add(earthMesh);
scene.add(earthObj);

const moonGeo = new THREE.SphereGeometry(1.7, 30, 30);
const moonMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(moonTexture)
});

const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonMesh.position.x = 10;
earthMesh.add(moonMesh);



const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const mars = createPlanet(4, marsTexture, 80);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

// ###############        createPlanet function          ####################

const pointLight = new THREE.PointLight(0xFFFFFF, 2000, 20000, 1.5);
scene.add(pointLight);

// orbit 
const animate = () => {

  // self rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earthMesh.rotateY(0.02);
  moonMesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // around the sun rotation
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  earthObj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.00007);


  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()

const orbit = new OrbitControls(camera, canvas);
