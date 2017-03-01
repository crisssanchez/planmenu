import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { Menu } from '../models/menu.model';

export const Menus = new MongoObservable.Collection<Menu>('menus');
