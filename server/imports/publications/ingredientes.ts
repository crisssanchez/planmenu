import { Meteor } from 'meteor/meteor';
import { Ingredientes } from '../../../both/collections/ingredientes.collection';
import { Ingrediente } from '../../../both/models/ingrediente.model';

Meteor.publish('ingredientes', () => Ingredientes.find());
Meteor.publish('ingrediente', function(idIngrediente:string){
  return Ingredientes.find({_id:idIngrediente});
});
