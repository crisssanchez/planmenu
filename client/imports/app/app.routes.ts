import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { MenusComponent } from './components/menu/menus.component';
import { MenuSemanalComponent } from './components/menu/menuSemanal.component'
import { PlatosComponent } from './components/platos/platos.component';
import { RecetaPlatoComponent } from './components/platos/recetaPlato.component';
import { NuevoPlatoComponent } from './components/platos/nuevoPlato.component';
import { CarroComponent } from './components/carro/carro.component';

import { Meteor } from 'meteor/meteor';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { FamiliaResolve } from './services/familia-resolve.service';

const APP_ROUTES: Routes = [
  { path: '', component: MenuSemanalComponent },
  { path: 'usuario', component: UsuarioComponent, canActivate:['canActivateForLoggedIn']},
  { path: 'menuSemanal', component: MenuSemanalComponent, canActivate:['canActivateForLoggedIn'], resolve: { fam: FamiliaResolve } },
  { path: 'menu/:_id', component: MenuComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'menus', component: MenusComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'recetaPlato', component: RecetaPlatoComponent },
  { path: 'recetaPlato/:_id', component: RecetaPlatoComponent },
  { path: 'recetaPlato/:_id/:nombre', component: RecetaPlatoComponent },
  { path: 'platos', component: PlatosComponent },
  { path: 'nuevoPlato', component: NuevoPlatoComponent , canActivate:['canActivateForLoggedIn']},
  { path: 'carro' , component: CarroComponent, canActivate:['canActivateForLoggedIn']}

];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !!Meteor.userId()
}];
