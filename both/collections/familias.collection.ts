import { MongoObservable } from 'meteor-rxjs';
import { Familia } from '../models/familia.model';
import { Meteor } from 'meteor/meteor';

export const Familias = new MongoObservable.Collection<Familia>('familias');

function loggedIn(){
  return !!Meteor.user();
}

Familias.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});