import { CollectionObject } from './collection-object.model';
import { Ingrediente } from './ingrediente.model';
import { DIFICULTAD } from '../../client/imports/app/data';
import { TIPOPLATO } from '../../client/imports/app/data';
import { MEDIDA } from '../../client/imports/app/data';
import { TEMPORADA } from '../../client/imports/app/data';

export interface Plato extends CollectionObject{
  nombre: string;
  imagen?: string;
  dificultad: DIFICULTAD;
  tiempo: number;
  tipo: TIPOPLATO;
  nutrientes: string[];
  temporada: TEMPORADA[];
  ingredientes?: [
    {
      ingrediente: Ingrediente,
      cantidad: number,
      medida: MEDIDA,
      principal: boolean
  }

  ];
  infoNutricional?: {
    calorias?: number;
    proteinas: number,
    carbohidratos: number,
    grasas: number
  },
  descripcion?: string;
};
