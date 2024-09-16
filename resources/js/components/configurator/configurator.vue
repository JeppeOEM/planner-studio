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

const editorState = inject<IEditorState>(EditorStateKey);

const filePath = inject<Ref<string>>(FilenameKey);

// Load selected furniture
watch(filePath, (newFilePath) => {
    const path = removeBeforeString(newFilePath);
    console.log("Insert this url:", path);
    loadGlb(scene, path);
});

const scene = new THREE.Scene();
let loadedGlbModels = editorState.loadedGlbModels;
let localStorageGlbData: IGlbData[] = [];

let camera, renderer, dragControls, orbitControls;

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



function saveToLocalStorageArray(
    localStorageArray: IGlbData[],
    model: THREE.Object3D
) {
    localStorageArray.push({
        position: {x: model.position.x, y: model.position.y, z: model.position.z},
        url: model.userData.url,
        identifier: model.userData.identifer,
    });
}


function dragStart(event: THREE.Event) {
    orbitControls.enabled = false;
}

function dragEnd(event: THREE.Event) {
    
    updateLocalStorage(event.object);

}

function onDrag(event: THREE.Event) {
    event.object.position.y = 0; // Constrain dragging to the floor plane
}

function updateLocalStorage(draggedModel: THREE.Object3D) {
    const identifier = draggedModel.userData.identifer
    const savedModels = JSON.parse(localStorage.getItem("savedGlbModels"));
    const model = savedModels.find(
        (model: any) => model.identifier === identifier
    );
    if (model) {
        console.log(model)
        model.postion.y = draggedModel.position.y;
        model.position.x = draggedModel.position.x; 
        model.position.z = 0
        localStorage.setItem("canvasData", JSON.stringify(localStorageGlbData));
    } else {
        console.log("Model not found");
    }
}

function loadGlb(scene: THREE.Scene, url: string) {
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );
    const loader = new GLTFLoader();
    // Load a glTF resource
    function isColliding(glb_model: THREE.Object3D) {
        const box = new THREE.Box3().setFromObject(glb_model);
        for (const child of scene.children) {
            if (child.userData.isDraggable) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (box.intersectsBox(childBox)) {
                    return true;
                }
            }
        }
        return false;
    }
    loader.load(url, function (gltf) {
        const glb_model = gltf.scene;
        glb_model.userData.isDraggable = true;
        glb_model.userData.url = url;
        glb_model.userData.identifier = createRandomString(20);
        const box = new THREE.Box3().setFromObject(glb_model);
        glb_model.userData.boundingBox = box;

        const maxAttempts = 20;
        let x, y, z;
        let addedToScene = false;

        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            x = Math.random() * 20 - 20;
            y = Math.random() * 20 - 20;
            z = 0;
            glb_model.position.set(x, y, z);
            if (!isColliding(glb_model)) {
                scene.add(glb_model);
                addedToScene = true;
                loadedGlbModels.push(glb_model);
                console.log(loadedGlbModels);
                saveToLocalStorageArray(localStorageGlbData, glb_model); // saveToStorage(loadedGlbModels)
            }
        }

        if (!addedToScene) {
            console.log(
                "Failed to place the model without collision after 20 attempts."
            );
        }
    });
}
</script>

<style scoped>
.canvasDom {
    width: 100vw;
    height: 100vh;
    z-index: 0;
}
</style>

<!-- function updateModel(id, rotY, x, z) {
    const proxyObject = configurationObj.models;
    let modelToUpdate;

    const models = toRaw(proxyObject);
    modelToUpdate = Object.keys(models)
        .map((key) => models[key])
        .find((obj) => obj && obj.idString === id);

    if (modelToUpdate) {
        modelToUpdate.rotation.y = rotY;
        modelToUpdate.position.x = x;
        modelToUpdate.position.z = z;
    }
    // this.$emit('updateConfiguration', configurationObj)
} -->
