import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu } from '../../../both/models/menu.model';
import { Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Nutrientes } from '../../../both/collections/nutrientes.collection';
import { Nutriente } from '../../../both/models/nutriente.model';


Meteor.publish('menus', () => Menus.find());

Meteor.publish('menu', function(idMenu:string){
  return Menus.find({_id:idMenu});
});

Meteor.publish('menuSemanal', function(usuario:string){
  var idMenuSemanal = Menus.find({owner:usuario}).fetch().reverse()[0]._id;
  return Menus.find({_id:idMenuSemanal});
});

Meteor.publish('dietaMenu',function(idMenu:string){
  return Menus.findOne({_id:idMenu}).dieta;
});

Meteor.methods({

  generarMenuSemana():Menu{

    let menu: Menu = {
      dieta: [],
      owner: undefined
    };

    let semana: Date[] = [];
    let dias: Date[] = [];
    let platos: Plato[] = Platos.find().fetch();


    let now = new Date();
    let endDate = new Date();
    endDate.setDate(now.getDate() + 7);

    for (let d = now; d < endDate; d.setDate(d.getDate() + 1)) {
      semana.push(new Date(d));
    }

    dias = semana.slice();



    let nutrientesSemanales: any[] = Nutrientes.find({minDia: null}).fetch();

    //Array de nutrientes ordenado por mínimos (primero los minDia y luego minSem)
    let nutrientes: any[] = Nutrientes.find().fetch().sort((a,b)=>{
      if(( a.minDia != null ) && ( b.minDia != null ) && ( a.minDia > b.minDia )){
        return -1;
      }else if(( a.minDia != null ) && ( b.minDia != null ) && ( a.minDia < b.minDia )){
        return 1;
      }else if(( a.minDia != null ) && ( b.minSem != null )) {
        return -1;
      }else if( b.minDia != null) {
        return 1;
      }else if(( a.minSem != null ) && ( b.minSem != null ) && ( a.minSem > b.minSem )){
        return -1;
      }else if(( a.minSem != null ) && ( b.minSem != null ) && ( a.minSem < b.minSem )){
        return 1;
      }else if( a.minSem != null ) {
        return -1;
      }else if( b.minSem != null) {
        return 1;
      }
      return 0;
    });

    let consumoDiario: number[] = [];
    let consumoSemanal: number[] = [];

    //Inicializar la cantidad consumida a la semana de cada nutriente
    for(let i = 0; i < nutrientesSemanales.length; i++){
      consumoSemanal[i] = 0;
    }

    //while(dias.length != 0){

      let nutrientesDiarios: any[] = Nutrientes.find({minDia: {$ne:null}}).fetch();
      let dia = getAleatorio(dias);
      let pos = semana.indexOf(dia);
      let totalPlatosDia = 4;

      //Inicializar la cantidad consumida al día de cada nutriente
      for(let i = 0; i < nutrientesDiarios.length; i++){
        consumoDiario[i] = 0;
      }
      let platosDia: Plato[] = [{
        nombre: undefined,
        nutrientes: []
      }];
      let nutriente: Nutriente;
      let posPlatos: number[] = [0,1,2,3];

      //Elijo platos aleatorios de los nutrientes minimos diarios aleatorios
      while(nutrientesDiarios.length != 0){
        nutriente = getAleatorio(nutrientesDiarios);
        consumoDiario[nutrientesDiarios.indexOf(nutriente)]++;
        let i = getAleatorio(posPlatos);
        if(consumoDiario[nutrientesDiarios.indexOf(nutriente)] >= nutriente.minDia){
          if((consumoDiario[nutrientesDiarios.indexOf(nutriente)] < nutriente.maxDia) || nutriente.maxDia == null) {
            nutrientesSemanales.push(nutriente);
          }
          consumoDiario = consumoDiario.slice(nutrientesDiarios.indexOf(nutriente),1);
          nutrientesDiarios = nutrientesDiarios.slice(nutrientesDiarios.indexOf(nutriente),1);
        }
        let p:Plato;
        p = getPlatoAleatorio(nutriente);
        platosDia[i] = {
          nombre: p._id,
          nutrientes: p.nutrientes
        }
        posPlatos = posPlatos.slice(i,1);
      }
      //El resto de platos del día los relleno con nutrientes aleatorios sin pasarnos del maximo
      while( platosDia.length < totalPlatosDia){
        nutriente = getAleatorio(nutrientesSemanales);
        consumoSemanal[nutrientesSemanales.indexOf(nutriente)]++;
        let i = getAleatorio(posPlatos);
        if((consumoSemanal[nutrientesSemanales.indexOf(nutriente)] >= nutriente.maxSem) || (consumoSemanal[nutrientesSemanales.indexOf(nutriente)] >= nutriente.maxDia)){
          consumoSemanal = consumoSemanal.slice(nutrientesSemanales.indexOf(nutriente),1);
          nutrientesSemanales = nutrientesSemanales.slice(nutrientesSemanales.indexOf(nutriente),1);
        }
        let p = getPlatoAleatorio(nutriente);
        platosDia[i] = {
          nombre: p._id,
          nutrientes: p.nutrientes
        }
        posPlatos = posPlatos.slice(i,1);
      }


      menu.dieta[pos] = {
        fecha: dia,
        almuerzo: [platosDia[0],platosDia[1]],
        cena: [platosDia[2],platosDia[3]]
      }

      dias = dias.splice(dias.indexOf(dia),1);
  //  }
    console.log("MENU:" + menu);
    return menu;
  }
});

function getAleatorio(a:any[]):any{
  return a[ Math.floor(Math.random() * a.length)];
}

function getPlatoAleatorio(nutriente):Plato{

  let p: Plato[];
  //Que cumpla las condiciones
  p = Platos.find({ nutrientes:{ $elemMatch:{ id:nutriente.id }}}).fetch();

  console.log("Nutriente:" + nutriente);
  console.log("Plato con nutriente:" + p);
  return getAleatorio(p);
}




/*Meteor.publish('platos_menu', function(){

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
});*/

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
