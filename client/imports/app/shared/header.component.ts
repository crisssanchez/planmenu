import { Component, DoCheck, NgZone, ViewChild } from '@angular/core';
import template from './header.component.html';
import { InjectUser, LoginButtons } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { Router } from '@angular/router';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  template
})



@InjectUser('user')
export class HeaderComponent implements DoCheck {

  @ViewChild('centerLoginButtons') centerLoginButtons: LoginButtons;

  user: Meteor.User;
  isLoggedIn: boolean = false;

  autorunSub: Subscription;

  constructor(private router: Router, private zone: NgZone) {

  }

  ngOnInit() {
    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      if (!this.isLoggedIn && !!Meteor.userId()) {
        this.isLoggedIn = true;
        if (this.router.url === '/') {
          this.router.navigate(['/menuSemanal']);
        }
      } else if (this.isLoggedIn && !Meteor.userId()) {
        this.isLoggedIn = false;
        this.zone.run(() => {
          if (this.router.url === '/') {
            this.router.navigate(['/']);
          }
          if (this.centerLoginButtons)
            this.centerLoginButtons.isDropdownOpen=true;
        });
      }
    });
  }

  ngAfterViewInit() {
    // this.zone.run(() => {
    //   if (this.centerLoginButtons)
    //     this.centerLoginButtons.isDropdownOpen=true;
    // });
  }

  ngDoCheck() {

  }

  ngOnDestroy() {
    this.autorunSub.unsubscribe();
  }

}
