import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../../../../both/models/menu.model';
import { Menus } from '../../../../../both/collections/menus.collection';

import template from './menus.component.html';

@Component({
  selector:'menus',
  template
})

export class MenusComponent implements OnInit, OnDestroy{

  menus: Observable<Menu[]>;
  menusSub: Subscription;


  ngOnInit(){

    this.menus = Menus.find({}).zone();
    this.menusSub = MeteorObservable.subscribe('menus').subscribe();

  }

  ngOnDestroy(){
    this.menusSub.unsubscribe();
  }

}
