import { Meteor } from 'meteor/meteor';
import { Alimentos } from '../../../both/collections/alimentos.collection';
import { Alimento } from '../../../both/models/alimento.model';

Meteor.publish('alimentos', () => Alimentos.find());
Meteor.publish('alimento', function(idAlimento:string){
  return Alimentos.find({_id:idAlimento});
});
