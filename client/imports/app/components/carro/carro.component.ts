import { Productos } from '../../../../../both/collections/productos.collection';
import { Producto } from '../../../../../both/models/producto.model';
import { Ingredientes } from '../../../../../both/collections/ingredientes.collection';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';
import { Menus } from '../../../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../../../both/models/menu.model';

import template from './carro.component.html';

@Component({
  selector: 'carro',
  template
})
export class CarroComponent {

  menu: string = '26022017-04032017';
  //menuSub: Subscription;
  productosSub: Subscription;
  productos: Producto[];
  listaCompra: {
    nombre: string,
    platos: string[]
  }[] = [];

  owner: string = 'dani';

  ngOnInit() {
   /* if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
    this.menuSub = MeteorObservable.subscribe('menuSemanal', this.owner).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.menu = Menus.findOne({ owner: this.owner }, { sort: { numero: -1 } });
        this.ingredientes = this.getIngredientesMenu();
        this.platos = this.getPlatosMenu();
      });
    });*/

    if(this.productosSub){
      this.productosSub.unsubscribe();
    }
    this.productosSub = MeteorObservable.subscribe('productosMenu', this.menu).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.productos = Productos.find({menu: this.menu}).fetch();
        this.listaCompra = this.getListaCompra();
      })
    })
  }

  getListaCompra(){
    let listaCompra: {
      nombre: string,
      platos: string[]
    }[] = [];
    let productos: string[] = [];
    let platos: string[] = [];
    for(let i = 0; i < this.productos.length; i++){
      let producto:string = this.productos[i].nombre;
      if(productos.indexOf(producto) < 0){
        if(i != 0){
          listaCompra.push({
            nombre: productos[productos.length-1],
            platos: platos
          });
          platos = [];
          productos = [];
        }
        productos.push(producto);
        platos.push(this.productos[i].plato);
      }else{
        platos.push(this.productos[i].plato);
      }
    }
    listaCompra.push({
      nombre: productos[productos.length-1],
      platos: platos
    });
    return listaCompra;
  }


  /*
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

  getIngredientesMenu(): string[] {
    let ingredientes: string[] = [];
    let dietaMenu: Dieta[] = this.menu.dieta;

    for (let i = 0; i < dietaMenu.length; i++) {
      for (let j = 0; j < dietaMenu[i].almuerzo.length; j++) {
        let plato: Plato = dietaMenu[i].almuerzo[j];
        for (let k = 0; k < plato.ingredientes.length; k++) {
          if (ingredientes.indexOf(plato.ingredientes[k]) === -1) {
            ingredientes.push(plato.ingredientes[k]);
          }
        }
      }

      for (let j = 0; j < dietaMenu[i].cena.length; j++) {
        let plato: Plato = dietaMenu[i].cena[j];
        for (let k = 0; k < plato.ingredientes.length; k++) {
          if (ingredientes.indexOf(plato.ingredientes[k]) === -1) {
            ingredientes.push(plato.ingredientes[k]);
          }
        }
      }
    }
    return ingredientes;
  }

  getPlatosIngrediente(ingrediente: string): string[] {
    let platos: string[] = [];
    for (let i = 0; i < this.platos.length; i++) {
      for (let j = 0; j < this.platos[i].ingredientes.length; j++) {
        if (this.platos[i].ingredientes[j] == ingrediente) {
          if (platos.indexOf(this.platos[i].nombre) === -1) {
            platos.push(this.platos[i].nombre);
          }

        }
      }
    }
    return platos;
  }
  */

  ngOnDestroy() {
    //this.menuSub.unsubscribe();
    this.productosSub.unsubscribe();
  }


}
