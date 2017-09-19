import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../../../../both/models/menu.model';
import { Dieta } from '../../../../../both/models/menu.model';
import { Menus } from '../../../../../both/collections/menus.collection';

import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';
import { Producto } from '../../../../../both/models/producto.model';
import { Productos } from '../../../../../both/collections/productos.collection';
import { SEMANA } from '../../data';

import template from './menuSemanal.component.html';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';

@Component({
  selector: 'menuSemanal',
  template
})

export class MenuSemanalComponent implements OnInit, OnDestroy {

  dias: string[];
  dieta: Dieta[];
  menu: Menu;
  menuSub: Subscription;
  owner: string = 'dani';


  ngOnInit() {
    this.dias = SEMANA;

    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
    this.menuSub = MeteorObservable.subscribe('menuSemanal', this.owner).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.menu = Menus.findOne({ owner: this.owner }, { sort: { numero: -1 } });
        this.dieta = this.menu.dieta;
      });
    });
  }

  getPlatosAlmuerzo(dia: number) {
    return this.dieta[dia].almuerzo;
  }

  getPlatosCena(dia: number) {
    return this.dieta[dia].cena;
  }

  setFormatoFecha(fecha: Date) {
    return `${this.dias[fecha.getUTCDay()]} ${fecha.getDate()}`;
  }

  getPlatosMenu(): Plato[] {

    let platos: Plato[] = [];
    let dietaMenu: Dieta[] = this.menu.dieta;
    for (let i = 0; i < dietaMenu.length; i++) {
      for (let j = 0; j < dietaMenu[i].almuerzo.length; j++) {
        platos.push(dietaMenu[i].almuerzo[j]);
      }

      for (let j = 0; j < dietaMenu[i].cena.length; j++) {
        platos.push(dietaMenu[i].cena[j]);
      }
    }
    return platos;

  }

  addProductosMenuCarro() {
    MeteorObservable.call('addProductosMenuCarro', this.menu).subscribe();
  }

  ngOnDestroy() {
    this.menuSub.unsubscribe();
  }

}
