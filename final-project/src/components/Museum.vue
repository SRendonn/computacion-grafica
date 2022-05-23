<template>
  <div style="width: 100%; height: 100%" @click="">
    <canvas id="museum-canvas" ref="museumCanvas"></canvas>
    <div id="item-hero">
      <h1>
        {{ museumItemDescriptions[currentItem].title }}
      </h1>
      <p>{{ museumItemDescriptions[currentItem].description }}</p>
      <small>{{ museumItemDescriptions[currentItem].credits }}</small>
    </div>
    <div id="reset-camera-wrapper">
      <button id="reset-camera" @click="prevItem">
        <chevron-left-icon />
      </button>
      <button id="reset-camera" @click="resetCamera">Reset camera</button>
      <button id="reset-camera" @click="nextItem">
        <chevron-right-icon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import crtUrl from '@/assets/50/scene.gltf';
import pdp1Url from '@/assets/60/scene.gltf';
import utahUrl from '@/assets/70/scene.gltf';
import pacmanUrl from '@/assets/80/scene.gltf';
import woodyUrl from '@/assets/90/scene.gltf';
import ps2Url from '@/assets/00/scene.gltf';
import xboxUrl from '@/assets/10/scene.gltf';
import { throttle } from 'lodash-es';
import ChevronRightIcon from '@/components/ChevronRightIcon.vue';
import ChevronLeftIcon from '@/components/ChevronLeftIcon.vue';

type MuseumItem = {
  position: number[];
  url: any;
  scale?: number[];
  rotate?: number[];
};

const museumCanvas = ref<null | HTMLCanvasElement>(null);

const currentItem = ref(0);
const museumItems: MuseumItem[] = [
  {
    position: [0, -1, 0],
    url: crtUrl,
    scale: [0.1, 0.1, 0.1],
    rotate: [-1.5, 0, 1.5],
  },
  {
    position: [10, -1, 0],
    url: pdp1Url,
    scale: [0.5, 0.5, 0.5],
    rotate: [0, 0, 0],
  },
  {
    position: [20, -1, 0],
    url: utahUrl,
    scale: [0.03, 0.03, 0.03],
  },
  {
    position: [30, -4, 0],
    url: pacmanUrl,
    scale: [0.075, 0.075, 0.075],
  },
  {
    position: [40, -1, 0],
    url: woodyUrl,
    scale: [0.035, 0.035, 0.035],
    rotate: [0, 1, 0],
  },
  {
    position: [50, -1, 0],
    url: ps2Url,
    scale: [0.5, 0.5, 0.5],
  },
  {
    position: [60, -1, 0],
    url: xboxUrl,
    scale: [1.5, 1.5, 1.5],
  },
];

const museumItemDescriptions = ref([
  {
    title: '1950s: CRT displays and light pens.',
    description:
      'In 1955, The SAGE Projects use the light pen as an input device for CRT displays (model).',
    credits: '"Cathode Ray Tube" by Mjduniverse, 3D Warehouse SketchUp.',
  },
  {
    title: '1960s: IBM 2250 and PDP-1, ray casting & more games.',
    description:
      'In 1960, the PDP-1 was launched. In 1965, IBM launched the IBM 2250. New games like "Odyssey" and "Spacewar!" were created (the latter being played on the PDP-1). The first ray casting algorithm was described by Arthur Appel.',
    credits:
      '"PDP-1 Computer" (https://skfb.ly/ouDsH) by eastcoastinteractive is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
  },
  {
    title:
      '1970s: CGI development, Gourad and Phong shading models & bump mapping',
    description:
      'The Utah teacup was created. Henri Gourad and Bui Tuong Phong created the foundations of shading with their respective shading models. Jim Blinn introduced the bump mapping to simulate uneven surfaces.',
    credits:
      '"The Utah Teapot" (https://skfb.ly/BYQA) by 3D graphics 101 is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
  },
  {
    title: '1980s: The golden era of videogames.',
    description:
      'Technology advances led to the 16-bit CPU and the first integrated GPUs, enabling graphics for computer graphics terminals and PCs. Millions of videogame consoles were sold and arcades with 3D graphics popularized.',
    credits:
      '"Pacman Arcade + animation" (https://skfb.ly/Q69O) by Daniel Brück is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
  },
  {
    title: '1990s: Emergence of 3D modeling and CGI & home graphics.',
    description:
      '3D graphics and CGI became highly realistic. OpenGL 1.0 was released in 1992. Pixar released Toy Story in 1995. 3D games became popular, games like Doom and Quake were launched. In 1999, Nvidia launched the first home graphics card.',
    credits:
      '"Woody from Toy Story" (https://skfb.ly/6YOo7) by Qlone is licensed under Creative Commons Attribution-NoDerivs (http://creativecommons.org/licenses/by-nd/4.0/).',
  },
  {
    title: '2000s: Programmable GPU, DirectX & 3D graphics.',
    description:
      '3D graphics became even more realistic and CGI movies bere booming. Home GPUs became more powerful with the Nvidia GeForce graphic cards. Microsoft launched DirectX in 2002.',
    credits:
      '"PS2 Slim low poly" (https://skfb.ly/6X6RH) by alexdperdomo is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
  },
  {
    title: '2010s: Multistage mapping process & shaders.',
    description:
      'Advanced mapping processes now include texture mapping, bump mapping, normal mapping, specular highlights and reflections. Shaders are the norm for any graphics work. The Xbox One and PlayStation 4 are launched. Nvidia graphics card are now able to use raytracing in real-time.',
    credits:
      '"Xbox One" (https://skfb.ly/6DoIy) by mohitpatel4078 is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
  },
]);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Camera
const initialZ = 5;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.z = initialZ;
scene.add(camera);
let controls: any = null;

// Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
hemiLight.position.set(20, 20, 0);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 10, 10);
scene.add(dirLight);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(0, -10, -10);
scene.add(dirLight2);

// Models
const gltfLoader = new GLTFLoader();

museumItems.forEach((item) => {
  gltfLoader.load(item.url, function (gltf) {
    gltf.scene.position.set(
      item.position[0],
      item.position[1],
      item.position[2]
    );

    if (item.scale) {
      gltf.scene.scale.set(item.scale[0], item.scale[1], item.scale[2]);
    }

    if (item.rotate) {
      gltf.scene.rotateX(item.rotate[0]);
      gltf.scene.rotateY(item.rotate[1]);
      gltf.scene.rotateZ(item.rotate[2]);
    }
    scene.add(gltf.scene);
  });
});

function prevItem() {
  if (currentItem.value > 0) {
    currentItem.value--;
    camera.position.set(museumItems[currentItem.value].position[0], 0, 5);
    controls.target.set(museumItems[currentItem.value].position[0], -1, 0);
  }
}

function nextItem() {
  if (currentItem.value < museumItems.length - 1) {
    currentItem.value++;
    camera.position.set(museumItems[currentItem.value].position[0], 0, 5);
    controls.target.set(museumItems[currentItem.value].position[0], -1, 0);
  }
}

function keydownListener(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prevItem();
  else if (e.key === 'ArrowRight') nextItem();
}

function handlePositionChange(e: any) {
  if (e.target) {
    const currentIndex = Math.round(e.target.target.x / 10);
    if (currentIndex >= 0 && currentIndex <= museumItems.length - 1) {
      currentItem.value = currentIndex;
    }
  }
}

const onPositionChange = throttle(handlePositionChange, 250);

function resetCamera() {
  camera.position.set(museumItems[currentItem.value].position[0], 0, 5);
  controls.target.set(museumItems[currentItem.value].position[0], -1, 0);
}

onMounted(() => {
  window.addEventListener('keydown', keydownListener);
  if (museumCanvas.value) {
    const renderer = new THREE.WebGLRenderer({ canvas: museumCanvas.value });
    renderer.setSize(
      museumCanvas.value.clientWidth,
      museumCanvas.value.clientHeight
    );
    controls = new MapControls(camera, renderer.domElement);
    controls.addEventListener('change', onPositionChange);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', keydownListener);
  controls.removeEventListener('change', onPositionChange);
});
</script>

<style scoped>
#museum-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

#item-hero {
  position: absolute;
  padding: 12px;
  top: 24px;
  left: 24px;
  max-width: 300px;
  border-radius: 0.5em;
  background-color: #ececec;
}

#reset-camera-wrapper {
  position: fixed;
  gap: 0 4px;
  z-index: 20;
  bottom: 16px;
  display: flex;
  justify-content: center;
  width: 100%;
}

#reset-camera {
  appearance: none;
  font-family: inherit;
  font-size: medium;
  padding: 0.75em 1.5em;
  color: white;
  background-color: blueviolet;
  border-radius: 0.5em;
  border: none;
  box-shadow: 0.1em;
  cursor: pointer;
  transition: all linear 0.15s;
}

#reset-camera:hover {
  background-color: darkviolet;
}

#reset-camera:focus {
  background-color: purple;
}
</style>
