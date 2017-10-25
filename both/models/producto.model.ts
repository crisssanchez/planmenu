import { CollectionObject } from './collection-object.model';

export interface Producto extends CollectionObject{
  menu:string,
  nombre:string,
  platos?: string[],
  activo: boolean
}