import { CollectionObject } from './collection-object.model';

export interface Nutriente extends CollectionObject{
  tipos:string[],
  minDia?:number,
  maxDia?:number,
  minSem?:number,
  maxSem?:number
}
