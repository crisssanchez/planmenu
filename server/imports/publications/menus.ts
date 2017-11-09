import { MOMENTO } from '../../../client/imports/app/data';
import { Familia } from '../../../both/models/familia.model';
import { Familias } from '../../../both/collections/familias.collection';
import { factoryOrValue } from 'rxjs/operator/multicast';
import { Meteor } from 'meteor/meteor';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Alimentos } from '../../../both/collections/alimentos.collection';
import { Alimento } from '../../../both/models/alimento.model';
import { Producto } from '../../../both/models/producto.model';
import { Productos } from '../../../both/collections/productos.collection';
import * as moment from 'moment';


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

interface consumoAlimentos {
  alimento: string,
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
    Menus.update({ _id: menu._id, ['dieta.' + dia + '.' + momento + '._id']: platoOrigen._id },
      {
        $set: {
          ['dieta.' + dia + '.' + momento + '.$']: platoDestino
        }
      });

    Familias.update(
      { _id: Meteor.userId },
      {
        $addToSet: {
          cambios_platos: { id_origen: platoOrigen._id, nombre_origen: platoOrigen.nombre, id_destino: platoDestino._id, nombre_destino: platoDestino.nombre, motivo_cambio: { motivo: motivoCambio, ingredientes: ingredientesMotivo } }
        }
      });

