import * as THREE from 'three'


export function saveToLocalStorageArray(model: THREE.Object3D, localStorageGlbData) {
    console.log(localStorageGlbData, model, "saveToLocalStorageArray");
    localStorageGlbData.push({
        position: {
            x: model.position.x,
            y: model.position.y,
            z: model.position.z,
        },
        url: model.userData.url,
        identifier: model.userData.identifer,
    });
    localStorage.setItem('savedGlbModels', JSON.stringify(localStorageGlbData))
}