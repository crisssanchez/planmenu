import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Menu } from '../../../../../both/models/menu.model';
import { Menus } from '../../../../../both/collections/menus.collection';

import template from './menu.component.html';

@Component({
  selector:'menu',
  template
})

export class MenuComponent implements OnInit, OnDestroy{

  idMenu: string;

  paramsSub: Subscription;
  menu: Menu;
  menuSub: Subscription;

  constructor(
     private route: ActivatedRoute,
     private router: Router
    ) {}

  ngOnInit(){
    // Recogemos los parametros de la URL
      this.paramsSub = this.route.params.subscribe(params => {
        if(params['_id']!=null){
            this.idMenu = params['_id'];

            if (this.menuSub) {
              this.menuSub.unsubscribe();
            }

            this.menuSub = MeteorObservable.subscribe('menu', this.idMenu).subscribe(() => {
              MeteorObservable.autorun().subscribe(() => {
                this.menu = Menus.findOne(this.idMenu);
              });
            });
        }
      });

  }

  ngOnDestroy(){
    this.paramsSub.unsubscribe();
    this.menuSub.unsubscribe();
  }
}
