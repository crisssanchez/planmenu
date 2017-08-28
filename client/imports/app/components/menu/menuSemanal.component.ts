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
import { SEMANA } from '../../data';

import template from './menuSemanal.component.html';

@Component({
  selector:'menuSemanal',
  template
})

export class MenuSemanalComponent implements OnInit, OnDestroy{

  dias: string[];
  dieta: Dieta[];
  menu: Menu;
  menuSub: Subscription;


  ngOnInit(){
    this.dias = SEMANA;

    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
    this.menuSub = MeteorObservable.subscribe('menuSemanal', 'dani').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.menu = Menus.find({owner:'dani'}).fetch().reverse()[0];
        this.dieta = this.menu.dieta;
      });
    });
  }

  getPlatosAlmuerzo(dia:number){
    return this.dieta[dia].almuerzo;
  }

  getPlatosCena(dia:number){
    return this.dieta[dia].cena;
  }

  setFormatoFecha(fecha:Date){
    return `${this.dias[fecha.getUTCDay()]} ${fecha.getDate()}`;
  }

  


  ngOnDestroy(){
    this.menuSub.unsubscribe();
  }

}
