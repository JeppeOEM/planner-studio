import type { IFurniture } from './IFurniture'; // Import the Model type from its file

export interface IConfiguration {
  models: IFurniture[];
  componentIds: string[];
}