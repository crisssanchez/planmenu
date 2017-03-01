import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { MENU_DECLARATIONS } from './menu';
import { CARRO_DECLARATIONS} from './carro';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    ...MENU_DECLARATIONS,
    ...CARRO_DECLARATIONS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
