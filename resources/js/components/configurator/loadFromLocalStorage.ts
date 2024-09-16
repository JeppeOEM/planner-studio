import { createRandomString } from "@/utils/createRandomString";
import { saveToLocalStorageArray } from "./saveToLocalStorageArray";
import * as THREE from "three"; // Import the 'THREE' namespace from the 'three' module
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";



export function loadFromLocalStorage(scene: THREE.Scene, url: string) {
    const loader = new GLTFLoader();
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
            x = Math.random() * 10 - 10;
            z = Math.random() * 10 - 10;
            y = 0;
            glb_model.position.set(x, y, z);
            if (!isColliding(glb_model)) {
                scene.add(glb_model);
                addedToScene = true;
                loadedGlbModels.push(glb_model);
                console.log(loadedGlbModels);
                if (loadedGlbModels){

                }
                saveToLocalStorageArray(glb_model, loadedGlbModels); // saveToStorage(loadedGlbModels)
            }
        }

        if (!addedToScene) {
            console.log(
                "Failed to place the model without collision after 20 attempts."
            );
        }
    });
}