import * as THREE from 'three';
import type { IConfiguration } from './IConfiguration'


export interface IEditorState {
  loadedGlbModels: THREE.Object3D[];
  configuration: IConfiguration;
}