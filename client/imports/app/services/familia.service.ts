import { Familias } from '../../../../both/collections/familias.collection';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { Familia } from '../../../../both/models/familia.model';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';

@Injectable()
export class FamiliaService {

  familia: Familia;

  familiaObs = new ReplaySubject<Familia>(1);
  private familiaSub: Subscription;
  private autorun: Subscription;

  constructor() {
    this.subscribeFamilia();
  }

  subscribeFamilia() {
    this.familiaSub = MeteorObservable.subscribe('familia').subscribe(() => {
      this.autorun = MeteorObservable.autorun().subscribe(() => {
        this.familia = Familias.collection.findOne(Meteor.userId());
        this.familiaObs.next(this.familia);
      });
    });
  }

  unsubscribe() {
    if (this.autorun)
      this.autorun.unsubscribe();

    if (this.familiaSub) {
      this.familiaSub.unsubscribe();
    }
  }


}