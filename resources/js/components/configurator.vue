<template>
    <h2>hej</h2>

    <canvas class="canvasDom"></canvas>
</template>

<script setup>
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { ref, onMounted } from "vue";
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Color: white, Intensity: 0.5
    scene.add(ambientLight);

    const dimIntensity = 1.5; // Adjust the intensity to control the dimness

    // Light 1
    const directionalLight1 = new THREE.DirectionalLight(
        0xffffff,
        dimIntensity
    );
    directionalLight1.position.set(200, 10, 0);
    directionalLight1.target.position.set(0, 0, 0); // Set the target position to the center of the scene
    scene.add(directionalLight1);
    renderer.setAnimationLoop(animate);
    // document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

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
