import { provide, Provider } from 'angular2/core';
import { Store }  from 'redux';
import { NgRedux } from './ng-redux';

export function provider<T>(store: Store<T>) {
  
  return [provide(NgRedux, { useFactory: () => new NgRedux<T>(store) }),
  provide('ngRedux', {useExisting: NgRedux})];
   
}
