<template>
    <div class="containerCanvas">
        <canvas class="draw"></canvas>
    </div>
</template>

<script setup>
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const gltfloader = new GLTFLoader();
const canvas = document.querySelector(".draw");
let width = canvas.clientWidth;
let height = canvas.clientHeight;
let aspect = width / height;

function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}
</script>
