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
import type { ISelectedFurniture } from "@/interfaces/ISelectedFurniture";
import { calculateCoordinates } from "./calculateCoordinates";

const editorState = inject<IEditorState>(EditorStateKey);
const selectedFurnitureData = inject<Ref<ISelectedFurniture>>(FilenameKey);

// Scope globals
const loadedItems = JSON.parse(localStorage.getItem("savedGlbModels") ?? "[]");
let localStorageData: IGlbData[] = loadedItems ? loadedItems : [];
let rotationMenu = null;

const modelsRight = [];
const modelsLeft = [];

// dd  Load selected furniture
watch(selectedFurnitureData!, (selectedFurniture) => {
    const path = removeBeforeString(selectedFurniture.url);
    let lastAddedModel =
        editorState?.loadedGlbModels[editorState.loadedGlbModels.length - 1];
    editorState?.configuration?.categories?.push(selectedFurniture.category);
    
         if (!editorState || !lastAddedModel) {
            console.error("Selected furniture is undefined");
            return;
         }
    
        const positition = calculateCoordinates(
            editorState,
            selectedFurniture,
            scene,
            lastAddedModel
        );

        if (!positition) {
            console.error("Position is undefined");
            return;
        }

        const category = selectedFurniture.category;
        let latestModel = loadGlb(
            scene,
            path,
            positition,
            category,
            editorState.loadedGlbModels,
            localStorageData
        );

});
const scene = new THREE.Scene();

let camera: THREE.Camera,
    renderer: THREE.Renderer,
    dragControls: DragControls,
    orbitControls: OrbitControls;

// Click selection
//
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
        intializeScene(scene, localStorageData, editorState.loadedGlbModels);
    }

    const canvas = document.querySelector(".canvasDom");
    if (!canvas) {
        throw new Error("Canvas not found");
    }
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
        editorState.loadedGlbModels,
        camera,
        renderer.domElement
    );

    dragControls.addEventListener("drag", onDrag);
    dragControls.addEventListener("dragstart", dragStart);
    dragControls.addEventListener("dragend", dragEnd);
    canvas.addEventListener("mouseup", onMouseClick);

    dragControls.transformGroup = true;

    renderer.setAnimationLoop(animate);
    function animate() {
        renderer.render(scene, camera);
    }
});

function dragStart(event: THREE.Event & { object: THREE.Object3D }) {
    orbitControls.enabled = false;
}

function dragEnd(event: THREE.Event & { object: THREE.Object3D }) {
    orbitControls.enabled = true;
    // console.log("before",localStorageData);
    updateLocalStorage(event.object);
}

function onDrag(event: THREE.Event & { object: THREE.Object3D }) {
    event.object.position.y = 0;
    // Constrain dragging to the floor plane
}

function onMouseClick(event: MouseEvent) {
    if (event.button !== 2) return; // Only proceed if right-click
    console.log(mouse.x, mouse.y);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        console.log("Selected object:", selectedObject.userData.isDraggable);
        // Make sure object is not the floor
        if (selectedObject.userData.isDraggable != false) {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = `${event.clientX}px`;
            div.style.top = `${event.clientY}px`;
            div.style.backgroundColor = "white";
            div.style.border = "1px solid black";
            div.style.padding = "10px";
            div.style.zIndex = "1000";

            const button = document.createElement("button");
            button.innerText = "Rotate";
            button.addEventListener("click", () => {
                selectedObject.rotation.z += Math.PI / 2; // Rotate the object by 45 degrees
                document.body.removeChild(div); // Remove the div after clicking the button
            });

            div.appendChild(button);
            document.body.appendChild(div);
        }
        event.preventDefault(); // Prevent default context menu
    }
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
        localStorage.setItem(
            "savedGlbModels",
            JSON.stringify(localStorageData)
        );
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
