import { Familias } from '../../../both/collections/familias.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('familias', () => Familias.find());

Meteor.publish('familia',() => {
  return Familias.find({_id: Meteor.userId});
});

