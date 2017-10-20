import { factoryOrValue } from 'rxjs/operator/multicast';
import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Nutrientes } from '../../../both/collections/nutrientes.collection';
import { Nutriente } from '../../../both/models/nutriente.model';
import { Producto } from '../../../both/models/producto.model';
import { Productos } from '../../../both/collections/productos.collection';


Meteor.publish('menus', () => Menus.find());

Meteor.publish('menu', function (idMenu: string) {
  return Menus.find({ _id: idMenu });
});

Meteor.publish('menuSemanal', function (usuario: string) {
  return Menus.find({}, { sort: { numero: -1 }, limit: 1 });
});

Meteor.publish('dietaMenu', function (idMenu: string) {
  return Menus.findOne({ _id: idMenu }).dieta;
});

interface consumoNutrientes {
  nutriente: string,
  consumoDiario: number,
  minDiario: number,
  consumoSemanal: number,
  maxSemanal: number,
  minSemanal: number
}

Meteor.methods({

  cambiarPlatoMenu(menu: Menu, platoOrigen: Plato, dia: number, momento: string, platoDestino: Plato, motivoCambio: number, ingredientesMotivo: string[]) {

    let posField = 'dieta.' + dia + '.' + momento;
    let pushValue = {};
    pushValue[posField] = platoDestino;

    let popValue = {};
    popValue[posField] = { _id: platoOrigen._id };
    Menus.update({ _id: menu._id, ['dieta.' + dia + '.' + momento + '._id']: platoOrigen._id }, { $set: { ['dieta.' + dia + '.' + momento + '.$']: platoDestino } });

  },

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
      let dia: Date = dias[0];
      let totalPlatosDia = 4;
      let nutrientesAyer: string[] = [];

      while (menuDia.length < totalPlatosDia) {

        let plato: Plato;
        let momento: string = getMomento(menuDia.length);
        let tipo: string = getTipo(menuDia.length);

        if (menu.dieta.length != 0) {
          let ultimoDia = menu.dieta[menu.dieta.length - 1];
          nutrientesAyer = getNutrientesUltimoDia(ultimoDia);
        }

        let nutrientesValidos: string[] = getNutrientesValidos(consumo, menuDia, nutrientesAyer);
        let nutrientesNoValidos: string[] = getNutrientesNoValidos(consumo, menuDia, nutrientesAyer);
        let nutrientesMinimos: string[] = getNutrientesMinimos(consumo);


        //Obtengo un plato aleatorio de entre los platos válidos (que cumplan las condiciones)
        plato = getAleatorio(getPlatosValidos(momento, tipo, nutrientesValidos, nutrientesNoValidos, nutrientesMinimos, menu, menuAnterior));
        if (plato._id != undefined) {
          consumirNutrientesPlato(plato, consumo);
        }


        //Añado el plato al día
        menuDia.push({
          _id: plato._id,
          nombre: plato.nombre,
          nutrientes: plato.nutrientes,
          imagenUrl: plato.imagenUrl,
          descripcion: plato.descripcion,
          dificultad: plato.dificultad,
          tiempo: plato.tiempo,
          momentos: plato.momentos,
          tipos: plato.tipos,
          temporada: plato.temporada,
          ingredientes: plato.ingredientes
        });

        //Añado los ingredientes del plato del día al carro
        Meteor.call('addProductosMenuCarro', menu);
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
      dias.shift();
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
  let minSemanal: number;
  for (let i = 0; i < nutrientes.length; i++) {
    if (consumoDia != undefined) {//Si inicializarConsumoDiario
      if (nutrientes[i].minDia != null) {
        minDiario = nutrientes[i].minDia
        consumoDiario = 0;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = null;
        minSemanal = null;
      } else {
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = nutrientes[i].maxSem;
        minSemanal = nutrientes[i].minSem;
      }
    } else { //Si inicializar consumoSemanal
      if (nutrientes[i].minDia != null) {//Si el nutriente es diario
        minDiario = nutrientes[i].minDia
        consumoDiario = 0;
        consumoSemanal = 0;
        maxSemanal = null;
        minSemanal = null;
      } else { //Si el nutriente es semanal
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = 0;
        maxSemanal = nutrientes[i].maxSem;
        minSemanal = nutrientes[i].minSem;
      }
    }
    consumo.push({
      nutriente: nutrientes[i]._id,
      consumoDiario: consumoDiario,
      minDiario: minDiario,
      consumoSemanal: consumoSemanal,
      maxSemanal: maxSemanal,
      minSemanal: minSemanal
    });
  }
  return consumo;
}



function getAleatorio(a: any[]): any {
  return a[Math.floor(Math.random() * a.length)];
}

function getNutrientesValidos(consumo: consumoNutrientes[], menuDia: Plato[], nutrientesDiaAnterior: string[]): string[] {

  let nutrientes: string[] = [];

  //Primero nos aseguramos que se han consumido los nutrientes mínimos
  for (let i = 0; i < consumo.length; i++) {
    let nutriente: string = consumo[i].nutriente;

    //Reparte los nutrientes diarios
    if (consumo[i].minDiario != null) {
      nutrientes.push(nutriente);
    }

    if (consumo[i].minSemanal != null && consumo[i].maxSemanal != null) {

      //Reparte los nutrientes que no han alcanzado su máximo semanal si son válidos
      if (consumo[i].consumoSemanal < consumo[i].maxSemanal) {
        if (esNutrienteValido(nutriente, consumo, menuDia, nutrientesDiaAnterior)) {
          nutrientes.push(nutriente);
        }
      }
    }

  }

  return nutrientes;
}

function getNutrientesNoValidos(consumo: consumoNutrientes[], menuDia: Plato[], nutrientesDiaAnterior: string[]): string[] {

  let nutrientes: string[] = [];

  for (let i = 0; i < consumo.length; i++) {
    let nutriente: string = consumo[i].nutriente;

    //Los nutrientes que han alcanzado su máximo semanal no son válidos
    if (consumo[i].maxSemanal != null) {
      if (consumo[i].consumoSemanal == consumo[i].maxSemanal) {
        nutrientes.push(nutriente);
      } else {
        if (!esNutrienteValido(nutriente, consumo, menuDia, nutrientesDiaAnterior)) {
          nutrientes.push(nutriente);
        }
      }
    }

  }
  return nutrientes;

}

function esNutrienteValido(nutriente: string, consumo: consumoNutrientes[], menuDia: Plato[], nutrientesAyer: string[]): boolean {

  let nutrientes: Nutriente[] = Nutrientes.find().fetch();
  let nombreNutrientesAyer: string[] = [];
  let tiposNutrientesDia: any[] = [];
  let tiposNutrientesAyer: any[] = [];

  //Recojo los tipos de nutrientes de los platos de HOY
  if (menuDia.length != 0) {
    for (let i = 0; i < menuDia.length; i++) {
      if (menuDia[i]._id != undefined) {
        for (let j = 0; j < menuDia[i].nutrientes.length; j++) {
          let tiposNutrientes = getTiposNutriente(menuDia[i].nutrientes[j]);
          tiposNutrientesDia.push(tiposNutrientes);
        }
      }
    }
    for (let i = 0; i < nutrientes.length; i++) {
      if (nutrientes[i]._id == nutriente) {
        let tiposNutriente: string = nutrientes[i].tipos.toString();
        for (let j = 0; j < tiposNutrientesDia.length; j++) {
          let tiposNutrientePlatoDia: string = tiposNutrientesDia[j].toString();
          if (tiposNutriente == tiposNutrientePlatoDia) { //Tienen los mismos tipos de nutriente
            return false;
          }
        }
      }
    }
  }

  //Recojo los nutrientes que ya se han consumido AYER
  if (nutrientesAyer.length != 0) {
    for (let i = 0; i < nutrientesAyer.length; i++) {
      if (nutrientesAyer[i] == nutriente) {
        return false;
      }
    }

  }

  return true;
}

function getPlatosValidos(momento: string, tipo: string, nutrientesValidos: string[], nutrientesNoValidos: string[], nutrientesMin: string[], menuActual: Menu, menuAnterior: Menu): Plato[] {

  let platos: Plato[] = [];
  let platosSemana = [];
  let platosSemanaAnterior = [];
  let tiposNutrientesAyer = [];
  let nutrientesMinimosDiarios = [];

  //Recojo los platos de la semana
  platosSemana = getNombrePlatosMenu(menuActual);

  //Los nutrientes minimos se consumen de primero
  if (nutrientesMin.length != 0 && tipo == 'PRIMERO') {
    nutrientesValidos = nutrientesMin;
  }


  //Recojo los platos de la semana anterior
  //platosSemanaAnterior = getIdPlatosMenu(menuAnterior);

  //Que cumpla las condiciones
  //1. Que sea un plato que contenga nutrientes válidos
  //2. Que sea un plato que no esté ya metido en el menú
  //3. Que sea un plato del momento (ALMUERZO/CENA)
  //4. Que sea un plato del tipo (PRIMERO/SEGUNDO)
  //5. Que sea un plato que no tenga los mismos tipos de nutrientes que los platos de HOY (Esto se controla en esNutrienteValido)
  //6. Que sea un plato qu eno tenga los mismos nutrientes que los platos de AYER (Esto se controla en esNutrienteValido)
  platos = Platos.find({
    $and: [

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
    platos.push({
      _id: undefined,
      nombre: undefined,
      imagenUrl: undefined,
      descripcion: undefined,
      dificultad: undefined, // BAJA, MEDIA, ALTA
      tiempo: undefined, // En minutos
      tipos: undefined, // PRIMERO, SEGUNDO
      momentos: undefined, // ALMUERZO, CENA
      nutrientes: nutrientesValidos,
      temporada: undefined, // PRIMAVERA, VERANO, OTOÑO INVIERNO
      ingredientes: undefined
    });
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

function getNombrePlatosMenu(menu: Menu): string[] {

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
  let nutriente: Nutriente = Nutrientes.findOne({ _id: nombreNutriente });
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

function getMomento(posicionMenu: number): string {
  if (posicionMenu == 0 || posicionMenu == 1) {
    return 'ALMUERZO';
  } else {
    return 'CENA';
  }
}

function getTipo(posicionMenu: number): string {
  if (posicionMenu == 0 || posicionMenu == 2) {
    return 'PRIMERO';
  } else {
    return 'SEGUNDO';
  }
}

function getNutrientesUltimoDia(dietaUltimoDia: Dieta): string[] {

  let nutrientesUltimoDia: string[] = [];

  if (dietaUltimoDia.almuerzo.length != 0) {
    for (let i = 0; i < dietaUltimoDia.almuerzo.length; i++) {
      if (dietaUltimoDia.almuerzo[i]._id != undefined) {
        for (let j = 0; j < dietaUltimoDia.almuerzo[i].nutrientes.length; j++) {
          nutrientesUltimoDia.push(dietaUltimoDia.almuerzo[i].nutrientes[j]);
        }
      }
    }
  }
  if (dietaUltimoDia.cena.length != 0) {
    for (let i = 0; i < dietaUltimoDia.cena.length; i++) {
      if (dietaUltimoDia.cena[i]._id != undefined) {
        for (let j = 0; j < dietaUltimoDia.cena[i].nutrientes.length; j++) {
          nutrientesUltimoDia.push(dietaUltimoDia.cena[i].nutrientes[j]);
        }
      }

    }
  }

  return nutrientesUltimoDia;
}

function getNutrientesMinimos(consumo: consumoNutrientes[]): string[] {
  let nutrientesMin: string[] = [];
  for (let i = 0; i < consumo.length; i++) {
    if (consumo[i].minDiario != null && consumo[i].consumoDiario < consumo[i].minDiario) {
      nutrientesMin.push(consumo[i].nutriente);
    }
  }

  return nutrientesMin;
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
