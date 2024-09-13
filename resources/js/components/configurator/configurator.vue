<template>
    <h2>hej</h2>
    <button @click="loaderglb(scene)">Load GLB Model</button>
    <canvas class="canvasDom"></canvas>
</template>

<script setup>
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { setupLights } from "./lightSetup";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { dragModelListener } from "./dragModelListener";
// const props = defineProps({

//     addFurniture: Object,

// });

const state = reactive({
    firstModel: [],
    latestModel: [],
});

let scene;

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
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    const camera = new THREE.PerspectiveCamera(75, aspect);
    camera.position.z = 0; // Move the camera backward along the z-axis
    camera.position.x = -15; // Move the camera to the left along the x-axis
    camera.position.y = -15;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio); //sets same amount pixels as window
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0); //point its orbitting around
    controls.maxPolarAngle = Math.PI / 2.4; // Restrict the vertical rotation to 90 degrees
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.maxDistance = 80;
    controls.update();

    // Lights
    setupLights(scene);

    // Floor
    let floor = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 0.01, 1000),
        new THREE.MeshBasicMaterial({ color: 0xe5e5e7 })
        // new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    floor.isDraggable = false;
    floor.receiveShadow = false;
    // floor.receiveShadow = true;
    scene.add(floor);
    function updateModel(id, rotY, x, z) {
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
    }
    const raycaster = new THREE.Raycaster();
    let clickMouse = new THREE.Vector2();
    let moveMouse = new THREE.Vector2();

    dragModelListener(
        raycaster,
        clickMouse,
        moveMouse,
        camera,
        scene,
        controls,
        state.latestModel,
        updateModel
    );

    renderer.setAnimationLoop(animate);
    function animate() {
        renderer.render(scene, camera);
    }
});

function loadGLBModel(gltfloader, scene) {
    gltfloader.load(
        "/assets/CORNER LEFT_BLACK_059_VEGA_SAND_DUNE", // Update the path to match your server configuration
        (gltf) => {
            gltf.isDraggable = true;
            const box = new THREE.Box3().setFromObject(glb_model)
            glb_model.userData.boundingBox = box
            scene.add(gltf.scene);
        },
        undefined,
        (error) => {
            console.error("An error happened", error);
        }
    );
}

const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data

function loaderglb(scene) {
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        "assets/CORNER LEFT_BLACK_059_VEGA_SAND_DUNE.glb",
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
        },
        // called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
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
