import { Plato } from './plato.model';
import { CollectionObject } from './collection-object.model';

export interface Menu {
  _id?: string,
  inicio: Date,
  fin: Date,
  numero: number,
  owner: string,
  dieta: Dieta[]
}

export interface Dieta{
  fecha: Date,
  almuerzo?: Plato[],
  cena?: Plato[],
  infoNutricional?: {
    proteinas: number,
    carbohidratos: number,
    verduras: number,
    fritos:number
  }
}
