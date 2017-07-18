import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { Ingrediente } from '../models/ingrediente.model';

export const Ingredientes = new MongoObservable.Collection<Ingrediente>('ingredientes');
