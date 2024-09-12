<template>
    <h2>hej</h2>

    <canvas class="canvasDom"></canvas>
</template>

<script setup>
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onMounted, reactive } from "vue";
import { setupLights } from "./lightSetup";

const props = defineProps({
    // sessionData: Object,
    // position: Object,
    addFurniture: Object,
    // color: String,
    // type: String,
});

// Reactive state
const isVisible = ref(false);
const modelsLeft = ref([]);
const modelsRight = ref([]);
const firstModel = ref([]);
const connectionCornerLeft = ref(false);
const latestModel = ref([]);
// Using the reactive instead of ref when working with objects
const configurationObj = reactive({
    models: [],
    componentIds: [],
});

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
    const scene = new THREE.Scene();
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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    renderer.setAnimationLoop(animate);
    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
});
</script>

<style scoped>
.canvasDom {
    width: 100vw;
    height: 100vh;
    z-index: 0;
}
</style>
