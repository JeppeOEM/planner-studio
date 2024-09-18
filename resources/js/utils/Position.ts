export interface IPosition {
    x: number;
    y: number;
    z: number;
    rotY: number;
}

export class Position implements IPosition {
    x: number;
    y: number;
    z: number;
    rotY: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, rotY: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotY = rotY;
    }
}