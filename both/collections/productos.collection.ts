import { MongoObservable } from 'meteor-rxjs';
import { Producto } from '../models/producto.model';
export const Productos = new MongoObservable.Collection<Producto>('productos');