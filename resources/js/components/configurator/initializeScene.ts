import type { IGlbData } from '@/interfaces/IGlbData';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export function intializeScene(scene: THREE.Scene, localStorageArray: IGlbData[], loadedGlbModels: THREE.Object3D[]) {
    const loader = new GLTFLoader();
    // Load a glTF resource

    localStorageArray.forEach((savedModel) => {
        loader.load(savedModel.url, function (gltf) {
            const glb_model = gltf.scene;
            glb_model.userData.isDraggable = true;
            glb_model.userData.url = savedModel.url;
            glb_model.userData.identifier = savedModel.identifier;
            const box = new THREE.Box3().setFromObject(glb_model);
            glb_model.userData.boundingBox = box;
            const x = savedModel.position.x;
            const z = savedModel.position.z;
            const y = 0;
            glb_model.position.set(x, y, z);
            scene.add(glb_model);
            loadedGlbModels.push(glb_model);
            console.log(loadedGlbModels);
        });
    });
}

