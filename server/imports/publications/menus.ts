import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';

Meteor.publish('menu', () => Menus.find({owner:'dani'}));

Meteor.publish('platos_menu', function(){

      var menu = Menus.findOne({owner:'dani'});
      var dieta_platos = menu.dieta.map(function(doc){return doc.platos});
      var platos = new Array;
      for(var i=0; i< dieta_platos.length;i++){
          platos.push(dieta_platos[i].map(function(doc){return doc._id}));
      }
      var platos_ids = new Array;
      platos_ids = platos.reduce(flat,[]);

      var platos_menu = Platos.find({_id: { $in : platos_ids } } ) ;
      return platos_menu;
});

function flat (r,a){
  if(Array.isArray(a)){
    return a.reduce(flat,r);
  }
  r.push(a);
  return r;
}



/*Meteor.publish('miplato',function(){

  var menu = Menus.findOne({owner:'cris'});
  var platos_ids = menu.dieta.map((doc)=>doc._id);
  var platos = Platos.find({_id:{$in: platos_ids}});
  return platos;
});*/
