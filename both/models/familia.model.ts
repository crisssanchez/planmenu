import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { CollectionObject } from './collection-object.model';

export interface Familia extends CollectionObject {

  email: string,
  nombre: string,
  apellidos?: string,
  miembros?: number,
  dificultad?: string,// BAJA, MEDIA, ALTA
  tiempo?: number, // En minutos
  comienzo?: string, // LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO
  gustos_nutrientes?: {
    id_nutriente: string,
    valor:number //-1,0,1
  }[],
  gustos_ingredientes?: {
    id_ingrediente: string,
    nombre_ingrediente: string,
    valor: number
  }[],
  gustos_platos?: {
    id_plato: string,
    nombre_plato: string,
    valor: number
  }[],
  cambios_platos?: {
    id_origen: string,
    nombre_origen: string,
    id_destino: string,
    nombre_destino: string,
    motivo_cambio: {
      motivo: number,
      ingredientes?: string[]
    }
  }[],
  aviso: number; //(0 semanal, 1 diario)

};
