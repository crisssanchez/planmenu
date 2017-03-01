import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';

Meteor.publish('menu', () => Menus.find({owner:'cris'}));

Meteor.publish('platos_menu', function(userId){

      var menu = Menus.findOne({owner:'cris'});
      var dieta_platos = menu.dieta.map(function(doc){return doc.plato._id});
      var platos_menu = Platos.find({_id: { $in : dieta_platos } } ) ;
      return platos_menu;
      //return Menus.findOne({owner: userId});
});
