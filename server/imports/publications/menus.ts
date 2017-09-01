import { factoryOrValue } from 'rxjs/operator/multicast';
import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu } from '../../../both/models/menu.model';
import { Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Nutrientes } from '../../../both/collections/nutrientes.collection';
import { Nutriente } from '../../../both/models/nutriente.model';


Meteor.publish('menus', () => Menus.find());

Meteor.publish('menu', function (idMenu: string) {
  return Menus.find({ _id: idMenu });
});

Meteor.publish('menuSemanal', function (usuario: string) {
  var idMenuSemanal = Menus.find({ owner: usuario }).fetch().reverse()[0]._id;
  return Menus.find({ _id: idMenuSemanal });
});

Meteor.publish('dietaMenu', function (idMenu: string) {
  return Menus.findOne({ _id: idMenu }).dieta;
});

interface consumoNutrientes {
  nutriente: string,
  consumoDiario: number,
  minDiario: number,
  consumoSemanal: number,
  maxSemanal: number
}

Meteor.methods({

  generarMenuSemana() {

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
    while (dias.length != 0) {

      let menuDia: Plato[] = [];

      //let dia:Date = getAleatorio(dias);
      let dia:Date = dias[0];
      let totalPlatosDia = 4;


      while (menuDia.length < totalPlatosDia) {

        let plato: Plato;
        let nutrientesValidos: string[];
        let momento: string = getMomento(menuDia.length);
        let tipo: string = getTipo(menuDia.length);
        
        //Obtengo un nutriente aleatorio de entre los nutrientes validos (que no superan el consumo)
        nutrientesValidos = getNutrientesValidos(consumo, menuDia);

        //Obtengo un plato aleatorio de entre los platos válidos (que cumplan las condiciones)
        plato = getAleatorio(getPlatosValidos(nutrientesValidos, consumo, momento, tipo, dia, menuDia, menu, menuAnterior));

        consumirNutrientesPlato(plato, consumo);

        //Añado el plato al día
        menuDia.push({
          _id: plato._id,
          nombre: plato.nombre,
          nutrientes: plato.nutrientes
        });

      }

      //Añado los platos al menú del día
      menu.dieta.push({
        fecha: dia,
        almuerzo: [menuDia[0], menuDia[1]],
        cena: [menuDia[2], menuDia[3]]
      });

      //Inicializo el consumo diario
      consumo = inicializarConsumo(nutrientes, consumo);

      //Siguiente día
      dias.splice(0, 1);
    }

    //Devuelvo el menú ordenado por fecha
    ordenarMenu(menu);
    return menu;
  }
});




function inicializarSemana(): Date[] {

  let now = new Date();
  let endDate = new Date();
  endDate.setDate(now.getDate() + 7);

  let semana = []

  for (let d = now; d < endDate; d.setDate(d.getDate() + 1)) {
    semana.push(new Date(d));
  }
  return semana;
}

function inicializarConsumo(nutrientes: Nutriente[], consumoDia?: consumoNutrientes[]): consumoNutrientes[] {

  let consumo: consumoNutrientes[] = [];
  let consumoDiario: number;
  let minDiario: number;
  let consumoSemanal: number;
  let maxSemanal: number;
  for (let i = 0; i < nutrientes.length; i++) {
    if (consumoDia != undefined) {//Si inicializarConsumoDiario
      if (nutrientes[i].minDia != null) {
        minDiario = nutrientes[i].minDia
        consumoDiario = 0;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = null;
      } else {
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = nutrientes[i].maxSem;
      }
    } else { //Si inicializar consumoSemanal
      if (nutrientes[i].minDia != null) {//Si el nutriente es diario
        minDiario = nutrientes[i].minDia
        consumoDiario = 0;
        consumoSemanal = 0;
        maxSemanal = null;
      } else { //Si el nutriente es semanal
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = 0;
        maxSemanal = nutrientes[i].maxSem;
      }
    }
    consumo.push({
      nutriente: nutrientes[i]._id,
      consumoDiario: consumoDiario,
      minDiario: minDiario,
      consumoSemanal: consumoSemanal,
      maxSemanal: maxSemanal
    });
  }
  return consumo;
}



function getAleatorio(a: any[]): any {
  return a[Math.floor(Math.random() * a.length)];
}

function getNutrientesValidos(consumo: consumoNutrientes[], menuDia: Plato[]): string[] {

  let nutrientes: string[] = [];

  //Primero nos aseguramos que se han consumido los nutrientes diarios
  for (let i = 0; i < consumo.length; i++) {
    let nutriente: string = consumo[i].nutriente;
    if (consumo[i].minDiario != null && consumo[i].minDiario > consumo[i].consumoDiario) {
      nutrientes.push(nutriente);
    }
  }
  if (nutrientes.length == 0) { //Si ya se han repartido los mínimos diarios
    for (let i = 0; i < consumo.length; i++) {
      let nutriente: string = consumo[i].nutriente;
      if (esNutrienteValido(nutriente, consumo, menuDia)) {
        nutrientes.push(nutriente);
      }
    }
  }
  return nutrientes;
}

function getNutrientesNoValidos(consumo: consumoNutrientes[], menuDia: Plato[]): string[] {

  let nutrientes: string[] = [];

  for (let i = 0; i < consumo.length; i++) {
    let nutriente: string = consumo[i].nutriente;
    if (!esNutrienteValido(nutriente, consumo, menuDia)) {
      nutrientes.push(nutriente);
    }

  }
  return nutrientes;

}

