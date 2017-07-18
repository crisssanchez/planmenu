import { CollectionObject } from './collection-object.model';
import { Ingrediente } from './ingrediente.model';
import { Dificultad } from '../../client/imports/app/data';
import { TipoPlato } from '../../client/imports/app/data';
import { Medida } from '../../client/imports/app/data';
import { Temporada } from '../../client/imports/app/data';

export interface Plato extends CollectionObject{
  nombre: string;
  imagen?: string;
  dificultad: Dificultad;
  tiempo: number;
  tipo: TipoPlato;
  nutrientes: string[];
  temporada: Temporada[];
  ingredientes?: [
    {
      ingrediente: Ingrediente,
      cantidad: number,
      medida: Medida,
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
