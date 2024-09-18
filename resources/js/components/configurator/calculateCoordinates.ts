import type { IPosition } from "@/interfaces/IPosition";
import type { ISelectedFurniture } from "@/interfaces/ISelectedFurniture";
import { Position } from "@/utils/Position";
import { Object3D, Scene } from "three";

export function calculateCoordinates(
    loadedGlbModels: Object3D[],
    modelToInsert: ISelectedFurniture,
    scene: Scene,
    modelsLeft,
    modelsRight,
    latestAddedModel    ,
    connectionCornerLeft = false
): IPosition {
    const position = new Position();

    if (loadedGlbModels.length === 0) {
        return position;
    }

    if (loadedGlbModels.length > 0) {
        if (modelToInsert.category === "CHAISE RIGHT") {
            console.log("CHAISE RIGHT");
            saveRightCorner(latestAddedModel, modelToInsert.glb_model);
        }
        return position;

        
        function saveLeft(model, glb_model) {
            let positionArr = [];
            const { len, width } = getModelSize(glb_model);
            if (modelsLeft.length === 0) {
                positionArr.push(getModelSize(firstModel[0]));
                positionArr.push(firstModel[0].position);
                glb_model.position.z = positionArr[1].z - positionArr[0].width;
            } else if (modelsLeft.length > 0) {
                const latestAdded = modelsLeft.slice(-1);

                if (latestAdded[0].userData.isCornerConnector) {
                    connectionCornerLeft = true;
                }
                if (connectionCornerLeft) {
                    positionArr.push(getModelSize(latestAdded[0]));
                    positionArr.push(latestAdded[0].position); // x y z
                    glb_model.rotation.y += Math.PI / 2;
                    glb_model.position.x = positionArr[1].x - width;
                    glb_model.position.z = positionArr[1].z;
                } else {
                    positionArr.push(getModelSize(latestAdded[0]));
                    positionArr.push(latestAdded[0].position);
                    glb_model.position.z =
                        positionArr[1].z - positionArr[0].width;
                }
            }

            savePosition(model, glb_model);
        }

        function saveRight(model, glb_model, connector) {
            let sideOrder;
            let positionArr = [];

            if (modelsRight.length === 0) {
                positionArr.push(getModelSize(firstModel[0]));
                positionArr.push(firstModel[0].position);
                glb_model.position.z = positionArr[0].width + positionArr[1].z;
                sideOrder = 0;
            } else if (modelsRight.length > 0) {
                const latestAdded = modelsRight.slice(-1);
                positionArr.push(getModelSize(latestAdded[0])); //width len max, min
                positionArr.push(latestAdded[0].position); // x y z
                glb_model.position.z = positionArr[0].width + positionArr[1].z;

                sideOrder = modelsRight.length + 1;
            }

            savePosition(model, glb_model, sideOrder);
        }

        function getModelSize(model) {
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

        function saveRightCorner(model, glb_model) {
            let radians = Math.PI;
            let positionArr = [];
            if (modelsRight.length === 0) {
                positionArr.push(getModelSize(firstModel[0]));
                positionArr.push(firstModel[0].position);
                glb_model.rotation.y -= radians;
                glb_model.position.z = positionArr[0].width + positionArr[1].z;
                glb_model.position.x = -positionArr[0].maxX;
            } else if (modelsRight.length > 0) {
                const latestAdded = modelsRight.slice(-1);
                positionArr.push(getModelSize(latestAdded[0]));
                positionArr.push(latestAdded[0].position);
                glb_model.rotation.y -= radians;
                glb_model.position.z = positionArr[0].width + positionArr[1].z;
                glb_model.position.x = -positionArr[0].maxX;
            }

            savePosition(model, glb_model);
        }

        function saveLeftCorner(model, glb_model) {
            // let radians = Math.PI;
            let positionArr = [];
            if (modelsLeft.length === 0) {
                positionArr.push(getModelSize(firstModel[0]));
                positionArr.push(firstModel[0].position);
                glb_model.position.z = positionArr[1].z - positionArr[0].width;
                // glb_model.rotation.y -= radians;
                glb_model.position.x = positionArr[0].minX;
            } else if (modelsLeft.length > 0) {
                const latestAdded = modelsLeft.slice(-1);
                positionArr.push(getModelSize(latestAdded[0]));
                positionArr.push(latestAdded[0].position);
                glb_model.position.z = positionArr[1].z - positionArr[0].width;

                glb_model.position.x = -positionArr[0].minX;
            }

            savePosition(model, glb_model);
        }

        function getModelsFromScene() {
            return scene.children.filter((child) => child.userData.isDraggable);
        }

        function getPos() {
            let children = getModelsFromScene();
            let furthestLeftModel = null;
            let furthestRightModel = null;
            let rightPos = {};
            let leftPos = {};
            let leftDiemensions = {};
            let rightDimensions = {};
            console.log("children get pos", children);
            children.forEach((child) => {
                console.log("child get pos", child.userData);
                const { len, width, maxX, minX, maxZ, minZ } =
                    getModelSize(child);
                const { x, y, z } = child.position;

                // Check if model is the furthest to the left
                if (
                    furthestLeftModel === null ||
                    x < furthestLeftModel.position.x
                ) {
                    furthestLeftModel = child;
                    leftDiemensions = { len, width, maxX, minX, maxZ, minZ };
                    leftPos = { x, y, z };
                }

                // Check if model is the furthest to the right
                if (
                    furthestRightModel === null ||
                    x > furthestRightModel.position.x
                ) {
                    furthestRightModel = child;
                    rightDimensions = { len, width, maxX, minX, maxZ, minZ };
                    rightPos = { x, y, z };
                }
            });
            console.log("Furthest Left Model:", furthestLeftModel.position);
            // console.log('Furthest Left postion:', leftPos)
            // console.log('Furthest Left Dimensions:', leftDiemensions)
            // console.log('Furthest Right Model:', furthestRightModel)
            // console.log('Furthest Right position:', rightPos)
            // console.log('Furthest Right dimensions:', rightDimensions)
            return furthestLeftModel;
            // Check if model is the furthest to the left
        }

        function savePosition(model, glb_model, sideOrder = "") {
            console.log(sideOrder);
            const z = glb_model.position.z;
            const x = glb_model.position.x;
            const y = glb_model.position.y;
            const rotY = glb_model.rotation.y;
            model.position.z = z;
            model.position.x = x;
            model.position.y = y;
            model.rotation.y = rotY;
        }
    }
}
