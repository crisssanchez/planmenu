import { Plato } from '../../../both/models/plato.model';
import { Ingrediente } from '../../../both/models/ingrediente.model';
import { Alimento } from '../../../both/models/alimento.model';
import { Alimentos } from '../../../both/collections/alimentos.collection';
import { Meteor } from 'meteor/meteor';

import { Platos } from '../../../both/collections/platos.collection';
import { DIFICULTAD, MOMENTO, TIPOPLATO } from '../../../client/imports/app/data';


Meteor.publish('platos', () => Platos.find({}, { limit: 100 }));
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
        alimentos: getAlimentosAleatorios(),
        dificultad: getDificultadAleatoria(),
        tiempo: getNumAleatorio(10, 120),
        tipos: getTiposPlato(),
        momentos: getMomentosPlato(),
        temporada: getTemporadasPlato(),
        ingredientes: getIngredientesAleatorios()
      });
    }
  },

  getPlatosAlternativos(p: Plato) {
    let platosAlternativos: Plato[] = [];
    let alternativas: Plato[] = [];

    let plato: Plato = p;
    let condiciones = {}
    if (p._id) {
      plato = Platos.findOne({ _id: p._id });
      condiciones = {
        $and: [
          {
            _id: {
              $ne: plato._id
            }
          },
          {
            alimentos: {
              $all: plato.alimentos
            }
          },
          {
            momentos: {
              $in: plato.momentos
            }
          },
          {
            tipos: {
              $in: plato.tipos
            }
          }
        ]
      };
    } else {
      condiciones = {
        $and: [
          {
            alimentos: {
              $all: plato.alimentos
            }
          },
          // {
          //   momentos: {
          //     $in: plato.momentos
          //   }
          // },
          // {
          //   tipos: {
          //     $in: plato.tipos
          //   }
          // }
        ]
      }
    }


    alternativas = Platos.find(condiciones).fetch();

    let numPlatos = 0;
    if (alternativas.length > 3) {
      numPlatos = 3
    } else {
      numPlatos = alternativas.length;
    }
    for (let i = 0; i < numPlatos; i++) {
      let platoAleatorio = getAleatorio(alternativas);
      platosAlternativos.push(platoAleatorio);
      alternativas.splice(alternativas.indexOf(platoAleatorio), 1);
    }

    return platosAlternativos;
  }
});

function getNombreAleatorio(): string {
  let nombre: string = '';
  nombre = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
  return nombre;
}

function getAlimentosAleatorios(): string[] {
  let alimentos: Alimento[] = Alimentos.find().fetch();
  let n: string[] = [];

  let num = getNumAleatorio(1, 3);
  for (let i = 0; i < num; i++) {
    n.push(getAleatorio(alimentos)._id);
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

function getIngredientesAleatorios(): string[] {
  let ingredientes: any[] = [];
  let num = getNumAleatorio(1, 5);
  for (let i = 0; i < num; i++) {
    ingredientes.push(getNombreAleatorio());
  }
  return ingredientes;
}

function getNumAleatorio(min, max): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAleatorio(a: any[]): any {
  return a[Math.floor(Math.random() * a.length)];
}
