import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let'
import { NgRedux } from '../components/ng-redux';
import { Selector, Comparator, Transformer } from '../components/selectors';
import { selectionMap } from '../utils/selection-map';

/**
 * Selects an observable from the store, and attaches it to the decorated
 * property.
 *
 * @param selector
 * A selector function, property name string, or property name path
 * (array of strings/array indices) that locates the store data to be
 * selected
 *
 * @param comparator Function used to determine if this selector has changed.
 */
export function select<T>(
  selector?: Selector<any, T>,
  comparator?: Comparator) {

  return function decorate(target: any, key: string): void {
    let bindingKey = selector;
    if (!selector) {
      bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) :
        key;
    }

    function getter() {
      let selection = selectionMap.get(bindingKey, null, comparator);
      if (NgRedux.instance && !selection) {
        selection = NgRedux.instance.select(bindingKey, comparator);
        selectionMap.set(bindingKey, null, comparator, selection);
      }
      return selection;
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

/**
 * Selects an observable using the given path selector, and runs it through the given
 * transformer function. A transformer function takes the store observable as an input and
 * returns a derived observable from it. That derived observable is run through
 * distinctUntilChanges with the given optional comparator and attached to the store property.
 *
 * Think of a Transformer as a FunctionSelector that operates on observables instead of
 * values.
 */
export function select$<T>(
  selector: Selector<any, T>,
  transformer: Transformer<any, T>,
  comparator?: Comparator) {

  return function decorate(target: any, key: string): void {
    function getter() {
      let selection = selectionMap.get(selector, transformer, comparator);
      if (NgRedux.instance && !selection) {
        selection = NgRedux.instance.select(selector)
          .let(transformer)
          .distinctUntilChanged(comparator);
        selectionMap.set(selector, transformer, comparator, selection);
      }
      return selection;
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
