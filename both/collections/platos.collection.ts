import { MongoObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';

import { Plato } from '../models/plato.model'

export const Platos = new MongoObservable.Collection<Plato>('platos');
