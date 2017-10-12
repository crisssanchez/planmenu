import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { Menu } from '../models/menu.model';
import { Meteor } from 'meteor/meteor';

export const Menus = new MongoObservable.Collection<Menu>('menus');

function loggedIn(){
  return !!Meteor.user();
}

Menus.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});