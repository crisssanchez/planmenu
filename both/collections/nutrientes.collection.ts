import { MongoObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';

import { Nutriente } from '../models/nutriente.model';

export const Nutrientes = new MongoObservable.Collection<Nutriente>('nutrientes');

export function sort( a:Nutriente, b:Nutriente ){
  if(( a.minDia != null ) && ( b.minDia != null ) && ( a.minDia > b.minDia )){
    return -1;
  }else if(( a.minDia != null ) && ( b.minDia != null ) && ( a.minDia < b.minDia )){
    return 1;
  }else if( a.minDia != null ) {
    return -1;
  }else if( b.minDia != null) {
    return 1;
  }else if(( a.minSem != null ) && ( b.minSem != null ) && ( a.minSem > b.minSem )){
    return -1;
  }else if(( a.minSem != null ) && ( b.minSem != null ) && ( a.minSem < b.minSem )){
    return 1;
  }else if( a.minSem != null ) {
    return -1;
  }else if( b.minSem != null) {
    return 1;
  }
  return 0;
}