import * as THREE from 'three';

export function getModelSize(model: THREE.Object3D) {
    
    console.log("boundingBox", model.userData.boundingBox);
    const maxX = model.userData.boundingBox.max.x;
    const minX = model.userData.boundingBox.min.x;
    const maxZ = model.userData.boundingBox.max.z;
    const minZ = model.userData.boundingBox.min.z;
    const len =
        model.userData.boundingBox.max.x -
        model.userData.boundingBox.min.x;
    const width =
        model.userData.boundingBox.max.z -
        model.userData.boundingBox.min.z;

    return { len, width, maxX, minX, maxZ, minZ };
}
