import { Selector, Comparator, Transformer } from '../components/selectors';
import { getInstanceSelection } from './helpers';

/**
 * Selects an observable from the store, and attaches it to the decorated
 * property.
 *
 * ```ts
 *  import { select } from '@angular-redux/store';
 *
 *  class SomeClass {
 *    @select(['foo','bar']) foo$: Observable<string>
 * }
 * ```
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
  comparator?: Comparator
): PropertyDecorator {
  return (target: any, key: string | symbol): void => {
    const adjustedSelector = selector
      ? selector
      : String(key).lastIndexOf('$') === String(key).length - 1
        ? String(key).substring(0, String(key).length - 1)
        : key;
    decorate(adjustedSelector, undefined, comparator)(target, key);
  };
}

/**
 * Selects an observable using the given path selector, and runs it through the
 * given transformer function. A transformer function takes the store
 * observable as an input and returns a derived observable from it. That derived
 *  observable is run through distinctUntilChanges with the given optional
 * comparator and attached to the store property.
 *
 * Think of a Transformer as a FunctionSelector that operates on observables
 * instead of values.
 *
 * ```ts
 * import { select$ } from 'angular-redux/store';
 *
 * export const debounceAndTriple = obs$ => obs$
 *  .debounce(300)
 *  .map(x => 3 * x);
 *
 * class Foo {
 *  @select$(['foo', 'bar'], debounceAndTriple)
 *  readonly debouncedFooBar$: Observable<number>;
 * }
 * ```
 */
export function select$<T>(
  selector: Selector<any, T>,
  transformer: Transformer<any, T>,
  comparator?: Comparator
): PropertyDecorator {
  return decorate(selector, transformer, comparator);
}

function decorate(
  selector: Selector<any, any>,
  transformer?: Transformer<any, any>,
  comparator?: Comparator
): PropertyDecorator {
  return function decorator(target: any, key): void {
    function getter(this: any) {
      return getInstanceSelection(this, key, selector, transformer, comparator);
    }

    // Replace decorated property with a getter that returns the observable.
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        enumerable: true,
        configurable: true,
      });
    }
  };
}
