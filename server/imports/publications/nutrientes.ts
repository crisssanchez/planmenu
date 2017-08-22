import { Meteor } from 'meteor/meteor';
import { Nutrientes } from '../../../both/collections/nutrientes.collection';
import { Nutriente } from '../../../both/models/nutriente.model';

Meteor.publish('nutrientes', () => Nutrientes.find());
Meteor.publish('nutriente', function(idNutriente:string){
  return Nutrientes.find({_id:idNutriente});
});
