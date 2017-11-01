import { CollectionObject } from './collection-object.model';

export interface Alimento extends CollectionObject{
  nutrientes:string[],
  minDia?:number,
  maxDia?:number,
  minSem?:number,
  maxSem?:number
}
