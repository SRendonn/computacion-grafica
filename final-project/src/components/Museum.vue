<template>
  <div style="width: 100%; height: 100%" @click="">
    <canvas id="museum-canvas" ref="museumCanvas"></canvas>
    <div id="item-hero">
      <h1>
        {{ museumItemDescriptions[currentItem].title }}
      </h1>
      <p>{{ museumItemDescriptions[currentItem].description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import rtxUrl from '@/assets/rtx/scene.gltf';
import { throttle } from 'lodash-es';
import { Vector3 } from 'three';

const museumCanvas = ref<null | HTMLCanvasElement>(null);

const currentItem = ref(0);
const museumItems = [
  {
    position: [10, -1, 0],
    url: rtxUrl,
    scale: [1, 1, 1],
  },
  {
    position: [10, -1, 0],
    url: rtxUrl,
    scale: [1, 1, 1],
  },
  {
    position: [20, -1, 0],
    url: rtxUrl,
    scale: [1, 1, 1],
  },
];

const museumItemDescriptions = ref([
  {
    title: '2000s: Programmable GPU, CGI & 3D graphics.',
    description: 'Virtually any home computer is able to create graphics.',
    credits:
      '"PlayStation 2" (https://skfb.ly/outMz) by Artem P is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
  },
  {
    title: '2010s: Multistage mapping process & shaders.',
    description: 'Virtually any home computer is able to create graphics.',
    credits: '',
  },
  {
    title: '2020s: RTX 3090',
    description: 'En 2020, NVIDIA reveló su nueva generación de tarjetas RTX.',
    credits: '',
  },
]);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.z = 5;
scene.add(camera);
let controls: any = null;

// Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 20, 0);
scene.add(dirLight);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(0, -20, 10);
scene.add(dirLight2);

// Models
const loader = new GLTFLoader();

museumItems.forEach((item) => {
  loader.load(item.url, function (gltf) {
    gltf.scene.position.set(
      item.position[0],
      item.position[1],
      item.position[2]
    );
    gltf.scene.scale.set(item.scale[0], item.scale[1], item.scale[2]);
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

const onPositionChange = throttle(handlePositionChange, 1000);

function handlePositionChange(e: any) {
  const currentIndex = Math.round(e.target.target.x / 10);
  if (currentIndex >= 0 && currentIndex <= museumItems.length - 1) {
    currentItem.value = currentIndex;
  }
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
  padding: 8px;
  top: 24px;
  left: 24px;
  max-width: 300px;
  border-radius: 0.5em;
  background-color: #ececec;
}
</style>
