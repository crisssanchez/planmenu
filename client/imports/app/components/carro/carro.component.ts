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

  menuId: string = '26022017-04032017';
  //menuSub: Subscription;
  productosSub: Subscription;
  productos: Producto[];

  owner: string = 'dani';

  ngOnInit() {

    if (this.productosSub) {
      this.productosSub.unsubscribe();
    }
    this.productosSub = MeteorObservable.subscribe('productosMenu', this.menuId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.productos = Productos.find().fetch();

      })
    })
  }

  setActivo(producto: Producto, valor) {

    MeteorObservable.call('setActivoProductoMenu', this.menuId, producto, valor).subscribe();

  }

  removeProductoMenu(producto: Producto) {

    MeteorObservable.call('removeProductoMenu', this.menuId, producto).subscribe();

  }



  ngOnDestroy() {
    this.productosSub.unsubscribe();
  }


}
