# ng2redux


-- define provider service in bootstrap

import { Injector } from 'angular2/di';

var injector = Injector.resolveAndCreate([
  Car,
  Engine,
  Tires,
  Doors
]);

var car = injector.get(Car);