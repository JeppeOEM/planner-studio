<template>
    <canvas class="canvasDom"></canvas>
</template>

<script setup lang="ts">
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onUnmounted, onMounted, inject, watch } from "vue";
import type { Ref } from "vue";
import { setupLights } from "./lightSetup";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import type { IEditorState } from "@/interfaces/IEditorState";
import { FilenameKey, EditorStateKey } from "@/injection/injectionKeys";
import { removeBeforeString } from "@/utils/removeBeforeString";
import { createRandomString } from "@/utils/createRandomString";
import type { IGlbData } from "@/interfaces/IGlbData";
import { intializeScene } from "./initializeScene";
import { loadGlb } from "./loadGlb";

const editorState = inject<IEditorState>(EditorStateKey);

const filePath = inject<Ref<string>>(FilenameKey);

// Load selected furniture
watch(filePath, (newFilePath) => {
    const path = removeBeforeString(newFilePath);
    console.log("Insert this url:", path);
    loadGlb(scene, path, loadedGlbModels, localStorageData );
});

const scene = new THREE.Scene();
let loadedGlbModels = editorState.loadedGlbModels;

const loadedItems = JSON.parse(localStorage.getItem("savedGlbModels"));

let localStorageData: IGlbData[] = loadedItems ? loadedItems : []

let camera, renderer, dragControls, orbitControls;

//Scene
scene.background = new THREE.Color(0xf8f8f8);
let floor = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.01, 100),
    new THREE.MeshBasicMaterial({ color: 0xe5e5e7 })
    // new THREE.MeshBasicMaterial({ color: 0xffffff })
);
// Floor
floor.userData.isDraggable = false;
floor.receiveShadow = false;
// floor.receiveShadow = true;
scene.add(floor);
onMounted(() => {
    if (localStorageData) {
        intializeScene(scene, localStorageData, loadedGlbModels);
    }

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



function dragStart(event: DragControls) {
    orbitControls.enabled = false;
    
}

function dragEnd(event: DragControls) {
    orbitControls.enabled = true;
    // console.log("before",localStorageData);
    updateLocalStorage(event.object);
}

function onDrag(event: DragControls) {
    event.object.position.y = 0;
    // Constrain dragging to the floor plane
}

function updateLocalStorage(draggedModel: THREE.Object3D) {
    console.log(draggedModel, "draggedModel");
    const identifier = draggedModel.userData.identifier;
    console.log(localStorageData);
    const model = localStorageData.find(
        (model: any) => model.identifier === identifier
    );
    console.log(model, "found");
    if (model) {
        console.log(model.position.z, draggedModel.position.z, "Z");
        console.log(model.position.x, draggedModel.position.x, "X");
        console.log(
            model,
            "updating the model",
            model.position.z,
            draggedModel.position.z
        );
        model.position.z = draggedModel.position.z;
        model.position.x = draggedModel.position.x;
        model.position.y = 0;
        console.log(model.position.x, model.position.z);
        localStorage.setItem("savedGlbModels", JSON.stringify(localStorageData));
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