    if (motivoCambio == -1) {
      Familias.update(
        { _id: Meteor.userId },
        {
          $addToSet: {
            gustos_platos: { id_plato: platoOrigen._id, nombre_plato: platoOrigen.nombre, valor: motivoCambio }
          }
        });

    }


  },

  generarMenuSemana() {

    let tiempoInicial = new Date().getTime();
    let menu: Menu = {
      _id: "",
      inicio: new Date(),
      fin: new Date(),
      dieta: [],
      numero: Menus.find({ owner: Meteor.userId }).fetch().length + 1,
      owner: Meteor.userId()
    };
    let menuAnterior = getMenuAnterior();
    let alimentos: Alimento[] = Alimentos.find().fetch();
    let consumo: consumoAlimentos[];
    let semana: Date[] = [];

    semana = inicializarSemana();
    consumo = inicializarConsumo(alimentos);

    //Copia de semana para ir recorriendo los días
    let dias: Date[] = [];
    dias = semana.slice();

    //Establecer las fechas del menú
    menu.inicio = dias[0];
    menu.fin = dias[6];
    menu._id = moment(menu.inicio).format('DDMMYYYY') + "-" + moment(menu.fin).format('DDMMYYYY');

   let contadorUndefined = 0;

    //Recorro los días de la semana
    while (dias.length != 0) {

      let dietaDia: Plato[] = [];

      //let dia:Date = getAleatorio(dias);
      let dia: Date = dias[0];
      let totalPlatosDia = 4;
      let alimentosAyer: string[] = [];

      while (dietaDia.length < totalPlatosDia) {

        let plato: Plato;
        let momento: string = getMomento(dietaDia.length);
        let tipo: string = getTipo(dietaDia.length);

        if (menu.dieta.length != 0) {
          let ultimoDia = menu.dieta[menu.dieta.length - 1];
          alimentosAyer = getAlimentosUltimoDia(ultimoDia);
        }

        let alimentosValidos: string[] = getAlimentosValidos(consumo, dietaDia, alimentosAyer);
        let alimentosNoValidos: string[] = getAlimentosNoValidos(consumo, dietaDia, alimentosAyer);
        let alimentosMinimos: string[] = getAlimentosMinimos(consumo, dietaDia, alimentosAyer);


        //Obtengo un plato aleatorio de entre los platos válidos (que cumplan las condiciones)
        plato = getPlatoAleatorioPonderado(getPlatosValidos(momento, tipo, alimentosValidos, alimentosNoValidos, alimentosMinimos, dietaDia, menu));
    
        //console.log(dia.getDate() + "(" + momento + "):" + plato.nombre + "[" + plato.alimentos + "]");
        if (plato != undefined) {
          consumirAlimentosPlato(plato, consumo);
        }

        //Añado el plato al día
        dietaDia.push({
          _id: plato._id,
          nombre: plato.nombre,
          alimentos: plato.alimentos,
          imagenUrl: plato.imagenUrl,
          descripcion: plato.descripcion,
          dificultad: plato.dificultad,
          tiempo: plato.tiempo,
          momentos: plato.momentos,
          tipos: plato.tipos,
          temporada: plato.temporada,
          ingredientes: plato.ingredientes
        });

        if(plato._id == undefined){
          contadorUndefined ++;
        }
        //Añado los ingredientes del plato del día al carro

        Meteor.call('addProductosMenuCarro', menu);
      }

      //Añado los platos al menú del día
      menu.dieta.push({
        fecha: dia,
        almuerzo: [dietaDia[0], dietaDia[1]],
        cena: [dietaDia[2], dietaDia[3]]
      });

      //Inicializo el consumo diario
      consumo = inicializarConsumo(alimentos, consumo);

      //Siguiente día
      dias.shift();
    }

    //Devuelvo el menú ordenado por fecha
    ordenarMenu(menu);

    //Guardar menú   
    if (Menus.findOne({ _id: menu._id })) {
      Menus.update({_id:menu._id},{$set:{dieta:menu.dieta}});
    } else {
      Menus.insert(menu);
    }

    let now = new Date().getTime();
    
    console.log("Tiempo total algortimo: " + (now - tiempoInicial));
    console.log("Nºplatos no encontrados: " + contadorUndefined + "/28");

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

function inicializarConsumo(alimentos: Alimento[], consumoDia?: consumoAlimentos[]): consumoAlimentos[] {

  let consumo: consumoAlimentos[] = [];
  let consumoDiario: number;
  let minDiario: number;
  let consumoSemanal: number;
  let maxSemanal: number;
  let minSemanal: number;
  for (let i = 0; i < alimentos.length; i++) {
    if (consumoDia != undefined) {//Si inicializarConsumoDiario
      if (alimentos[i].minDia != null) {
        minDiario = alimentos[i].minDia
        consumoDiario = 0;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = null;
        minSemanal = null;
      } else {
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = consumoDia[i].consumoSemanal;
        maxSemanal = alimentos[i].maxSem;
        minSemanal = alimentos[i].minSem;
      }
    } else { //Si inicializar consumoSemanal
      if (alimentos[i].minDia != null) {//Si el alimento es diario
        minDiario = alimentos[i].minDia
        consumoDiario = 0;
        consumoSemanal = 0;
        maxSemanal = null;
        minSemanal = null;
      } else { //Si el alimento es semanal
        consumoDiario = null;
        minDiario = null;
        consumoSemanal = 0;
        maxSemanal = alimentos[i].maxSem;
        minSemanal = alimentos[i].minSem;
      }
    }
    consumo.push({
      alimento: alimentos[i]._id,
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

//FUNCIONES PARA LA PONDERACIÓN DE PLATOS EN EL ALGORITMO
function ponderar(a: any[], ponderacion: number): any {

  let arrayPonderado = [];
  a.forEach(function (element) {
    var repeticiones = Math.floor(ponderacion);
    for (let i = 0; i < repeticiones; i++) {
      arrayPonderado.push(element);
    }
  });

  return arrayPonderado;
}

function getPlatoAleatorioPonderado(platosValidos: any[]): any {

  let otrosPlatos = platosValidos.slice();
  let platosLove = getPlatosPorGusto(platosValidos, 1, otrosPlatos);//PLATOS LOVE
  let platosLike = getPlatosPorGusto(platosValidos, 0, otrosPlatos);//PLATOS LIKE
  let platosOrigenCambio = getPlatosPorCambio(platosValidos, 0, otrosPlatos);//PLATOS ORIGEN CAMBIO
  let platosDestinoCambio = getPlatosPorCambio(platosValidos, 1, otrosPlatos);//PLATOS DESTINO CAMBIO

  let platosLovePonderado = ponderar(platosLove, 5);
  let platosLikePonderado = ponderar(platosLike, 4);
  let platosDestinoCambioPonderado = ponderar(platosDestinoCambio, 3);
  let otrosPlatosPonderado = ponderar(otrosPlatos, 2);
  let platosOrigenCambioPonderado = ponderar(platosOrigenCambio, 1);

  //Unir todos en un solo array
  let platosValidosPonderados = platosLovePonderado.concat(platosLikePonderado, platosDestinoCambioPonderado, otrosPlatosPonderado, platosOrigenCambioPonderado);

  let platoAleatorioPonderado = getAleatorio(platosValidosPonderados);
  
  return platoAleatorioPonderado;

}

function getPlatosPorGusto(platosValidos: any[], gusto: number, otrosPlatos: any[]): any[] {
  let platos: any[] = [];
  let gustosPlatos = Familias.findOne({ _id: Meteor.userId }).gustos_platos;
  for (let i = 0; i < gustosPlatos.length; i++) {
    if (gustosPlatos[i].valor == gusto) {
      let plato = Platos.findOne({ _id: gustosPlatos[i].id_plato });
      if (platosValidos.indexOf(plato) >= 0) {
        platos.push(plato);
        otrosPlatos.splice(otrosPlatos.indexOf(plato), 1);
      }
    }
  }
  return platos;
}

function getPlatosPorCambio(platosValidos: any[], cambio: number, otrosPlatos: any[]): any[] {
  let platos: any[] = [];
  let cambiosPlatos = Familias.findOne({ _id: Meteor.userId }).cambios_platos;
  for (let i = 0; i < cambiosPlatos.length; i++) {
    let plato;
    if (cambio == 0) {//ORIGEN
      plato = Platos.findOne({ _id: cambiosPlatos[i].id_origen });
    }
    else if (cambio == 1) {//DESTINO
      plato = Platos.findOne({ _id: cambiosPlatos[i].id_destino });
    }
    if (platosValidos.indexOf(plato) >= 0) {
      platos.push(plato);
      otrosPlatos.splice(otrosPlatos.indexOf(plato), 1);
    }

  }
  return platos;
}



function getAlimentosValidos(consumo: consumoAlimentos[], menuDia: Plato[], alimentosDiaAnterior: string[]): string[] {

  let alimentos: string[] = [];

  //Primero nos aseguramos que se han consumido los alimentos mínimos
  for (let i = 0; i < consumo.length; i++) {
    let alimento: string = consumo[i].alimento;

    //Reparte los alimentos diarios
    if (consumo[i].minDiario != null) {
      alimentos.push(alimento);
    }

    if (consumo[i].minSemanal != null && consumo[i].maxSemanal != null) {

      //Reparte los alimentos que no han alcanzado su máximo semanal si son válidos
      if (consumo[i].consumoSemanal < consumo[i].maxSemanal) {
        if (esAlimentoValido(alimento, menuDia, alimentosDiaAnterior)) {
          alimentos.push(alimento);
        }
      }
    }

  }

  return alimentos;
}

function getAlimentosNoValidos(consumo: consumoAlimentos[], menuDia: Plato[], alimentosDiaAnterior: string[]): string[] {

  let alimentos: string[] = [];

  for (let i = 0; i < consumo.length; i++) {
    let alimento: string = consumo[i].alimento;

    //Los alimentos que han alcanzado su máximo semanal no son válidos
    if (consumo[i].maxSemanal != null) {
      if (consumo[i].consumoSemanal == consumo[i].maxSemanal) {
        alimentos.push(alimento);
      } else {
        if (!esAlimentoValido(alimento, menuDia, alimentosDiaAnterior)) {
          alimentos.push(alimento);
        }
      }
    }

  }
  return alimentos;

}

function esAlimentoValido(alimento: string, menuDia: Plato[], alimentosAyer: string[]): boolean {

  let nombreAlimentosAyer: string[] = [];
  let nutrientesDia: any[] = [];
  let nutrientesMomento: any[] = [];
  let alimentoCompleto: Alimento = Alimentos.findOne({ _id: alimento });


  if (menuDia.length != 0) {

    if (menuDia.length == 1 || menuDia.length == 3) { //Si hay sólo un plato en el momento quiere decir que no debo repetir en el momento
      //Recojo los nutrientes de los platos del MOMENTO
      for (let i = 0; i < menuDia[menuDia.length - 1].alimentos.length; i++) {
        let nutrientes = getNutrientesAlimento(menuDia[menuDia.length - 1].alimentos[i]);
        for (let j = 0; j < nutrientes.length; j++) {
          nutrientesMomento.push(nutrientes[j]);
        }
      }

      for (let i = 0; i < nutrientesMomento.length; i++) {
        for (let j = 0; j < alimentoCompleto.nutrientes.length; j++) {
          if (alimentoCompleto.nutrientes[j] == nutrientesMomento[i]) {
            return false;
          }
        }
      }

    }
    //Recojo los nutrientes de los platos de HOY
    for (let i = 0; i < menuDia.length; i++) {
      if (menuDia[i]._id != undefined) {
        for (let j = 0; j < menuDia[i].alimentos.length; j++) {
          let nutrientes = getNutrientesAlimento(menuDia[i].alimentos[j]);
          nutrientesDia.push(nutrientes);
        }
      }
    }

    let nutrientesAlimento: string = alimentoCompleto.nutrientes.toString();
    for (let j = 0; j < nutrientesDia.length; j++) {
      let nutrientesPlatoDia: string = nutrientesDia[j].toString();
      if (nutrientesAlimento == nutrientesPlatoDia) { //Tienen los mismos nutrientes
        return false;
      }
    }


  }

  //Recojo los alimentos que ya se han consumido AYER
  if (alimentosAyer.length != 0) {
    for (let i = 0; i < alimentosAyer.length; i++) {
      if (alimentosAyer[i] == alimento) {
        return false;
      }
    }

  }

  return true;
}

function getPlatosValidos(momento: string, tipo: string, alimentosValidos: string[], alimentosNoValidos: string[], alimentosMin: string[], menuDia: Plato[], menu: Menu): Plato[] {

  let platos: Plato[] = [];
  let platosSemana = [];
  let platosSemanaAnterior = [];
  let tiposalimentosAyer = [];
  let alimentosMinimosDiarios = [];
  let platosNoValidos = [];
  let ingredientesNoValidos = [];
  let familia: Familia = Familias.findOne({ _id: Meteor.userId });

  let condicionesDificultad: string[] = [];

  if (familia.dificultad == 'BAJA') {
    condicionesDificultad.push("BAJA");
  }
  else if ((familia.dificultad == 'MEDIA')) {
    condicionesDificultad.push("MEDIA");
    condicionesDificultad.push("BAJA");
  }
  else if (familia.dificultad == 'ALTA') {
    condicionesDificultad.push("ALTA");
    condicionesDificultad.push("MEDIA");
    condicionesDificultad.push("BAJA");
  }


  //Recojo los platos de la semana
  platosSemana = getNombrePlatosMenu(menuDia, menu);


  //No son válidos los platos que la familia ha marcado en sus gustos como negativo

  for (let i = 0; i < familia.gustos_platos.length; i++) {
    if (familia.gustos_platos[i].valor == -1) {
      platosNoValidos.push(familia.gustos_platos[i].id_plato);
    }
  }

  //No son válidos los platos que lleven ingredientes que la familia ha marcado en sus gustos como negativo

  for (let i = 0; i < familia.gustos_ingredientes.length; i++) {
    if (familia.gustos_ingredientes[i].valor == -1) {
      ingredientesNoValidos.push(familia.gustos_ingredientes[i].id_ingrediente);
    }
  }

  //No son válidos los platos cuyos alimentos hayan sido marcados por la familia en sus gustos como negativo
  for (let i = 0; i < familia.gustos_alimentos.length; i++) {
    if (familia.gustos_alimentos[i].valor == -1) {
      alimentosNoValidos.push(familia.gustos_alimentos[i].id_alimento);
    }
  }


  //Recojo los platos de la semana anterior
  //platosSemanaAnterior = getIdPlatosMenu(menuAnterior);

  //Que cumpla las condiciones
  //1. Que sea un plato que contenga alimentos válidos
  //2. Que sea un plato que no esté ya metido en el menú
  //3. Que sea un plato del momento (ALMUERZO/CENA)
  //4. Que sea un plato del tipo (PRIMERO/SEGUNDO)
  //5. Que sea un plato que no tenga los mismos tipos de alimentos que los platos de HOY (Esto se controla en esalimentoValido)
  //6. Que sea un plato qu eno tenga los mismos alimentos que los platos de AYER (Esto se controla en esalimentoValido)
  platos = Platos.find({
    $and: [

      {
        $and: [{
          _id:
          {
            $nin: platosSemana
          }
        }, {
          _id: {
            $nin: platosNoValidos
          }
        }
        ]
      },
      {
        alimentos:
        {
          $nin: alimentosNoValidos
        }
      },
      {
        ingredientes: {
          $nin: ingredientesNoValidos
        }
      },
      /*{
        alimentos:
        {
          $in: alimentosValidos
        }
      },*/
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
      },
      {
        tiempo: { $lte: familia.tiempo }
      },
      {
        dificultad: { $in: condicionesDificultad }
      }
    ]
  }).fetch();

  if (platos.length == 0) {
    platos.push({
      _id: undefined,
      nombre: undefined,
      imagenUrl: "http://4a5on91qiys62e6d1d3mlkoa-wpengine.netdna-ssl.com/hiv-id-observations/wp-content/uploads/sites/2/2014/01/White_square_with_question_mark1.png",
      descripcion: undefined,
      dificultad: undefined, // BAJA, MEDIA, ALTA
      tiempo: undefined, // En minutos
      tipos: undefined, // PRIMERO, SEGUNDO
      momentos: undefined, // ALMUERZO, CENA
      alimentos: alimentosMin,
      temporada: undefined, // PRIMAVERA, VERANO, OTOÑO INVIERNO
      ingredientes: undefined
    });
  }

  return platos;
}

function consumirAlimentosPlato(plato: Plato, consumo: consumoAlimentos[]): consumoAlimentos[] {
  let alimentosPlato: string[] = [];

  for (let i = 0; i < plato.alimentos.length; i++) {
    for (let j = 0; j < consumo.length; j++) {
      if (consumo[j].alimento == plato.alimentos[i]) {
        if (consumo[j].minDiario != null && consumo[j].minDiario > consumo[j].consumoDiario) { //Si es reparto diario de alimentos
          consumo[j].consumoDiario++;
          consumo[j].consumoSemanal++;
        } else { //Si es reparto semanal de alimentos
          consumo[j].consumoSemanal++;
        }
      }
    }
  }
  return consumo;
}

function getNombrePlatosMenu(menuDia: Plato[], menu: Menu): string[] {

  let platos: string[] = [];
  for (let i = 0; i < menu.dieta.length; i++) {
    let j = 0;
    while (j < 2) {
      platos.push(menu.dieta[i].almuerzo[j]._id);
      platos.push(menu.dieta[i].cena[j]._id);
      j++;
    }
  }
  for (let i = 0; i < menuDia.length; i++) {
    platos.push(menuDia[i]._id);
  }

  return platos;
}

function getNutrientesAlimento(nombrealimento: string): string[] {
  let alimento: Alimento = Alimentos.findOne({ _id: nombrealimento });
  let nutrientesAlimento: string[] = [];

  for (let i = 0; i < alimento.nutrientes.length; i++) {
    nutrientesAlimento.push(alimento.nutrientes[i]);
  }

  return nutrientesAlimento;
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

function getAlimentosUltimoDia(dietaUltimoDia: Dieta): string[] {

  let alimentosUltimoDia: string[] = [];

  if (dietaUltimoDia.almuerzo.length != 0) {
    for (let i = 0; i < dietaUltimoDia.almuerzo.length; i++) {
      if (dietaUltimoDia.almuerzo[i]._id != undefined) {
        for (let j = 0; j < dietaUltimoDia.almuerzo[i].alimentos.length; j++) {
          alimentosUltimoDia.push(dietaUltimoDia.almuerzo[i].alimentos[j]);
        }
      }
    }
  }
  if (dietaUltimoDia.cena.length != 0) {
    for (let i = 0; i < dietaUltimoDia.cena.length; i++) {
      if (dietaUltimoDia.cena[i]._id != undefined) {
        for (let j = 0; j < dietaUltimoDia.cena[i].alimentos.length; j++) {
          alimentosUltimoDia.push(dietaUltimoDia.cena[i].alimentos[j]);
        }
      }

    }
  }

  return alimentosUltimoDia;
}

function getAlimentosMinimos(consumo: consumoAlimentos[], menuDia: Plato[], alimentosAyer: string[]): string[] {
  let alimentosMin: string[] = [];
  for (let i = 0; i < consumo.length; i++) {
    if (consumo[i].minDiario != null && consumo[i].consumoDiario < consumo[i].minDiario) {
      alimentosMin.push(consumo[i].alimento);
    } else if (consumo[i].minSemanal != null && consumo[i].consumoSemanal < consumo[i].minSemanal) {
      if (esAlimentoValido(consumo[i].alimento, menuDia, alimentosAyer)) {
        alimentosMin.push(consumo[i].alimento);
      }
    }
  }
  if (alimentosMin.length == 0) {
    alimentosMin.push('VERDURA');
  }

  return alimentosMin;
}

function flat(r, a) {
  if (Array.isArray(a)) {
    return a.reduce(flat, r);
  }
  r.push(a);
  return r;
}


