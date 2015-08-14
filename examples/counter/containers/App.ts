import {Component, View} from 'angular2/angular2';
import {CounterApp} from './CounterApp';

@Component({
  selector: 'root',
})
@View({
  directives: [ CounterApp ],
  template: `
  <counter-app></counter-app>
  `
})
export class App {
}
