import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { CollectionObject } from './collection-object.model';

export interface Familia extends CollectionObject {

  emails: string,
  nombre: string;
  apellidos?: string;
  miembros?: number;
  dificultad?: string; // BAJA, MEDIA, ALTA
  tiempo?: number; // En minutos
  comienzo?: string; // LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO
  gustos_ingredientes?: {
    id_ingrediente: string,
    nombre_ingrediente: string,
    gusto_ingrediente: string
  }[];
  gustos_platos?: {
    id_plato: string,
    nombre_plato: string,
    gusto_plato: string
  }[];
  cambios_platos?: {
    id_origen: string,
    nombre_origen: string,
    id_destino: string,
    nombre_destino: string,
    motivo_cambio: {
      motivo: string,
      id_especifico?: string
    }
  }[];

};
