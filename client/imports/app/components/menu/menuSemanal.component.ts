import { Familia } from '../../../../../both/models/familia.model';
import { Familias } from '../../../../../both/collections/familias.collection';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../../../../both/models/menu.model';
import { Dieta } from '../../../../../both/models/menu.model';
import { Menus } from '../../../../../both/collections/menus.collection';

import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';
import { Producto } from '../../../../../both/models/producto.model';
import { Productos } from '../../../../../both/collections/productos.collection';
import { SEMANA } from '../../data';

import template from './menuSemanal.component.html';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { FamiliaService } from '../../services/familia.service';

@Component({
  selector: 'menuSemanal',
  template
})
@InjectUser('user')
export class MenuSemanalComponent implements OnInit, OnDestroy {

  user: Meteor.User;
  dias: string[];
  dieta: Dieta[];
  menu: Menu;
  menuSub: Subscription;
  alternativas: Plato[]=[];
  motivo: number;
  platoACambiar: Plato;
  diaCambio: number;
  momentoCambio: string;
  platoSeleccionado: Plato ={
    _id: undefined,
    nombre: undefined,
    imagenUrl:undefined,
    alimentos:undefined,
    ingredientes:undefined
  };
  motivoIngredientes: Ingrediente[] = [];
  show: boolean = false;

  constructor(private fs: FamiliaService) {
  }
  
  
  ngOnInit() {
    this.dias = SEMANA;
    
    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
    this.menuSub = MeteorObservable.subscribe('menuSemanal', Meteor.userId()).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.menu = Menus.findOne({ owner: Meteor.userId() }, { sort: { numero: -1 } });
        this.dieta = this.menu.dieta;
      });
    });


  }

  getPlatosAlmuerzo(dia: number) {
    return this.dieta[dia].almuerzo;
  }

  getPlatosCena(dia: number) {
    return this.dieta[dia].cena;
  }

  setFormatoFecha(fecha: Date) {
    return `${this.dias[fecha.getUTCDay()]} ${fecha.getDate()}`;
  }

  getPlatosMenu(): Plato[] {

    let platos: Plato[] = [];
    let dietaMenu: Dieta[] = this.menu.dieta;
    for (let i = 0; i < dietaMenu.length; i++) {
      for (let j = 0; j < dietaMenu[i].almuerzo.length; j++) {
        platos.push(dietaMenu[i].almuerzo[j]);
      }

      for (let j = 0; j < dietaMenu[i].cena.length; j++) {
        platos.push(dietaMenu[i].cena[j]);
      }
    }
    return platos;

  }

  setGustoPlato(plato:Plato, valor:number){
    MeteorObservable.call('setGustoPlato', plato, valor).subscribe();
  }

  esGustoPlato(plato:Plato, valor: number){
    let gustosPlatos: any[] = this.fs.familia.gustos_platos;
    
        if(gustosPlatos != undefined){
    
          for(let i = 0; i < gustosPlatos.length; i++){
            if(gustosPlatos[i].id_plato === plato._id){
              if(gustosPlatos[i].valor === valor){
                return true;
              }else{
                return false;
              }
            }
          }
    
        }else{
          return false;
        }
  }

  getPlatosAlternativos(p:Plato){
    MeteorObservable.call('getPlatosAlternativos', p).subscribe(
      (result: Plato[]) => {
        for(let i = 0; i< result.length; i++){
          this.alternativas.push({
            _id:result[i]._id,
            nombre: result[i].nombre,
            imagenUrl:result[i].imagenUrl,
            alimentos:result[i].alimentos,
            momentos: result[i].momentos,
            tipos:result[i].tipos,
            ingredientes: result[i].ingredientes
          });
        }

      },
      (err) => {
        console.log(err);
      }
    );
  }

  clearDialog(){
    this.alternativas = [];
    this.show = false;
    this.setMotivo(2);
    let p: Plato = {
      _id: undefined,
      nombre: undefined,
      imagenUrl:undefined,
      alimentos:undefined,
      ingredientes:undefined
    };
    this.setPlatoSeleccionado(p);
    this.motivoIngredientes = [];
  }

  setPlatoACambiar(dia: number, momento: string, plato: Plato){
    this.diaCambio = dia;
    this.momentoCambio = momento;
    this.platoACambiar = {
      _id:plato._id,
      nombre: plato.nombre,
      imagenUrl: plato.imagenUrl,
      alimentos: plato.alimentos,
      ingredientes: plato.ingredientes
    }
  }

  setMotivo(motivo:number){
    this.motivo = motivo;
  }

  esMotivo(motivo:number){
    return (this.motivo=== motivo);
  }

  setPlatoSeleccionado(pAlternativo:Plato){
    this.platoSeleccionado._id = pAlternativo._id;
    this.platoSeleccionado.nombre = pAlternativo.nombre;
    this.platoSeleccionado.imagenUrl = pAlternativo.imagenUrl;
    this.platoSeleccionado.alimentos = pAlternativo.alimentos;
  }

  esPlatoSeleccionado(pAlternativo: Plato){
    if(!this.platoSeleccionado._id){
      return false;
    }
    return (this.platoSeleccionado._id === pAlternativo._id);
  }

  guardarCambioPlato(dia:number, momento:string,p:Plato){
    this.setPlatoACambiar(dia,momento, p);
    MeteorObservable.call('cambiarPlatoMenu', this.menu, this.platoACambiar, this.diaCambio,this.momentoCambio, this.platoSeleccionado, this.motivo, this.motivoIngredientes).subscribe();
    this.clearDialog();
  }

  setMotivoIngredientes(ing:Ingrediente){
    let esta = false;
    for(let i = 0; i< this.motivoIngredientes.length; i++){
      if(this.motivoIngredientes[i]._id === ing._id){
        this.motivoIngredientes.splice(this.motivoIngredientes.indexOf(ing),1);
        esta = true;
      }
    }
    if (!esta){
      this.motivoIngredientes.push(ing);
    }
    
  }

  addProductosMenuCarro() {
    MeteorObservable.call('addProductosMenuCarro', this.menu).subscribe();
  }


  ngOnDestroy() {
    this.menuSub.unsubscribe();
  }

}
