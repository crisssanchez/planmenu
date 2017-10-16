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
import { Nutrientes } from '../../../../../both/collections/nutrientes.collection';
import { Nutriente } from '../../../../../both/models/nutriente.model';
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
  nutrientes: Observable<Nutriente[]>;
  nutrientesSub: Subscription;


  idPlato: string;

  prueba: string;

  ngOnInit() {

    if (this.usuarioSub) {
      this.usuarioSub.unsubscribe();
    }
    this.usuarioSub = MeteorObservable.subscribe('familia').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.usuario = Familias.findOne({ _id: this.user._id });
      });
    });

    if (this.nutrientesSub) {
      this.nutrientesSub.unsubscribe();
    }
    this.nutrientes = Nutrientes.find({}).zone();
    this.nutrientesSub = MeteorObservable.subscribe('nutrientes').subscribe();

  }

  cambiarGustos(nutrienteId: string, valor: number) {
    let encontrado: boolean = false;
    for (let i = 0; i < this.usuario.gustos_nutrientes.length; i++) {
      if (this.usuario.gustos_nutrientes[i].id_nutriente == nutrienteId) {
        this.usuario.gustos_nutrientes[i].valor = valor;
        encontrado = true;
      }
    }
    if (!encontrado) {
      this.usuario.gustos_nutrientes.push({
        id_nutriente: nutrienteId,
        valor: valor
      });
    }

  }

  gustoNutriente(nutrienteId: string, valor: number) {
    if(this.usuario.gustos_nutrientes === undefined){
      this.usuario.gustos_nutrientes = [];
    }
    for (let i = 0; i < this.usuario.gustos_nutrientes.length; i++) {
      if (this.usuario.gustos_nutrientes[i].id_nutriente == nutrienteId) {
        return this.usuario.gustos_nutrientes[i].valor === valor;
      }
    }
  }

  guardarUsuario() {
    Meteor.call('updateFamilia', this.usuario);
  }

  ngOnDestroy() {
    this.nutrientesSub.unsubscribe();
    this.usuarioSub.unsubscribe();
  }

}
