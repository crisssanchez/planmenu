import { Meteor } from 'meteor/meteor';
import { Platos } from '../../../both/collections/platos.collection';
import { Plato } from '../../../both/models/plato.model';
import { Menus } from '../../../both/collections/menus.collection';
import { Menu } from '../../../both/models/menu.model';

Meteor.publish('platos', () => Platos.find());
