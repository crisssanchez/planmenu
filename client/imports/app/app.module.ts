import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { MENU_DECLARATIONS } from './menu';
import { PLATOS_DECLARATIONS } from './platos';
import { CARRO_DECLARATIONS} from './carro';


@NgModule({
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    ...MENU_DECLARATIONS,
    ...PLATOS_DECLARATIONS,
    ...CARRO_DECLARATIONS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
