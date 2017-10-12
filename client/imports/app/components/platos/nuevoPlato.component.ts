import { NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';

import template from './nuevoPlato.component.html';
import style from './nuevoPlato.component.less';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';
import { Ingredientes } from '../../../../../both/collections/ingredientes.collection';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'nuevoPlato',
  styles: [style],
  template
})
export class NuevoPlatoComponent implements OnInit, OnDestroy {

  @ViewChild('f') form: NgForm;

  ingSub: Subscription;
  ings: Ingrediente[];

  nombre: string;
  imagenUrl: string;
  tiempo: number;
  descripcion: string;
  dificultad: string;
  primero: boolean = false;
  segundo: boolean = false;
  almuerzo: boolean = false;
  cena: boolean = false;
  primavera: boolean = true;
  verano: boolean = true;
  otono: boolean = true;
  invierno: boolean = true;

  posiblesNutrientes = [
    "LEGUMBRE",
    "CARNE ROJA",
    "CARNE BLANCA",
    "PESCADO AZUL",
    "PESCADO BLANCO",
    "VERDURA",
    "HUEVO",
    "PATATA",
    "PASTA",
    "ARROZ",
    "FRITO",
    "MARISCO",
    "LACTEO"
  ];

  nutrientes = {};

  ingredientes = [];

  resetValues() {
    this.nombre = undefined;
    this.imagenUrl = undefined;
    this.tiempo = undefined;
    this.descripcion = undefined;
    this.dificultad = undefined;
    this.primero = false;
    this.segundo = false;
    this.almuerzo = false;
    this.cena = false;
    this.primavera = false;
    this.verano = false;
    this.otono = false;
    this.invierno = false;
    this.nutrientes = {};
    this.ingredientes = [];
  }

  ngOnInit() {

    this.ingSub = MeteorObservable.subscribe('ingredientes').subscribe(() => {
      //this.ings = Ingredientes.collection.find().fetch();
    });

    for (let nutriente in this.posiblesNutrientes) {
      this.nutrientes[nutriente] = false;
    }

  }

  ngOnDestroy() {

  }

  findIngs(nombre) {
    if (!nombre) {
      this.resetIngs();
    } else {
      this.ings = Ingredientes.collection.find({nombre:{'$regex' : '^' + nombre, '$options' : 'i'}}).fetch();
    }
  }

  resetIngs() {
    this.ings = [];
  }

  selectDificultad(dif: string) {
    this.dificultad = dif;
  }

  addIngrediente() {
    if (this.ingredientes.length === 0 || this.ingredientes[this.ingredientes.length - 1].ingrediente !== '') {
      this.ingredientes.push({
        ingrediente: '',
        opened: false
      });
    } 
  }

  setIngText(i: number, ing: string) {
    this.ingredientes[i].ingrediente = ing;
    this.ingredientes[i].opened = false;
  }

  setValueFirstIng(i: number) {
    if (this.ings && this.ings.length) {
      this.ingredientes[i].ingrediente = this.ings[0].nombre;
      this.ingredientes[i].opened = false;
    }
  }

  deleteIngrediente(index: number) {
    this.ingredientes.splice(index, 1);
  }

  guardarPlato() {
    if(!Meteor.userId()){
      alert('Inicie sesión para poder añadir un plato');
      return;
    }
    let plato: Plato = {
      nombre: '',
      nutrientes: []
    };

    plato.nombre = this.nombre;
    plato.imagenUrl = this.imagenUrl;
    plato.descripcion = this.descripcion;
    plato.dificultad = this.dificultad;
    plato.tiempo = this.tiempo;
    plato.tipos = [];
    if (this.primero || this.segundo) {
      if (this.primero)
        plato.tipos.push('PRIMERO');
      if (this.segundo)
        plato.tipos.push('SEGUNDO');
    }

    if (this.almuerzo || this.cena) {
      plato.momentos = [];
      if (this.almuerzo)
        plato.momentos.push('ALMUERZO');
      if (this.cena)
        plato.momentos.push('CENA');
    }

    if (this.primavera ||  this.verano ||  this.otono || this.invierno) {
      plato.temporada = [];
      if (this.primavera)
        plato.temporada.push('PRIMAVERA');
      if (this.verano)
        plato.temporada.push('VERANO');
      if (this.otono)
        plato.temporada.push('OTOÑO');
      if (this.invierno)
        plato.temporada.push('INVIERNO');
    }

    plato.nutrientes = [];
    for (let nutriente of this.posiblesNutrientes) {
      if (this.nutrientes[nutriente]) {
        plato.nutrientes.push(nutriente);
      }
    }
    if (this.ingredientes) {
      plato.ingredientes = [];
    }
    for (let ingrediente of this.ingredientes) {
      plato.ingredientes.push(ingrediente.ingrediente);
      MeteorObservable.call('addIngrediente', ingrediente.ingrediente).subscribe(() => {});
    }

    MeteorObservable.call('guardarPlato', plato).subscribe(() => {
      this.resetValues();
    });

  }



}
