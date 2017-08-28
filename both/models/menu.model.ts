import { Plato } from './plato.model';
import { CollectionObject } from './collection-object.model';

export interface Menu {
  _id?: string;
  numero: number;
  owner: string;
  dieta: Dieta[];
}

export interface Dieta{
  fecha: Date ;
  almuerzo?: Plato[];
  cena?: Plato[];
  infoNutricional?: {
    calorias?: number;
    proteinas: number,
    carbohidratos: number,
    grasas: number
  }
}
