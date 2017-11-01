import { MongoObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';
import { Alimento } from '../models/alimento.model';
import { Meteor } from 'meteor/meteor';

export const Alimentos = new MongoObservable.Collection<Alimento>('alimentos');

function loggedIn(){
  return !!Meteor.user();
}

Alimentos.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});

export function sort( a:Alimento, b:Alimento ){
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
