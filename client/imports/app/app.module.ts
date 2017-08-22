import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';

//Rutas
import { APP_ROUTING } from './app.routes';

//Servicios

//Componentes
import { MENU_DECLARATIONS } from './components/menu';
import { PLATOS_DECLARATIONS } from './components/platos';
import { CARRO_DECLARATIONS} from './components/carro';
import { SHARED_DECLARATIONS } from './shared'


@NgModule({
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    APP_ROUTING
  ],
  declarations: [
    AppComponent,
    ...MENU_DECLARATIONS,
    ...PLATOS_DECLARATIONS,
    ...CARRO_DECLARATIONS,
    ...SHARED_DECLARATIONS
  ],
  providers:[
    {provide: LOCALE_ID , useValue:"es"}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
