import { Familias } from "../../both/collections/familias.collection";
import { Familia } from '../../both/models/familia.model';
import { Email } from "meteor/email";
import { Menu } from '../../both/models/menu.model';
import { Menus } from '../../both/collections/menus.collection';
import { Productos } from "../../both/collections/productos.collection";


export class AvisosManager {

  private static instance;

  private schedule;

  private job;

  private constructor() {
    this.schedule = require('node-schedule');
  }

  static getInstance(): AvisosManager {
    if (!this.instance) {
      this.instance = new AvisosManager();
    }

    return this.instance;
  }

  start() {
    this.job = this.schedule.scheduleJob('0 8 * * *', Meteor.bindEnvironment(function (error, result) {
      let hoy = this.getDayText(new Date().getUTCDay());
      let familias = Familias.collection.find({ comienzo: hoy }).fetch();
      for (let fam of familias) {
        Meteor.call('generarMenuSemana',
          (result: Menu) => {
            //this.enviarMenuSemanal(fam, result);
          },
          (err) => {
          }
        );
      }

      familias = Familias.collection.find({ avisos: 1 }).fetch();
      for (let fam of familias) {
        let menu = Menus.collection.findOne({owner: fam._id}, {sort: { numero: -1}});
        this.enviarMenuDiario(fam, menu);
      }
    }));
  }

  enviarMenuSemanal(familia: Familia, menu: Menu) {
    Email.send({
      from: 'info@planmenu.es',
      to: familia.email,
      subject: 'Menú para esta semana',
      html: this.generarHTMLSemanal(familia, menu)
    });
  }

  enviarMenuDiario(familia: Familia, menu: Menu) {
    Email.send({
      from: 'info@planmenu.es',
      to: familia.email,
      subject: 'Menú para hoy',
      html: this.generarHTMLDiario(familia, menu)
    });
  }

  private generarHTMLDiario(familia: Familia, menu: Menu) {
    return this.generarHTML(familia, menu, true);
  }

  private generarHTMLSemanal(familia: Familia, menu: Menu) {
    return this.generarHTML(familia, menu, false);
  }

  private generarHTML(familia: Familia, menu: Menu, diario: boolean) {
    let html = '¡Hola! Aquí tiene el menú para';
    if (diario)
      html += ' hoy:';
    else
      html += ' esta semana:';
    html += '</br></br>';

    html += `
      <style>
        table td {
          border: solid 1px black;
        }

        td.momento {
          background-color: #D0F5A9;
        }

        td.almuerzo {
          background-color: #F5F6CE;
        }

        td.cena {
          background-color: #ECCEF5;
        }

        td.dia {
          background-color: #F2F2F2;
        }

      </style>
    `;



    html += '<table>'

    html += '<tr>';
    for (let d of menu.dieta) {
      if (!diario || this.today(d.fecha)) {
        html += '<td class="dia">';
        html += this.getDayText(d.fecha.getUTCDay()) + ' ' + d.fecha.getDate();
        html += '</td>';
      }
    }
    html += '</tr>';

    html += '<tr><td class="momento" colspan=7 style="text-align: center;">Alumerzo</td></tr>';

    html += '<tr>';
    for (let d of menu.dieta) {
      if (!diario || this.today(d.fecha)) {
        html += '<td class="almuerzo">';
        html += this.checkNombre(d.almuerzo[0].nombre);
        html += '</td>';
      }
    }
    html += '</tr>';

    html += '<tr>';
    for (let d of menu.dieta) {
      if (!diario || this.today(d.fecha)) {
        html += '<td class="almuerzo">';
        html += this.checkNombre(d.almuerzo[1].nombre);
        html += '</td>';
      }
    }
    html += '</tr>';

    html += '<tr><td class="momento" colspan=7 style="text-align: center;">Cena</td></tr>';

    html += '<tr>';
    for (let d of menu.dieta) {
      if (!diario || this.today(d.fecha)) {
        html += '<td class="cena">';
        html += this.checkNombre(d.cena[0].nombre);
        html += '</td>';
      }
    }
    html += '</tr>';

    html += '<tr>';
    for (let d of menu.dieta) {
      if (!diario || this.today(d.fecha)) {
        html += '<td class="cena">';
        html += this.checkNombre(d.cena[1].nombre);
        html += '</td>';
      }
    }
    html += '</tr>';

    html += '</table>';

    html += '</br></br>';

    if (!diario) {
      html += this.generarHTMLListaCompra(familia, menu);
    }

    html += 'Muchas gracias por utilizar nuestro servicio. ¡Buen provecho!'
    return html;
  }

  private generarHTMLListaCompra(familia: Familia, menu: Menu): string {
    let productos = Productos.collection.find({ menu: menu._id }, { sort: { orden: 1 } }).fetch();
    let html = 'Su lista de la compra para esta semana: </br></br><ul>';
    for (let p of productos) {
      html += `<li>${p.nombre}</li>`;
    }
    html += '</ul>';
    return html;
  }

  private checkNombre(nombre: string): string {
    if (nombre === undefined) {
      return "Sin definir";
    } else {
      return nombre;
    }
  }

  private getDayText(day: number): string {
    if (day === 0) {
      return "Domingo";
    } else if (day === 1) {
      return "Lunes";
    } else if (day === 2) {
      return "Martes";
    } else if (day === 3) {
      return "Miércoles";
    } else if (day === 4) {
      return "Jueves";
    } else if (day === 5) {
      return "Viernes";
    } else if (day === 6) {
      return "Sábado";
    } else {
      return "Lunes";
    }
  }

  private today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
  }



}