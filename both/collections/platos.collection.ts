import { MongoObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';
import { Plato } from '../models/plato.model'
import { Meteor } from 'meteor/meteor';

export const Platos = new MongoObservable.Collection<Plato>('platos');

function loggedIn(){
  return !!Meteor.user();
}

Platos.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});