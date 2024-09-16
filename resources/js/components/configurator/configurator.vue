<template>
    <canvas class="canvasDom"></canvas>
    <!-- <button
        class="absolute top-4 left-4 bg-blue-500 text-white py-2 px-4 rounded"
        @click="loadGlb(scene)"
    >
        Load GLB Model
    </button> -->
</template>

<script setup lang="ts">
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onMounted, inject, watch } from "vue";
import type { Ref } from "vue";
import { setupLights } from "./lightSetup";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { dragModelListener } from "./dragModelListener";
import { DragControls } from "three/addons/controls/DragControls.js";
import type { IEditorState } from "@/interfaces/IEditorState";
import { FilenameKey, EditorStateKey } from "@/injection/injectionKeys";

const editorState = inject<IEditorState>(EditorStateKey);

const filePath = inject<Ref<string>>(FilenameKey);

// Load selected furniture
watch(filePath, (newFilePath) => {
    console.log("Insert this url:", newFilePath);
    loadGlb(scene, newFilePath);
});

const scene = new THREE.Scene();
let loadedGlbModels = editorState.loadedGlbModels;

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
    // function onWindowResize() {
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    // }

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
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0.8, 0); //point of orbit
    orbitControls.maxPolarAngle = Math.PI / 2.4; // Restrict the vertical rotation to 90 degrees
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.15;
    orbitControls.maxDistance = 80;
    orbitControls.update();

    // Lights
    setupLights(scene);

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

function dragStart(event: THREE.Event) {
    orbitControls.enabled = false;
}

function dragEnd(event: THREE.Event) {
    orbitControls.enabled = true;
}

function onDrag(event: THREE.Event) {
    console.log(event.object);
    const object = event.object as THREE.Object3D;
    object.position.y = 0; // Constrain dragging to the floor plane
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
    loader.load(
        url,
        function (gltf) {
            const glb_model = gltf.scene;
            glb_model.userData.isDraggable = true;
            const box = new THREE.Box3().setFromObject(glb_model);
            glb_model.userData.boundingBox = box;

            const maxAttempts = 20;
            let posX, posZ;
            let addedToScene = false;

            for (let attempts = 0; attempts < maxAttempts; attempts++) {
                posX = Math.random() * 20 - 20;
                posZ = Math.random() * 20 - 20;
                const posY = 0;
                glb_model.position.set(posX, posY, posZ);
                if (!isColliding(glb_model)) {
                    scene.add(glb_model);
                    addedToScene = true;
                    loadedGlbModels.push(glb_model);

                    console.log(loadedGlbModels);
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
