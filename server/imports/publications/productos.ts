import { Producto } from '../../../both/models/producto.model';
import { Productos } from '../../../both/collections/productos.collection';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../both/models/menu.model';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Meteor } from 'meteor/meteor';

Meteor.publish('productos', () => Productos.find());

Meteor.publish('producto', function (_id: string) {
  return Productos.find({ _id: _id });
});

Meteor.publishComposite('productosMenu', function(): PublishCompositeConfig<Menu> {
  return {
    find: () => {
      return Menus.collection.find({owner:Meteor.userId()},{sort:{numero:-1}});
    },
    children: [
      <PublishCompositeConfig1<Menu,Producto>>{
        find: (menu) => {
          return Productos.collection.find({ menu: menu._id }, { sort: { nombre: 1 } });
        }
      }
    ]
  };

  // return Productos.find({ menu: menu_id }, { sort: { nombre: 1 } });
});

Meteor.methods({

  addProductosMenuCarro(menu: Menu) {



    let platosMenu: Plato[] = getPlatosMenu(menu);

    let orden = 0;
    for (let i = 0; i < platosMenu.length; i++) { //Por cada plato
      let plato: Plato = platosMenu[i];
      if (platosMenu[i]._id != undefined) {
        let ingredientes: string[] = plato.ingredientes;

        for (let j = 0; j < ingredientes.length; j++) { //por cada ingrediente del plato
          let platosProducto: string[] = [];
          if (Productos.findOne({ menu: menu._id, nombre: ingredientes[j] }) != undefined) { //Si ya está en productos actualizo el array de platos
            platosProducto = Productos.findOne({ menu: menu._id, nombre: ingredientes[j] }).platos;
            if (platosProducto.indexOf(plato.nombre) < 0) {
              platosProducto.push(plato.nombre);
              Productos.update({ menu: menu._id, nombre: ingredientes[j] }, { $set: { platos: platosProducto } });
            }

          } else { //Si no está en productos lo añado
            platosProducto.push(plato.nombre);
            orden++;
            Productos.insert({
              menu: menu._id,
              orden: orden,
              nombre: ingredientes[j],
              platos: platosProducto,
              activo: true
            });
          }
        }
      }

    }
  },

  vaciarCarro(menu: Menu) {
    Productos.collection.remove({menu: menu._id});
  },

  addProductoCarro(menuId: string, producto:string){
    Productos.insert({menu:menuId,nombre: producto,activo:true, orden: -1});
  },

  setActivoProductoMenu(menuId: string, producto: Producto, valor: boolean) {
    Productos.update({ menu: menuId, nombre: producto.nombre }, { $set: { activo: valor } });
  },

  removeProductoMenu(menuId: string, producto: Producto) {
    Productos.remove({ menu: menuId, nombre: producto.nombre });
  }
});

function getPlatosMenu(menu: Menu): Plato[] {

  let platos: Plato[] = [];
  let dietaMenu: Dieta[] = menu.dieta;
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