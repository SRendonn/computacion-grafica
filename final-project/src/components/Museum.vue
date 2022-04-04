<template>
  <canvas id="museum-canvas" ref="museumCanvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const museumCanvas = ref<null | HTMLCanvasElement>(null);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.z = 10;
scene.add(camera);

// Light
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 10;
scene.add(directionalLight);

// Models
const sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

onMounted(() => {
  if (museumCanvas.value) {
    const renderer = new THREE.WebGLRenderer({ canvas: museumCanvas.value });
    renderer.setSize(
      museumCanvas.value.clientWidth,
      museumCanvas.value.clientHeight
    );
    const controls = new MapControls(camera, renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
});
</script>

<style scoped>
#museum-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
