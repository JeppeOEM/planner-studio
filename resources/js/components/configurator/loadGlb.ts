import type { IGlbData } from "@/interfaces/IGlbData";
import type { IPosition } from "@/interfaces/IPosition";
import { createRandomString } from "@/utils/createRandomString";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadGlb(
    scene: THREE.Scene,
    url: string,
    position: IPosition,
    category: string,
    loadedGlbModels: THREE.Object3D[],
    localStorageData: IGlbData[]
) {
    const loader = new GLTFLoader();        
    // Load a glTF resource
   
        loader.load(url, function (gltf) {
            const glb_model = gltf.scene;
            glb_model.userData.isDraggable = true;
            glb_model.userData.category = category;
            glb_model.userData.url = url;   
            glb_model.userData.identifier = createRandomString(20);
            const box = new THREE.Box3().setFromObject(glb_model);
            glb_model.userData.boundingBox = box;

            const maxAttempts = 20;
            let x, y, z, rotY;
            let addedToScene = false;

            for (let attempts = 0; attempts < maxAttempts; attempts++) {
                // x = Math.random() * 10;
                // z = Math.random() * 10;
                // y = 0;
                    x = position.x;
                    z = position.z;
                    y = 0;
                    rotY = position.rotY;

                glb_model.position.set(x, y, z);
                glb_model.rotation.y = rotY;
                if (!isColliding(scene, glb_model)) {
                    scene.add(glb_model);
                    addedToScene = true;
                    loadedGlbModels.push(glb_model);

                    console.log(loadedGlbModels);
                    saveToLocalStorageArray(localStorageData, glb_model); // saveToStorage(loadedGlbModels)
                    return glb_model;       
                }
            }

            if (!addedToScene) {
                console.log(
                    "Failed to place the model without collision after 20 attempts."
                );
            }
        });



        function saveToLocalStorageArray(
            localStorageData: IGlbData[],
            model: THREE.Object3D
        ) {
            localStorageData.push({
                position: {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z,
                    rotY: model.rotation.y,
                },
                url: model.userData.url,
                identifier: model.userData.identifier,
            });
            console.log(localStorageData, "localStorageData saved");
            localStorage.setItem(
                "savedGlbModels",
                JSON.stringify(localStorageData)
            );
        }
    }

 function isColliding(scene: THREE.Scene, glb_model: THREE.Object3D) {
        const box = new THREE.Box3().setFromObject(glb_model);
        for (const child of scene.children) {
            if (child.userData.isDraggable) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (box.intersectsBox(childBox)) {
                    return true;
                }
            }
            return false;
        }
    }