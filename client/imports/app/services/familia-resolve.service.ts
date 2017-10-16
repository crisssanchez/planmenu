import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Resolve } from '@angular/router';
import { Familia } from '../../../../both/models/familia.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { FamiliaService } from './familia.service';

@Injectable()
export class FamiliaResolve implements Resolve<Familia> {

  constructor(private familiaService: FamiliaService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Familia> {
    return this.familiaService.familiaObs.filter(x => x!==undefined).take(1);
  }
}