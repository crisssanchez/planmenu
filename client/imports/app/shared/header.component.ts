import { Component, DoCheck } from '@angular/core';
import template from './header.component.html';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template
})



@InjectUser('user')
export class HeaderComponent implements DoCheck{

  user: Meteor.User;
  isLoggedIn: boolean = false;

  constructor(private router:Router){

  }
  ngDoCheck() {
    if (!this.isLoggedIn && !!this.user) {
      this.isLoggedIn = true;
      if (this.router.url === '/') {
        this.router.navigate( ['/menuSemanal'] );
      }
    } else if (this.isLoggedIn && this.user === null) {
      this.isLoggedIn = false;
      if (this.router.url === '') {
        this.router.navigate( [''] );
      }
    }
  }
}
