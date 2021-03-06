import { Meteor } from 'meteor/meteor';

import './imports/publications/platos';
import './imports/publications/menus';
import './imports/publications/ingredientes';
import './imports/publications/productos';
import './imports/publications/alimentos';
import './imports/publications/familias';
import { AvisosManager } from './imports/AvisosManager';

Meteor.startup(() => {

  AvisosManager.getInstance().start();

});
