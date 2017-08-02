import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './components/menu/menu.component';
import { MenusComponent } from './components/menu/menus.component';
import { MenuSemanalComponent } from './components/menu/menuSemanal.component'
import { PlatosComponent } from './components/platos/platos.component';
import { RecetaPlatoComponent } from './components/platos/recetaPlato.component';
import { NuevoPlatoComponent } from './components/platos/nuevoPlato.component';
import { CarroComponent } from './components/carro/carro.component';

const APP_ROUTES: Routes = [
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
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
