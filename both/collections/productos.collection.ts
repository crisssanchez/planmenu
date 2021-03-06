import { MongoObservable } from 'meteor-rxjs';
import { Producto } from '../models/producto.model';
import { Meteor } from 'meteor/meteor';

export const Productos = new MongoObservable.Collection<Producto>('productos');

function loggedIn(){
  return !!Meteor.user();
}

Productos.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});