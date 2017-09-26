import { Injectable } from '@angular/core';
import { Marcador } from '../interfaces/marcador.interface';

declare const google: any;

@Injectable()
export class MapasService {


  marcadores: Marcador[] = [];

  constructor() {

    let nuevoMarcador: Marcador = {
      lat: 36.722742,
      lng: -4.543743,
      draggable: false,
      titulo: 'Mercadona Campanillas'
    }

    this.marcadores.push(nuevoMarcador);

  }

  insertarMarcador(marcador: Marcador) {
    this.marcadores.push(marcador);
    this.guardarMarcadores();
  }

  guardarMarcadores() {
    localStorage.setItem('marcadores', JSON.stringify(this.marcadores));
  }

  cargarMarcadores() {

    if (localStorage.getItem('marcadores')) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    } else {
      this.marcadores = [];
    }
  }


}