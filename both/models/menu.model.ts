import { Plato } from './plato.model';
import { CollectionObject } from './collection-object.model';

export interface Menu extends CollectionObject{
  owner: string;
  dieta: Dieta[];
}

export interface Dieta{
  fecha: string;
  plato: Plato;
}
