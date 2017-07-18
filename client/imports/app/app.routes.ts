import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { MenuComponent } from './menu/menu.component';
import { MenusComponent } from './menu/menus.component';
import { MenuSemanalComponent } from './menu/menuSemanal.component'
import { PlatosComponent } from './platos/platos.component';
import { RecetaPlatoComponent } from './platos/recetaPlato.component';
import { NuevoPlatoComponent } from './platos/nuevoPlato.component';
import { CarroComponent } from './carro/carro.component';

export const routes: Route[] = [
  { path: '', component: MenuSemanalComponent },
  { path: 'menuSemanal', component: MenuSemanalComponent },
  { path: 'menu/:_id', component: MenuComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'recetaPlato', component: RecetaPlatoComponent },
  { path: 'recetaPlato/:_id', component: RecetaPlatoComponent },
  { path: 'recetaPlato/:_id/:nombre', component: RecetaPlatoComponent },
  { path: 'platos', component: PlatosComponent },
  { path: 'nuevoPlato', component: NuevoPlatoComponent },
  { path: 'carro' , component: CarroComponent}
];
