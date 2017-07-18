import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Plato } from '../../../../both/models/plato.model';
import { Platos } from '../../../../both/collections/platos.collection';

import template from './nuevoPlato.component.html';

@Component({
  selector:'nuevoPlato',
  template
})

export class NuevoPlatoComponent implements OnInit, OnDestroy{
  ngOnInit(){

  }
  ngOnDestroy(){

  }
}
