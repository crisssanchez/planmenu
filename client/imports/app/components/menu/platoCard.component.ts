import { FamiliaService } from '../../services/familia.service';
import { Component, OnInit, Input } from '@angular/core';

import template from './platoCard.component.html';
import { Plato } from '../../../../../both/models/plato.model';
import { MeteorObservable } from 'meteor-rxjs';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';
import { Menu } from '../../../../../both/models/menu.model';

@Component({
  selector: 'plato-card',
  template
})

export class PlatoCardComponent implements OnInit {
  @Input() plato: Plato;
  @Input() menu: Menu;
  
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

  alternativas: Plato[] = [];

  constructor(private fs: FamiliaService) { }

  ngOnInit() { }

  getPlatosAlternativos() {

      MeteorObservable.call('getPlatosAlternativos', this.plato).subscribe(
        (result: Plato[]) => {
          for (let i = 0; i < result.length; i++) {
            this.alternativas.push({
              _id: result[i]._id,
              nombre: result[i].nombre,
              imagenUrl: result[i].imagenUrl,
              alimentos: result[i].alimentos,
              momentos: result[i].momentos,
              tipos: result[i].tipos,
              ingredientes: result[i].ingredientes
            });
          }
          
        },
        (err) => {
          console.log(err);
        }
      );
  }

  setGustoPlato(valor: number) {
    MeteorObservable.call('setGustoPlato', this.plato, valor).subscribe();
  }

  esGustoPlato(valor: number) {
    let gustosPlatos: any[] = this.fs.familia.gustos_platos;

    if (gustosPlatos != undefined) {

      for (let i = 0; i < gustosPlatos.length; i++) {
        if (gustosPlatos[i].id_plato === this.plato._id) {
          if (gustosPlatos[i].valor === valor) {
            return true;
          } else {
            return false;
          }
        }
      }

    } else {
      return false;
    }
  }

  clearDialog() {
    this.alternativas = [];
    this.show = false;
    this.setMotivo(2);
    let p: Plato = {
      _id: undefined,
      nombre: undefined,
      imagenUrl: undefined,
      alimentos: undefined,
      ingredientes: undefined
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

  guardarCambioPlato(dia:number, momento:string){
    this.setPlatoACambiar(dia,momento, this.plato);
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
}