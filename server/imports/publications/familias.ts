import { Plato } from '../../../both/models/plato.model';
import { Familia } from '../../../both/models/familia.model';
import { Familias } from '../../../both/collections/familias.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('familias', () => Familias.find());

Meteor.publish('familia',() => {
  return Familias.find({_id: Meteor.userId});
});

Meteor.methods({

  updateFamilia(usuario: Familia){
    Familias.update({ _id: usuario._id }, {$set:{ nombre: usuario.nombre, apellidos: usuario.apellidos, email: usuario.email, comienzo: usuario.comienzo, miembros: usuario.miembros, dificultad: usuario.dificultad, tiempo: usuario.tiempo, gustos_nutrientes: usuario.gustos_nutrientes, aviso:usuario.aviso }});
  },

  setGustoPlato(plato:Plato, valor:number){

    let gustosPlatos: any[] = Familias.findOne({_id:Meteor.userId}).gustos_platos;
    let actualizado:boolean = false;

    if(gustosPlatos != undefined){
      for(let i= 0; i< gustosPlatos.length; i++){
        if(gustosPlatos[i].id_plato === plato._id){
          if(gustosPlatos[i].valor === valor){
            gustosPlatos[i].valor = undefined;
          }else{
            gustosPlatos[i].valor = valor;
          }
          actualizado = true;
        }
      }
    }
    if(!actualizado){
      if(gustosPlatos == undefined){
        gustosPlatos = [];
      }
      gustosPlatos.push({
        id_plato: plato._id,
        nombre_plato: plato.nombre,
        valor: valor
      })
    }

    Familias.update({_id: Meteor.userId}, {
      $set:{
        gustos_platos:gustosPlatos
    }});
  }
  
});
