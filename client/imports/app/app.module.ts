import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { LOCALE_ID } from '@angular/core';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

import { AppComponent } from './app.component';

//Rutas
import { APP_ROUTING, ROUTES_PROVIDERS } from './app.routes';

//Servicios
import { MapasService } from './services/mapas.service';

//Componentes
import { MENU_DECLARATIONS } from './components/menu';
import { PLATOS_DECLARATIONS } from './components/platos';
import { CARRO_DECLARATIONS} from './components/carro';
import { SHARED_DECLARATIONS } from './shared';
import { USUARIO_DECLARATIONS } from './components/usuario';
import { FamiliaService } from './services/familia.service';



@NgModule({
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    AccountsModule,
    APP_ROUTING,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0-d1lcAp_4Lj4Y0laVPXg8nOTJkQNlDg',
      libraries: ['places']
    })
  ],
  declarations: [
    AppComponent,
    ...MENU_DECLARATIONS,
    ...PLATOS_DECLARATIONS,
    ...CARRO_DECLARATIONS,
    ...SHARED_DECLARATIONS,
    ...USUARIO_DECLARATIONS
  ],
  providers:[
    {provide: LOCALE_ID , useValue:"es"},
    MapasService,
    FamiliaService,
    ...ROUTES_PROVIDERS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
