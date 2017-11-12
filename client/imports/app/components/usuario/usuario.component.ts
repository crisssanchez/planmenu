import { encode } from '@angular/router/src/url_tree';
import { Plato } from '../../../../../both/models/plato.model';
import { Familias } from '../../../../../both/collections/familias.collection';
import { Familia } from '../../../../../both/models/familia.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import template from './usuario.component.html';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { Alimentos } from '../../../../../both/collections/alimentos.collection';
import { Alimento } from '../../../../../both/models/alimento.model';
import { Platos } from '../../../../../both/collections/platos.collection';


@Component({
  selector: 'usuario',
  template
})
@InjectUser('user')
export class UsuarioComponent {

  user: Meteor.User;
  usuario: Familia;
  usuarioSub: Subscription;
  alimentosSub: Subscription;

  idPlato: string;


  ngOnInit() {

    if (this.usuarioSub) {
      this.usuarioSub.unsubscribe();
    }
    this.usuarioSub = MeteorObservable.subscribe('familia').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.usuario = Familias.findOne({ _id: this.user._id });
      });
    });

    // if (this.alimentosSub) {
    //   this.alimentosSub.unsubscribe();
    // }


    // this.alimentosSub = MeteorObservable.subscribe('alimentos').subscribe();
    // this.alimentos = Alimentos.find({}).zone();

  }

  cambiarGustos(alimentoId: string, valor: number) {
    let encontrado: boolean = false;
    for (let i = 0; i < this.usuario.gustos_alimentos.length; i++) {
      if (this.usuario.gustos_alimentos[i].id_alimento == alimentoId) {
        this.usuario.gustos_alimentos[i].valor = valor;
        encontrado = true;
      }
    }
    if (!encontrado) {
      this.usuario.gustos_alimentos.push({
        id_alimento: alimentoId,
        valor: valor
      });
    }

  }

  gustoAlimento(alimentoId: string, valor: number) {
    if (this.usuario.gustos_alimentos === undefined) {
      this.usuario.gustos_alimentos = [];
    }
    for (let i = 0; i < this.usuario.gustos_alimentos.length; i++) {
      if (this.usuario.gustos_alimentos[i].id_alimento == alimentoId) {
        return this.usuario.gustos_alimentos[i].valor === valor;
      }
    }
  }

  guardarUsuario() {
    let valid = true;
    for (let alimento of this.usuario.alimentos) {
      if (alimento.minSem != undefined && alimento.maxSem !== undefined && alimento.minSem > alimento.maxSem) {
        valid = false;
      }
    }

    if (valid)
      Meteor.call('updateFamilia', this.usuario);
  }

  ngOnDestroy() {
    this.usuarioSub.unsubscribe();
  }

}
