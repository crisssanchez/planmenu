import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import { Plato } from '../../../../both/models/plato.model';
import { Platos } from '../../../../both/collections/platos.collection';
import { Temporada } from '../data';
import { Dificultad } from '../data';
import { TipoPlato } from '../data';

import template from './platos.component.html';

@Component({
  selector:'platos',
  template
})

export class PlatosComponent implements OnInit, OnDestroy{

  platos: Observable<Plato[]>;
  platosSub: Subscription;

  ngOnInit(){
    this.platos = Platos.find({}).zone();
    this.platosSub = MeteorObservable.subscribe('platos').subscribe();
  }

  setPlato(plato: Plato):void{
    Platos.update({_id: plato._id}, {nombre: plato.nombre, dificultad:plato.dificultad, tiempo:plato.tipo, tipo:plato.tipo, nutrientes:plato.nutrientes, temporada:plato.temporada});
  }

  removePlato(plato: Plato): void {
    Platos.remove(plato._id);
  }

  insertPlato(plato: Plato):void{
    Platos.insert({nombre: "Menestra", imagen: "Menestra.jpg", dificultad:Dificultad.MEDIA,tiempo:30,tipo:TipoPlato.ACOMPAÑAMIENTO,nutrientes:["VERDURA/HORTALIZA"], temporada:[Temporada.PRIMAVERA,Temporada.OTOÑO,Temporada.INIVERNO,Temporada.VERANO]});
  }

  ngOnDestroy(){
    this.platosSub.unsubscribe();
  }
}
