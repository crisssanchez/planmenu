import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { CollectionObject } from './collection-object.model';

export interface Plato extends CollectionObject{
  nombre: string,
  imagenUrl?: string,
  descripcion?: string,
  dificultad?: string, // BAJA, MEDIA, ALTA
  tiempo?: number, // En minutos
  tipos?: string[], // PRIMERO, SEGUNDO
  momentos?: string[], // ALMUERZO, CENA
  nutrientes: string[], // De la base de datos
  temporada?: string[], // PRIMAVERA, VERANO, OTOÑO INVIERNO
  ingredientes: string[],
  infoNutricional?: { 
    calorias?: number,
    proteinas: number,
    carbohidratos: number,
    grasas: number
  }

};
