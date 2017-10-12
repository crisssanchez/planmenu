import { Component } from '@angular/core';
import template from './header.component.html';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'app-header',
  template
})
@InjectUser('user')
export class HeaderComponent{

  user: Meteor.User;
}
