import { ingredientePlato, Plato } from '../../../both/models/plato.model';
import { Ingrediente } from '../../../both/models/ingrediente.model';
import { Nutriente } from '../../../both/models/nutriente.model';
import { Nutrientes } from '../../../both/collections/nutrientes.collection';
import { Meteor } from 'meteor/meteor';

import { Platos } from '../../../both/collections/platos.collection';
import { DIFICULTAD, MOMENTO, TIPOPLATO } from '../../../client/imports/app/data';


Meteor.publish('platos', () => Platos.find({}, {limit: 15}));
Meteor.publish('plato', function (idPlato: string) {
  return Platos.find({ _id: idPlato })
});

Meteor.methods({
  guardarPlato(plato: Plato) {
    Platos.insert(plato);
  },

  generarPlatosAleatorios() {
    for (let i = 0; i < 1000; i++) {
      Platos.insert({
        nombre: getNombreAleatorio(),
        nutrientes: getNutrientesAleatorios(),
        dificultad: getDificultadAleatoria(),
        tiempo: getNumAleatorio(10, 120),
        tipos: getTiposPlato(),
        momentos: getMomentosPlato(),
        temporada: getTemporadasPlato(),
        ingredientes: getIngredientesAleatorios()
      });
    }
  }
});

function getNombreAleatorio(): string {
  let nombre: string = '';
  nombre = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
  return nombre;
}

function getNutrientesAleatorios(): string[] {
  let nutrientes: Nutriente[] = Nutrientes.find().fetch();
  let n: string[] = [];

  let num = getNumAleatorio(1, 3);
  for (let i = 0; i < num; i++) {
    n.push(getAleatorio(nutrientes)._id);
  }

  return n;
}

function getDificultadAleatoria(): string {
  let dificultad: any[] = ["BAJA", "MEDIA", "ALTA"];
  return getAleatorio(dificultad);

}

function getTiposPlato(): any[] {
  let tipos: any[] = ["PRIMERO", "SEGUNDO", "ACOMPAÑAMIENTO"];
  let t: string[] = [];
  let num = getNumAleatorio(1, 3);
  for (let i = 0; i < num; i++) {
    t.push(getAleatorio(tipos));
  }
  return t;
}

function getMomentosPlato(): any[] {
  let momentos: any[] = ["ALMUERZO", "CENA"];
  let m: string[] = [];
  let num = getNumAleatorio(1, 2);
  for (let i = 0; i < num; i++) {
    m.push(getAleatorio(momentos));
  }
  return m;
}

function getTemporadasPlato(): any[] {
  let temporadas: any[] = ["INVIERNO", "PRIMAVERA", "VERANO", "OTOÑO"];
  let t: string[] = [];
  let num = getNumAleatorio(1, 4);
  for (let i = 0; i < num; i++) {
    t.push(getAleatorio(temporadas));
  }
  return t;
}

function getMedidaIngrediente(): any {
  let medida: any[] = ["KG", "G", "L", "ML", "UNIDAD"];
  return getAleatorio(medida);
}

function getIngredientesAleatorios():ingredientePlato[] {
  let ingredientes: any[] = [];
  let num = getNumAleatorio(1, 5);
  for (let i = 0; i < num; i++) {
    ingredientes.push(
      {
        ingrediente: getNombreAleatorio(),
        cantidad: getNumAleatorio(1, 2),
        medida: getMedidaIngrediente()
      }
    );
  }
  return ingredientes;
}

function getNumAleatorio(min, max): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAleatorio(a: any[]): any {
  return a[Math.floor(Math.random() * a.length)];
}
