import { Meteor } from 'meteor/meteor';
import { Ingredientes } from '../../../both/collections/ingredientes.collection';
import { Ingrediente } from '../../../both/models/ingrediente.model';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';

Meteor.publish('ingredientes', () => Ingredientes.find());
Meteor.publish('ingrediente', function(idIngrediente:string){
  return Ingredientes.find({_id:idIngrediente});
});

Meteor.methods({
  addIngrediente(nombre: string) {
    if (!Ingredientes.collection.find({nombre:{'$regex' : nombre, '$options' : 'i'}}).count()) {
      Ingredientes.insert({
        nombre: nombre
      });
    }
  }
});
