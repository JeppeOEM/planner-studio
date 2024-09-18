import type { IPosition } from "@/interfaces/IPosition";
import type { ISelectedFurniture } from "@/interfaces/ISelectedFurniture";
import type { Object3D } from "three";

export  function calculateCoordinates(loadedGlbModels: Object3D[], modelToInsert: ISelectedFurniture){
        const position: IPosition = { x: 0, y: 0, z: 0 }
    
        if (loadedGlbModels.length === 0){
            return position
        }

        if (loadedGlbModels.length > 0){

                     
        }
}       