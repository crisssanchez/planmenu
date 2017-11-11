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
import { LoginComponent } from './components/login.component';

const APP_ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent, canActivate:['canActivateForLoggedIn']},
  { path: 'menuSemanal', component: MenuSemanalComponent, canActivate:['canActivateForLoggedIn'], resolve: { fam: FamiliaResolve } },
  { path: 'menu/:_id', component: MenuComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'menus', component: MenusComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'recetaPlato', component: RecetaPlatoComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'recetaPlato/:_id', component: RecetaPlatoComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'recetaPlato/:_id/:nombre', component: RecetaPlatoComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'platos', component: PlatosComponent, canActivate:['canActivateForLoggedIn'] },
  { path: 'nuevoPlato', component: NuevoPlatoComponent , canActivate:['canActivateForLoggedIn']},
  { path: 'carro' , component: CarroComponent, canActivate:['canActivateForLoggedIn']}

];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !!Meteor.userId()
}];
