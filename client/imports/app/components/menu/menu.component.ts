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

  generarMenu(){
    MeteorObservable.call('generarMenuSemana').subscribe(
      (result: Menu) => {
        this.menu = result;
        console.log(result);
      },
      (err) => {
        console.log(err);
      }
    );
  }


  ngOnDestroy(){
    this.paramsSub.unsubscribe();
    this.menuSub.unsubscribe();
  }

  bgColor(nutriente: string): string {
    if (nutriente == 'VERDURA') {
      return "green";
    }
    if (nutriente == 'LEGUMBRE'){
      return "blue";
    }
    if(nutriente == 'PASTA'){
      return "darksalmon";
    }
    if(nutriente == 'CARNE ROJA'){
      return "red";
    }
    if(nutriente == 'CARNE BLANCA'){
      return "brown";
    }
    if(nutriente == 'PESCADO BLANCO'){
      return "pink";
    }
    if(nutriente == 'PESCADO AZUL'){
      return "darkblue";
    }
    if(nutriente == 'HUEVO'){
      return "orange";
    }
    if(nutriente == 'ARROZ'){
      return "gray";
    }
    if(nutriente == 'PATATA'){
      return "purple";
    }
    if(nutriente == 'FRITO'){
      return "gold";
    }
    if(nutriente == 'MARISCO'){
      return "hotpink";
    }
    return "black";
  }
}
