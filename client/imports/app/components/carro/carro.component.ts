
import { Marcador } from '../../interfaces/marcador.interface';
import { Productos } from '../../../../../both/collections/productos.collection';
import { Producto } from '../../../../../both/models/producto.model';
import { Ingredientes } from '../../../../../both/collections/ingredientes.collection';
import { Ingrediente } from '../../../../../both/models/ingrediente.model';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MeteorObservable } from 'meteor-rxjs'
import { Mongo } from 'meteor/mongo';
import { Subscription } from 'rxjs/Subscription';
import { Plato } from '../../../../../both/models/plato.model';
import { Platos } from '../../../../../both/collections/platos.collection';
import { Menus } from '../../../../../both/collections/menus.collection';
import { Menu, Dieta } from '../../../../../both/models/menu.model';

import template from './carro.component.html';
import { MapasService } from '../../services/mapas.service';
// import { MapsAPILoader } from '@agm/core';
// import { GoogleMapsAPIWrapper } from '@agm/core';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';

declare var google: any;
@Component({
  selector: 'carro',
  template
})
@InjectUser('user')
export class CarroComponent {

  lat: number = 36.722742;
  lng: number = -4.543743;
  zoom: number = 12;
  maps: Marcador;

  // @ViewChild('agm')
  // public mapRef: ElementRef;

  map;
  infowindow;

  verPlatos;

  constructor(public _ms: MapasService, 
    // private _mapsAPILoader: MapsAPILoader
  ) {
    //this._ms.cargarMarcadores();
  }

  user: Meteor.User;
  menuId: string;
  productosSub: Subscription;
  productos: Producto[];

  ingredientes: Ingrediente[];
  ingredienteSelected: Ingrediente;
  ingedientesSub: Subscription;

  clickMapa(evento) {

    let nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: "Sin titulo",
      draggable: false
    }

    this._ms.insertarMarcador(nuevoMarcador);
  }

  ngOnInit() {

    // this.setCurrentPosition();

    this.ingedientesSub = MeteorObservable.subscribe('ingredientes').subscribe(() => {
      this.ingredientes = Ingredientes.collection.find({}).fetch();
    });
   

    if (this.productosSub) {
      this.productosSub.unsubscribe();
    }
    this.productosSub = MeteorObservable.subscribe('productosMenu').subscribe(() => {
      this.menuId = Menus.findOne({owner:Meteor.userId()},{sort:{numero:-1}})._id;
      MeteorObservable.autorun().subscribe(() => {
        this.productos = Productos.find({ menu: this.menuId }, { sort: { orden: 1 } }).fetch();
      });
    });
  }

  addProducto(producto:string){
    MeteorObservable.call('addProductoCarro', this.menuId,producto).subscribe();

  }

  platosTxt(producto: Producto) {
    let str = '';
    let i = 0;
    for (let p of producto.platos) {
      if (i > 2)
        str = str + p + ', ';
      i++;
    }
    return str;
  }

  /*ngAfterViewInit() {
    this.initMap();
  }*/

  setActivo(producto: Producto, valor) {

    MeteorObservable.call('setActivoProductoMenu', this.menuId, producto, valor).subscribe();

  }

  removeProductoMenu(producto: Producto) {

    MeteorObservable.call('removeProductoMenu', this.menuId, producto).subscribe();

  }



  ngOnDestroy() {
    if (this.productosSub)
      this.productosSub.unsubscribe();

    if (this.ingedientesSub)
      this.ingedientesSub.unsubscribe();
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }
/*

  initMap() {

   

    this._mapsAPILoader.load().then(() => {

      console.log(this.mapRef.nativeElement);
      


      let pyrmont = new google.maps.LatLng(this.lat, this.lng);
      this.map = new google.maps.Map(document.getElementById('map'), {
        lat: this.lat,
        lng: this.lng,
        center: pyrmont,
        zoom: this.zoom
      });

      console.log(this.map);

      this.infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(this.map);


      service.nearbySearch(
        {
          location: pyrmont,
          radius: 500,
          type: ['store']
        }, (results, status) => {

          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              let place = results[i];
              var placeLoc = place.geometry.location;
              var marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location
              });

              google.maps.event.addListener(marker, 'click', function () {
                this.infowindow.setContent(place.name);
                this.infowindow.open(this.map, this);
              });
            }
          }
        });
    });





  }*/

}
