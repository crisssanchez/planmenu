import { Plato } from './plato.model';
import { CollectionObject } from './collection-object.model';

export interface Menu extends CollectionObject{
  owner: string;
  dieta: Dieta[];
}

export interface Dieta{
  fecha: Date;
  almuerzo?: Plato[];
  cena?: Plato[];
  infoNutricional?: {
    calorias?: number;
    proteinas: number,
    carbohidratos: number,
    grasas: number
  }
}
