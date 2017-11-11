import { CollectionObject } from './collection-object.model';

export interface Producto extends CollectionObject{
  menu:string,
  orden: number,
  nombre:string,
  platos?: string[],
  activo: boolean
}