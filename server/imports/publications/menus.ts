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

interface consumoNutrientes {
  nutriente: string,
  consumoDiario: number,
  minDiario:number,
  consumoSemanal:number,
  maxSemanal:number
}

Meteor.methods({

  generarMenuSemana(){

    let menu: Menu = {
      dieta: [],
      numero: undefined,
      owner: undefined
    };
    let menuAnterior = getMenuAnterior();
    let nutrientes: Nutriente[] = Nutrientes.find().fetch();
    let consumo: consumoNutrientes[];
    let semana: Date[] = [];

    semana = inicializarSemana();
    consumo = inicializarConsumo(nutrientes);

    //Copia de semana para ir recorriendo los días
    let dias: Date[] = [];
    dias = semana.slice();

    //Recorro los días de la semana
    while(dias.length != 0){

      let menuDia: Plato[] = [];

      let dia = getAleatorio(dias);
      let totalPlatosDia = 4;


      while( menuDia.length < totalPlatosDia){

        let plato:Plato;
        let nutriente:string = getAleatorio(getNutrientesValidos(consumo));

        //Obtengo un nutriente aleatorio de entre los nutrientes validos (que no superan el consumo)
        nutriente = getAleatorio(getNutrientesValidos(consumo));

        //Obtengo un plato aleatorio de entre los platos válidos (que cumplan las condiciones)
        plato = getAleatorio(getPlatosValidos(nutriente, consumo, menuDia, menu, menuAnterior));
        consumirNutrientesPlato(plato,consumo);

        //Añado el plato al día
        menuDia.push({
          _id: plato._id,
          nombre: plato.nombre,
          nutrientes: plato.nutrientes
        });
      }

      //Añado los platos al menú del día
      menu.dieta.push( {
        fecha: dia,
        almuerzo: [menuDia[0],menuDia[1]],
        cena: [menuDia[2],menuDia[3]]
      });

      //Siguiente día
      dias.splice(dias.indexOf(dia),1);
    }

    //Devuelvo el menú ordenado por fecha
    ordenarMenu(menu);
    return menu;
  }
});




function inicializarSemana():Date[]{

  let now = new Date();
  let endDate = new Date();
  endDate.setDate(now.getDate() + 7);

  let semana = []

  for (let d = now; d < endDate; d.setDate(d.getDate() + 1)) {
    semana.push(new Date(d));
  }
  return semana;
}

function inicializarConsumo(nutrientes:Nutriente[]):consumoNutrientes[]{

  let consumo:consumoNutrientes[] = [];
  let consumoDiario:number;
  let minDiario:number;
  let consumoSemanal:number;
  let maxSemanal:number;
  for(let i = 0; i < nutrientes.length; i++){

    //Si son nutrientes diarios
    if(nutrientes[i].minDia != null){
      minDiario = nutrientes[i].minDia
      consumoDiario = 0;
      consumoSemanal = 0;
      maxSemanal = null;
    }else{ //Si son nutrientes semanales
      consumoDiario = null;
      minDiario = null;
      consumoSemanal = 0;
      maxSemanal = nutrientes[i].maxSem;
    }
    consumo.push({
      nutriente:nutrientes[i]._id,
      consumoDiario: consumoDiario,
      minDiario: minDiario,
      consumoSemanal: consumoSemanal,
      maxSemanal: maxSemanal
    });
  }
  return consumo;
}

function getAleatorio(a:any[]):any{
  return a[ Math.floor(Math.random() * a.length)];
}

function getNutrientesValidos(consumo:consumoNutrientes[]):string[]{

  let nutrientes:string[] = [];

  //Primero los nutrientes diarios
  for(let i=0;i<consumo.length;i++){
    if(consumo[i].minDiario != null){
      if(consumo[i].consumoDiario < consumo[i].minDiario){
        nutrientes.push(consumo[i].nutriente);
      }
    }
  }
  //Si ya se han repartido entonces los semanales
  if(nutrientes.length == 0){
    for(let i=0;i<consumo.length;i++){
      if(consumo[i].maxSemanal != null){
        if(consumo[i].consumoSemanal < consumo[i].maxSemanal){
          nutrientes.push(consumo[i].nutriente);
        }
      }else{ //Si no tiene consumo maxSemanal siempre es valido
        nutrientes.push(consumo[i].nutriente);
      }
    }
  }

  return nutrientes;

}

function getPlatosValidos(nutriente:string, consumo:consumoNutrientes[], platosDia:Plato[], menuActual:Menu, menuAnterior:Menu):Plato[]{

  let platos: Plato[] = [];
  let platosSemana = [];
  let platosSemanaAnterior = [];
  let platosHoy = [];

  let nutrientesValidos:string[] = getNutrientesValidos(consumo);

  //Recojo los platos del día
  for(let i=0; i< platosDia.length;i++){
    platosHoy.push(platosDia[i]._id);
  }

  //Recojo los platos de la semana
  platosSemana = getPlatosMenu(menuActual);

  //Recojo los platos de la semana anterior
  //platosSemanaAnterior = getIdPlatosMenu(menuAnterior);

  //Que cumpla las condiciones
  //1. Que sea un plato que contenga el nutriente
  //2. Que sea un plato que no esté ya metido en el menú
  platos = Platos.find({
    _id: {
      //$and: [{
        $nin: platosHoy
      //},{
        //$nin:platosSemana
      //}]
    },
    nutrientes: {
      $elemMatch:{
          $eq: nutriente
      },

      $in: nutrientesValidos

    }}).fetch();

    if(platos.length == 0) {
      platos = Platos.find().fetch();
    }

    return platos;
}

function consumirNutrientesPlato(plato:Plato,consumo:consumoNutrientes[]):consumoNutrientes[]{
  let nutrientesPlato:string[] = [];

  for(let i =0;i<plato.nutrientes.length;i++){
    for(let j = 0; j< consumo.length;j++){
      if (consumo[i].nutriente == plato.nutrientes[i]){
        if(consumo[i].minDiario != null && consumo[i].minDiario < consumo[i].consumoDiario){ //Si es reparto diario de nutrientes
          consumo[i].consumoDiario++;
        }else{ //Si es reparto semanal de nutrientes
          consumo[i].consumoSemanal++;
        }
      }
    }
  }
  return consumo;
}

function getPlatosMenu(menu:Menu):string[]{

  let platos: string[] = [];
  for(let i = 0; i < menu.dieta.length; i++){
    let j = 0;
    while( j < 2 ){
      platos.push(menu.dieta[i].almuerzo[j]._id);
      platos.push(menu.dieta[i].cena[j]._id);
      j++;
    }
  }
  return platos;
}

//Falta meter del usuario
function getMenuAnterior():any{
  return Menus.find({},{sort:{numero:-1},limit:1});
}


function ordenarMenu(menu:Menu){
  menu.dieta.sort(function (a, b) {
    if (a.fecha > b.fecha) {
      return 1;
    }
    if (a.fecha.getDate() < b.fecha.getDate()) {
      return -1;
    }
    // a must be equal to b
      return 0;
  });
}

function flat (r,a){
  if(Array.isArray(a)){
    return a.reduce(flat,r);
  }
  r.push(a);
  return r;
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

/*Meteor.publish('miplato',function(){

  var menu = Menus.findOne({owner:'cris'});
  var platos_ids = menu.dieta.map((doc)=>doc._id);
  var platos = Platos.find({_id:{$in: platos_ids}});
  return platos;
});*/
