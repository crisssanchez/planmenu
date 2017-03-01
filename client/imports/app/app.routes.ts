import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { MenuComponent } from './menu/menu.component';
import { PlatosComponent } from './menu/platos.component';
import { CarroComponent } from './carro/carro.component';

export const routes: Route[] = [
  { path: '', component: MenuComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'platos', component: PlatosComponent },
  { path: 'carro' , component: CarroComponent}
];
