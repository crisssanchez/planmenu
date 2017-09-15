import { Productos } from '../../../both/collections/productos.collection';
Meteor.publish('productos', () => Productos.find());

Meteor.publish('producto', function (_id: string) {
  return Productos.find({ _id: _id });
});

Meteor.publish('productosMenu', function (menu_id: string) {
  return Productos.find({menu: menu_id},{sort:{nombre:1}});
});