function esNutrienteValido(nutriente: string, consumo: consumoNutrientes[], menuDia: Plato[]): boolean {

  let nombreNutrientesDia: string[] = [];
  let tiposNutrientesDia: string[] = [];


  //Cojo los nutrientes que ya se han consumido en el día
  for (let i = 0; i < menuDia.length; i++) {
    for (let j = 0; j < menuDia[i].nutrientes.length; j++) {
      nombreNutrientesDia.push(menuDia[i].nutrientes[j]);
    }
  }

  //Cojo los tipos de nutrientes que ya se han consumido en el día
  let nutrientes: Nutriente[] = Nutrientes.find().fetch();
  let nutrientesDia: Nutriente[] = Nutrientes.find({ _id: { $in: nombreNutrientesDia } }).fetch();

  for (let i = 0; i < nutrientes.length; i++) {
    if (nutrientes[i]._id == nutriente) {
      let tiposNutriente: string = nutrientes[i].tipos.toString();
      if (tiposNutriente == 'VERDURA') { //Si solo es verdura
        return true;
      }
      for (let j = 0; j < nutrientesDia.length; j++) {
        let tiposNutrientePlatoDia: string = nutrientesDia[j].tipos.toString();
        if (tiposNutriente == tiposNutrientePlatoDia) { //Tienen los mismos tipos de nutriente
          return false;
        }
      }
    }
  }

  for (let i = 0; i < consumo.length; i++) {
    if (consumo[i].nutriente == nutriente) {
      if (consumo[i].maxSemanal != null) {
        if (consumo[i].consumoSemanal < consumo[i].maxSemanal) {
          return true;
        }
        else { //Si ya se ha consumido el máximoSemanal
          return false;
        }
      }
    }

  }

}

function getPlatosValidos(nutrientesValidos: string[], consumo: consumoNutrientes[], momento:string, tipo:string, dia:Date, platosDia: Plato[], menuActual: Menu, menuAnterior: Menu): Plato[] {

  let platos: Plato[] = [];
  let platosSemana = [];
  let platosSemanaAnterior = [];
  let platosHoy = [];
  let platosAyer = [];
  let nutrientesNoValidos: string[] = getNutrientesNoValidos(consumo, platosDia);

  //Recojo los platos del día
  for (let i = 0; i < platosDia.length; i++) {
    platosHoy.push(platosDia[i]._id);
  }

  //Recojo los platos de la semana
  platosSemana = getPlatosMenu(menuActual);

  //Recojo los platos del día anterior
  if(menuActual.dieta.length != 0){
    for(let i = 0; i < menuActual.dieta.length;i++){
      if(menuActual.dieta[i].fecha == dia){
        platosAyer.push(menuActual.dieta[i].almuerzo);
      }
    }
  }

  //Recojo los platos de la semana anterior
  //platosSemanaAnterior = getIdPlatosMenu(menuAnterior);

  //Que cumpla las condiciones
  //1. Que sea un plato que contenga el nutriente
  //2. Que sea un plato que no esté ya metido en el menú
  //3. Que sea un plato del momento (ALMUERZO/CENA)
  //4. Que sea un plato del tipo (PRIMERO/SEGUNDO)
  //5. Que sea un plato que no esté en el día anterior
  platos = Platos.find({
    $and: [
      {
        _id:
        {
          $nin: platosHoy
        }
      },
      {
        _id:
        {
          $nin: platosSemana
        }
      },
      {
        nutrientes:
        {
          $nin: nutrientesNoValidos
        }
      },
      {
        nutrientes:
        {
          $in: nutrientesValidos
        }
      },
      {
        momentos: 
        {
          $in: [momento]
        }
      },
      {
        tipos: 
        {
          $in: [tipo]
        }
      }
    ]
  }).fetch();

  if (platos.length == 0) {
    platos = Platos.find().fetch();
    console.log('No encuentra plato para las condiciones');
  }

  return platos;
}

function consumirNutrientesPlato(plato: Plato, consumo: consumoNutrientes[]): consumoNutrientes[] {
  let nutrientesPlato: string[] = [];

  for (let i = 0; i < plato.nutrientes.length; i++) {
    for (let j = 0; j < consumo.length; j++) {
      if (consumo[j].nutriente == plato.nutrientes[i]) {
        if (consumo[j].minDiario != null && consumo[j].minDiario > consumo[j].consumoDiario) { //Si es reparto diario de nutrientes
          consumo[j].consumoDiario++;
          consumo[j].consumoSemanal++;
        } else { //Si es reparto semanal de nutrientes
          consumo[j].consumoSemanal++;
        }
      }
    }
  }
  return consumo;
}

function getPlatosMenu(menu: Menu): string[] {

  let platos: string[] = [];
  for (let i = 0; i < menu.dieta.length; i++) {
    let j = 0;
    while (j < 2) {
      platos.push(menu.dieta[i].almuerzo[j]._id);
      platos.push(menu.dieta[i].cena[j]._id);
      j++;
    }
  }
  return platos;
}

function getTiposNutriente(nombreNutriente: string): string[] {
  let nutriente: Nutriente = Nutrientes.findOne({ nombre: nombreNutriente });
  let tiposNutriente: string[] = [];

  for (let i = 0; i < nutriente.tipos.length; i++) {
    tiposNutriente.push(nutriente.tipos[i]);
  }

  return tiposNutriente;
}

//Falta meter del usuario
function getMenuAnterior(): any {
  return Menus.find({}, { sort: { numero: -1 }, limit: 1 });
}


function ordenarMenu(menu: Menu) {
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

function getMomento(posicionMenu:number):string{
  if(posicionMenu == 0 || posicionMenu == 1  ){
    return 'ALMUERZO';
  }else{
    return 'CENA';
  }
}

function getTipo(posicionMenu:number):string{
  if(posicionMenu == 0 || posicionMenu == 2){
    return 'PRIMERO';
  }else{
    return 'SEGUNDO';
  }
}

function flat(r, a) {
  if (Array.isArray(a)) {
    return a.reduce(flat, r);
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
