import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';
import { TEMPORADA } from '../../data';
import { DIFICULTAD } from '../../data';
import { TIPOPLATO } from '../../data';

import template from './platos.component.html';

@Component({
  selector:'platos',
  template
})

export class PlatosComponent implements OnInit, OnDestroy{

  platos: Observable<Plato[]>;
  platosSub: Subscription;

  constructor( private router:Router,
   ){

  }

  ngOnInit(){
    this.platos = Platos.find({}).zone();
    this.platosSub = MeteorObservable.subscribe('platos').subscribe();
  }

  buscarPlato( cadena:string ){
    console.log(cadena);
    this.platos = Platos.find({"nombre": { $regex: cadena, $options: "i"}}).zone();
  }


  setPlato(plato: Plato):void{
    Platos.update({_id: plato._id}, {nombre: plato.nombre, dificultad:plato.dificultad, tiempo:plato.tipo, tipo:plato.tipo, nutrientes:plato.nutrientes, temporada:plato.temporada});
  }

  removePlato(plato: Plato): void {
    Platos.remove(plato._id);
  }

  insertPlato(plato: Plato):void{
    Platos.insert({nombre: "Menestra", imagen: "Menestra.jpg", dificultad:DIFICULTAD.MEDIA,tiempo:30,tipo:TIPOPLATO.ACOMPAÑAMIENTO,nutrientes:["VERDURA/HORTALIZA"], temporada:[TEMPORADA.PRIMAVERA,TEMPORADA.OTOÑO,TEMPORADA.INIVERNO,TEMPORADA.VERANO]});
  }

  ngOnDestroy(){
    this.platosSub.unsubscribe();
  }
}
