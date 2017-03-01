import { CollectionObject } from './collection-object.model'

export interface Plato extends CollectionObject{
  nombre: string;
  congelado?: boolean;
}
