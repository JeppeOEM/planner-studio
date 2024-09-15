<template>
    <canvas class="canvasDom"></canvas>
    <button
        class="absolute top-4 left-4 bg-blue-500 text-white py-2 px-4 rounded"
        @click="loaderglb(scene)"
    >
        Load GLB Model
    </button>
</template>

<script setup lang="ts">
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onMounted, inject } from "vue";
import { setupLights } from "./lightSetup";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { dragModelListener } from "./dragModelListener";
import { DragControls } from 'three/addons/controls/DragControls.js';
import type { IEditorState } from '@/interfaces/IEditorState';



const state = inject<IEditorState>('editorState');

const scene = new THREE.Scene();
let loadedGlbModels = state.loadedGlbModels


let camera, renderer, dragControls;

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
// Selection


onMounted(() => {
    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
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
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0); //point of orbit
    controls.maxPolarAngle = Math.PI / 2.4; // Restrict the vertical rotation to 90 degrees
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.maxDistance = 80;
    controls.update();

    // Lights
    setupLights(scene);

    renderer.setAnimationLoop(animate);
    function animate() {
        renderer.render(scene, camera);
    }
});

// Optional: Provide a DRACOLoader instance to decode compressed mesh data

function onDrag(event) {

};

function dragEnd(){

}

function dragStart() {

}

    
function loaderglb(scene: THREE.Scene) {

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
    loader.load(
        "assets/CORNER LEFT_BLACK_059_VEGA_SAND_DUNE.glb",
        function (gltf) {
            const glb_model = gltf.scene;
            glb_model.userData.isDraggable = true;
            const box = new THREE.Box3().setFromObject(glb_model);
            glb_model.userData.boundingBox = box;

            const maxAttempts = 20;
            let posX, posZ;
            let addedToScene = false;

            for (let attempts = 0; attempts < maxAttempts; attempts++) {
                posX = Math.random() * 2 - 2; // Random value between -15 and 15
                posZ = Math.random() * 2 - 2; // Random value between -15 and 15
                const posY = 0;
                glb_model.position.set(posX, posY, posZ);
                if (!isColliding(glb_model)) {
                    scene.add(glb_model);
                    addedToScene = true;
                    loadedGlbModels.push(glb_model)
                    dragControls = new DragControls(
                        loadedGlbModels,
                        camera,
                        renderer.domElement
                    );

                    dragControls.addEventListener('drag', onDrag);
                    dragControls.addEventListener("dragstart", dragStart);

                    dragControls.addEventListener("dragend", dragEnd);
                    console.log(loadedGlbModels)
                    break;
                }
            }

            if (!addedToScene) {
                console.log(
                    "Failed to place the model without collision after 20 attempts."
                );
            }
        },

        function (error) {
            console.log("An error happened");
        }
    );
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