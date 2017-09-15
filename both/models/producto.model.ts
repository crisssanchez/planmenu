import { CollectionObject } from './collection-object.model';

export interface Producto extends CollectionObject{
  menu:string,
  nombre:string,
  plato: string,
  activo: boolean
}