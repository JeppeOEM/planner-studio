import type { IGlbData } from '@/interfaces/IGlbData';
import type { IPosition } from '@/interfaces/IPosition';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export class GlbLoader {
    private scene: THREE.Scene;
    private loadedGlbModels: THREE.Object3D[];
    private shouldPushModels: boolean;
    private localStorageData: IGlbData[];

    constructor(scene: THREE.Scene, loadedGlbModels: THREE.Object3D[], shouldPushModels: boolean) {
        this.scene = scene;
        this.loadedGlbModels = loadedGlbModels;
        this.shouldPushModels = shouldPushModels;
        this.localStorageData = [];
    }

    private isColliding(glb_model: THREE.Object3D): boolean {
        const box = new THREE.Box3().setFromObject(glb_model);
        for (const child of this.scene.children) {
            if (child.userData.isDraggable) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (box.intersectsBox(childBox)) {
                    return true;
                }
            }
        }
        return false;
    }

    public saveToLocalStorageArray(model: THREE.Object3D, localStorageGlbData: IGlbData[]): void {
        console.log(localStorageGlbData, model, "saveToLocalStorageArray");
        localStorageGlbData.push({
            position: {
                x: model.position.x,
                y: model.position.y,
                z: model.position.z,
            },
            url: model.userData.url,
            identifier: model.userData.identifier,
        });
        localStorage.setItem('savedGlbModels', JSON.stringify(localStorageGlbData));
    }

    public loadGlb(url: string): void {
        const loader = new GLTFLoader();

        const onLoad = (gltf: any) => {
            const glb_model = gltf.scene;
            glb_model.userData.isDraggable = true;
            glb_model.userData.url = url;
            glb_model.userData.identifier = this.createRandomString(20);
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
                if (!this.isColliding(glb_model)) {
                    this.scene.add(glb_model);
                    addedToScene = true;
                    if (this.shouldPushModels) {
                        this.loadedGlbModels.push(glb_model);
                    }
                    console.log(this.loadedGlbModels);
                    this.saveToLocalStorageArray(glb_model, this.localStorageData);
                    break;
                }
            }

            if (!addedToScene) {
                console.log("Failed to place the model without collision after 20 attempts.");
            }
        };

        const onProgress = (xhr: ProgressEvent) => {
            if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(`Model ${url} is ${percentComplete.toFixed(2)}% loaded.`);
            }
        };

        const onError = (error: any) => {
            console.log("An error happened during loading", error);
        };

        try {
            loader.load(url, onLoad, onProgress, onError);
        } catch (error) {
            console.log("An error happened", error);
        }
    }

    private createRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}