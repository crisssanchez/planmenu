import { InjectUser, LoginButtons } from 'angular2-meteor-accounts-ui';
import { Component, Inject } from '@angular/core';

import template from './app.component.html';
import { Meteor } from 'meteor/meteor';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app',
  template
})
@Inject('user')
export class AppComponent{
  user:Meteor.User;
}
