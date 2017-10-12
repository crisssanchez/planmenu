import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { Ingrediente } from '../models/ingrediente.model';
import { Meteor } from 'meteor/meteor';

export const Ingredientes = new MongoObservable.Collection<Ingrediente>('ingredientes');

function loggedIn(){
  return !!Meteor.user();
}

Ingredientes.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});