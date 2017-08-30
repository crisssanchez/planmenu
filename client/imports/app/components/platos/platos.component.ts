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
import { MOMENTO } from '../../data';

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
    this.platos = Platos.find({ $or: [ {"nombre": { $regex: cadena, $options: "i"}},
                                      {"dificultad": {$regex: cadena, $options: "i"}},
                                      {"tiempo": Number(cadena)},
                                      {"tipos":{$regex: cadena, $options: "i"}},
                                      {"momentos":{$regex: cadena, $options: "i"}},
                                      {"nutrientes":{$regex: cadena, $options: "i"}}]}).zone();
  }


  setPlato(plato: Plato):void{
    Platos.update({_id: plato._id}, {nombre: plato.nombre, dificultad:plato.dificultad, tiempo:plato.tiempo, tipos:plato.tipos, nutrientes:plato.nutrientes, momentos:plato.momentos});
  }

  removePlato(plato: Plato): void {
    Platos.remove(plato._id);
  }

  insertPlato(plato: Plato):void{
   // Platos.insert({nombre: "Menestra", dificultad:DIFICULTAD.MEDIA,tiempo:30,tipos:[TIPOPLATO.ACOMPAÑAMIENTO],nutrientes:["VERDURA/HORTALIZA"], momentos:[MOMENTO.ALMUERZO]});
  }

  generarPlatos(){
    MeteorObservable.call('generarPlatosAleatorios').subscribe();
  }


  ngOnDestroy(){
    this.platosSub.unsubscribe();
  }
}
