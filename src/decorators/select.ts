import {
  PropertySelector,
  PathSelector,
  FunctionSelector,
  Comparator,
  NgRedux,
} from '../components/ng-redux';

export type PropertyDecorator = (target: any, propertyKey: string) => void;

/**
 * Selects an observable from the store, and attaches it to the decorated 
 * property.
 *
 * @param { PropertySelector | PathSelector | FunctionSelector } selector
 * An Rxjs selector function, property name string, or property name path
 * (array of strings/array indices) that locates the store data to be 
 * selected
 *
 * @param { Comparator } comparer function for this selector
 */
export function select<T>(
  selector?: PropertySelector | PathSelector | FunctionSelector<any, T>,
  comparator?: Comparator): PropertyDecorator {

  return function decorate(target: any, key: string): void {
    let bindingKey = selector;
    if (!selector) {
      bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) :
        key;
    }

    function getter() {
      return NgRedux.instance.select(bindingKey, comparator);
    }

    // Replace decorated property with a getter that returns the observable.
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        enumerable: true,
        configurable: true
      });
    }
  };
}
