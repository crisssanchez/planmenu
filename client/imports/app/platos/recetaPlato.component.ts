import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Plato } from '../../../../both/models/plato.model';
import { Platos } from '../../../../both/collections/platos.collection';

import template from './recetaPlato.component.html';

@Component({
  selector:'recetaPlato',
  template
})

export class RecetaPlatoComponent implements OnInit, OnDestroy{

  idPlato: string;
  nombrePlato: string;

  paramsSub: Subscription;
  plato: Plato;
  platoSub: Subscription;
  ingredientes:Object[];

  constructor(
     private route: ActivatedRoute,
     private router: Router
    ) {}

  ngOnInit(){
    // Recogemos los parametros de la URL
      this.paramsSub = this.route.params.subscribe(params => {
        if(params['_id']!=null){
            this.idPlato = params['_id'];

            if (this.platoSub) {
              this.platoSub.unsubscribe();
            }

            this.platoSub = MeteorObservable.subscribe('plato', this.idPlato).subscribe(() => {
              MeteorObservable.autorun().subscribe(() => {
                this.plato = Platos.findOne(this.idPlato);
                this.ingredientes = this.plato.ingredientes;
              });
            });
        }
      });

  }

  medidaEsUnidad(medida: string):boolean{
    return medida == 'UNIDAD';
  }

/*
changePlato No funciona porque tiene la seguridad Activa
ahora es necesario definir un método en BOTH/METHODS y desde aquí
solo llamar al método. El método es el que hace el update.
*/
  changePlato():void{
    Platos.update(this.plato._id, {
      $set: { nombre: this.plato.nombre },
    });
  }

  ngOnDestroy(){
    this.paramsSub.unsubscribe();
    this.platoSub.unsubscribe();
  }
}
