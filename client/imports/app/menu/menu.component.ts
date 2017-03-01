import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../../../both/models/menu.model';
import { Dieta } from '../../../../both/models/menu.model';
import { Menus } from '../../../../both/collections/menus.collection';
import { Plato } from '../../../../both/models/plato.model';
import { Platos } from '../../../../both/collections/platos.collection';
import { SEMANA } from './data';

import template from './menu.component.html';
interface DiaSemana {
  id: number;
  name:string;
}

@Component({
  selector:'menu',
  template
})

export class MenuComponent implements OnInit, OnDestroy{

  platos: Observable<Plato[]>;
  platosSub: Subscription;
  dias: DiaSemana[];
  fechas: string[];
  dieta: Dieta[];
  menuSub: Subscription;
  menu: Menu;

  ngOnInit(){
    this.platos = Platos.find({}).zone();

    //this.platosSub = MeteorObservable.subscribe('platos_menu','dani').subscribe();
    this.menuSub = MeteorObservable.subscribe('platos_menu', 'cris').subscribe(() => {
        //this.menu = Menus.findOne({owner:'cris'});
        //this.getFechas(this.menu);
      });


    this.dias = SEMANA;
  }

  getFechas(menu:Menu){

      //this.fechas = menu.dieta.map(function(doc){return doc.fecha});

  }

  setCongelado(plato:Plato):void{
    Platos.update({_id: plato._id}, {nombre: plato.nombre, congelado:!plato.congelado});
  }

  isCongelado(plato: Plato): boolean{
    return plato.congelado;
  }

  setPlato(plato: Plato):void{
    Platos.update({_id: plato._id}, {nombre: plato.nombre, congelado:plato.congelado});
  }

  removePlato(plato: Plato): void {
    Platos.remove(plato._id);
  }

  insertPlato(plato: Plato):void{
    Platos.insert({nombre: "Gazpacho", congelado: false});
  }

  ngOnDestroy(){
    this.menuSub.unsubscribe();
  }

}
