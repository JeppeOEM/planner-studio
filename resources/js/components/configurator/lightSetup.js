import * as THREE from 'three';

export function setupLights(scene) {

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1) // Color: white, Intensity: 0.5
scene.add(ambientLight)

const dimIntensity = 1.5 // Adjust the intensity to control the dimness


// Light 1
const directionalLight1 = new THREE.DirectionalLight(
    0xffffff,
    dimIntensity
)
directionalLight1.position.set(200, 10, 0)
directionalLight1.target.position.set(0, 0, 0) // Set the target position to the center of the scene
scene.add(directionalLight1)

// Light 2
const directionalLight2 = new THREE.DirectionalLight(
    0xffffff,
    dimIntensity
)
directionalLight2.position.set(0, 10, 200)
directionalLight2.target.position.set(0, 0, 0)
scene.add(directionalLight2)

// Light 3
const directionalLight3 = new THREE.DirectionalLight(
    0xffffff,
    dimIntensity
)
directionalLight3.position.set(-200, 10, 0)
directionalLight3.target.position.set(0, 0, 0)
scene.add(directionalLight3)

// Light 4
const directionalLight4 = new THREE.DirectionalLight(
    0xffffff,
    dimIntensity
)
directionalLight4.position.set(0, 10, -200)
directionalLight4.target.position.set(0, 0, 0)
scene.add(directionalLight4)

// Light 5
const directionalLight5 = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight5.position.set(0, 11100, 0) // Positioned above the floor
directionalLight5.target.position.set(0, 0, 0)
scene.add(directionalLight5)

}