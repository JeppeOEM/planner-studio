<template>
    <canvas class="canvasDom"></canvas>
</template>

<script setup lang="ts">
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onUnmounted, onMounted, inject, watch } from "vue";
import type { Ref } from "vue";
import { setupLights } from "./lightSetup";
import { DragControls } from "three/addons/controls/DragControls.js";
import type { IEditorState } from "@/interfaces/IEditorState";
import { FilenameKey, EditorStateKey } from "@/injection/injectionKeys";
import { removeBeforeString } from "@/utils/removeBeforeString";
import type { IGlbData } from "@/interfaces/IGlbData";
import { GlbLoader } from "./GlbLoader";

const editorState = inject<IEditorState>(EditorStateKey);
const filePath = inject<Ref<string>>(FilenameKey);
const scene = new THREE.Scene();
let loadedGlbModels = editorState.loadedGlbModels;
let localStorageGlbData: IGlbData[] = [];
let camera, renderer, dragControls, orbitControls;

// Passing a boolean to tell the class to save to localStorage
const loadGlb = new GlbLoader(scene, loadedGlbModels, true);

// Load selected furniture
watch(filePath, (newFilePath) => {
    const path = removeBeforeString(newFilePath);
    console.log("Insert this url:", path);
});



//Scene
scene.background = new THREE.Color(0xf8f8f8);
let floor = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 0.01, 1000),
    new THREE.MeshBasicMaterial({ color: 0xe5e5e7 })
    // new THREE.MeshBasicMaterial({ color: 0xffffff })
);
// Floor
floor.userData.isDraggable = false;
floor.receiveShadow = false;
// floor.receiveShadow = true;
scene.add(floor);
onMounted(() => {
    let m = JSON.parse(localStorage.getItem("savedGlbModels"));
    console.log(m);

    const canvas = document.querySelector(".canvasDom");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let aspect = width / height;

    // Camera
    camera = new THREE.PerspectiveCamera(75, aspect);
    camera.position.z = 0;
    camera.position.x = -15; // Move the camera to the left along the x-axis
    camera.position.y = -15;
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio); //sets same amount pixels as window
    renderer.setSize(width, height);

    // OrbitControls
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0.8, 0); //point of orbit
    orbitControls.maxPolarAngle = Math.PI / 2.4; // Restrict the vertical rotation to 90 degrees
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.15;
    orbitControls.maxDistance = 80;
    orbitControls.update();

    // Lights
    setupLights(scene);

    // DragControls
    dragControls = new DragControls(
        loadedGlbModels,
        camera,
        renderer.domElement
    );

    dragControls.addEventListener("drag", onDrag);
    dragControls.addEventListener("dragstart", dragStart);
    dragControls.addEventListener("dragend", dragEnd);
    dragControls.transformGroup = true;

    renderer.setAnimationLoop(animate);
    function animate() {
        renderer.render(scene, camera);
    }
});



function dragStart(event: DragControls) : void {
    orbitControls.enabled = false;
}

function dragEnd(event: DragControls) : void {
    updateLocalStorage(event.object);
}

function onDrag(event: DragControls) : void {
    event.object.position.y = 0; // Constrain dragging to the floor plane
}

function updateLocalStorage(draggedModel: THREE.Object3D) : void {
    const identifier = draggedModel.userData.identifer;
    const savedModels = JSON.parse(localStorage.getItem("savedGlbModels"));
    const model = savedModels.find(
        (model: any) => model.identifier === identifier
    );
    if (model) {
        console.log(model);
        model.postion.z = draggedModel.position.z;
        model.position.x = draggedModel.position.x;
        model.position.y = 0;
        localStorage.setItem("canvasData", JSON.stringify(localStorageGlbData));
    } else {
        console.log("Model not found");
    }
}


</script>

<style scoped>
.canvasDom {
    width: 100vw;
    height: 100vh;
    z-index: 0;
}
</style>
