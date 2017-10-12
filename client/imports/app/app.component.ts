import { Component, Inject } from '@angular/core';

import template from './app.component.html';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'app',
  template
})
@Inject('user')
export class AppComponent{
  user:Meteor.User;
}
