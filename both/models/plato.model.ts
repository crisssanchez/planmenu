import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { CollectionObject } from './collection-object.model';
import { Ingrediente } from './ingrediente.model';


export interface ingredientePlato{
  ingrediente: string,
  cantidad: number,
  medida: string
}

export interface Plato extends CollectionObject{
  nombre: string;
  descripcion?: string;
  dificultad?: string;
  tiempo?: number;
  tipos?: string[];
  momentos?: string[];
  nutrientes: string[];
  temporada?: string[];
  ingredientes?: ingredientePlato [];
  infoNutricional?: {
    calorias?: number;
    proteinas: number,
    carbohidratos: number,
    grasas: number
  }

};
