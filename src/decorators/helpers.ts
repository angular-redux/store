import { Reducer } from 'redux';
import { NgRedux } from '../components/ng-redux';
import { ObservableStore } from '../components/observable-store';
import {
  Selector,
  PathSelector,
  Comparator,
  Transformer
} from '../components/selectors';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/**
 * Used with the `@WithSubStore` class decorator to define a SubStore (AKA a
 * fractal store).
 *
 * For more info on substores, see
 * https://github.com/angular-redux/store/blob/master/articles/fractal-store.md
 */
export interface IFractalStoreOptions {
  /**
   * The name of an instance method that will define the
   * base path for the subStore. This method is expected to return an array
   * of property names or undefined/null.
   */
  basePathMethodName: string;

  /**
   * The localReducer for the substore in question.
   */
  localReducer: Reducer<any>;
}

/**
 * OPTIONS_KEY: this is per-class (static) and holds the config from the @SubStore
 * decorator.
 */
const OPTIONS_KEY = '@angular-redux::substore::class::options';

/**
 * INSTANCE_SUBSTORE_KEY, INSTANCE_SELECTIONS_KEY: these are per-instance (non-static) and
 * holds references to the substores/selected observables to be used by an instance of a
 * decorated class. I'm not using reflect-metadata here because I want
 *
 * 1. different instances to have different substores in the case where `basePathMethodName`
 * is dynamic.
 * 2. the instance substore to be garbage collected when the instance is no longer reachable.
 *
 * This is therefore an own-property on the actual instance of the decorated class.
 */
const INSTANCE_SUBSTORE_KEY = '@angular-redux::substore::instance::store';
const INSTANCE_SELECTIONS_KEY =
  '@angular-redux::substore::instance::selections';

/**
 * Used to detect when the base path changes - this allows components to dynamically adjust
 * their selections if necessary.
 */
const INSTANCE_BASE_PATH_KEY = '@angular-redux::substore::instance::basepath';

const getClassOptions = (decoratedInstance: any): IFractalStoreOptions =>
  decoratedInstance.constructor[OPTIONS_KEY];

/** @hidden */
export const setClassOptions = (
  decoratedClassConstructor: any,
  options: IFractalStoreOptions
): void => {
  decoratedClassConstructor[OPTIONS_KEY] = options;
};

// I want the store to be saved on the actual instance so
// 1. different instances can have distinct substores if necessary
// 2. the substore/selections will be marked for garbage collection when the
//    instance is destroyed.
const setInstanceStore = (
  decoratedInstance: any,
  store?: ObservableStore<any>
) => (decoratedInstance[INSTANCE_SUBSTORE_KEY] = store);

const getInstanceStore = (decoratedInstance: any): ObservableStore<any> =>
  decoratedInstance[INSTANCE_SUBSTORE_KEY];

const getInstanceSelectionMap = (decoratedInstance: any) => {
  const map = decoratedInstance[INSTANCE_SELECTIONS_KEY] || {};
  decoratedInstance[INSTANCE_SELECTIONS_KEY] = map;
  return map;
};

const hasBasePathChanged = (
  decoratedInstance: any,
  basePath?: PathSelector
): boolean =>
  decoratedInstance[INSTANCE_BASE_PATH_KEY] !== (basePath || []).toString();

const setInstanceBasePath = (
  decoratedInstance: any,
  basePath?: PathSelector
): void => {
  decoratedInstance[INSTANCE_BASE_PATH_KEY] = (basePath || []).toString();
};

const clearInstanceState = (decoratedInstance: any) => {
  decoratedInstance[INSTANCE_SELECTIONS_KEY] = null;
  decoratedInstance[INSTANCE_SUBSTORE_KEY] = null;
  decoratedInstance[INSTANCE_BASE_PATH_KEY] = null;
};

/**
 * Gets the store associated with a decorated instance (e.g. a
 * component or service)
 * @hidden
 */
export const getBaseStore = (
  decoratedInstance: any
): ObservableStore<any> | undefined => {
  // The root store hasn't been set up yet.
  if (!NgRedux.instance) {
    return undefined;
  }

  const options = getClassOptions(decoratedInstance);

  // This is not decorated with `@WithSubStore`. Return the root store.
  if (!options) {
    return NgRedux.instance;
  }

  // Dynamic base path support:
  const basePath = decoratedInstance[options.basePathMethodName]();
  if (hasBasePathChanged(decoratedInstance, basePath)) {
    clearInstanceState(decoratedInstance);
    setInstanceBasePath(decoratedInstance, basePath);
  }

  if (!basePath) {
    return NgRedux.instance;
  }

  const store = getInstanceStore(decoratedInstance);
  if (!store) {
    setInstanceStore(
      decoratedInstance,
      NgRedux.instance.configureSubStore(basePath, options.localReducer)
    );
  }

  return getInstanceStore(decoratedInstance);
};

/**
 * Creates an Observable from the given selection parameters,
 * rooted at decoratedInstance's store, and caches it on the
 * instance for future use.
 * @hidden
 */
export const getInstanceSelection = <T>(
  decoratedInstance: any,
  key: string | symbol,
  selector: Selector<any, T>,
  transformer?: Transformer<any, T>,
  comparator?: Comparator
) => {
  const store = getBaseStore(decoratedInstance);

  if (store) {
    const selections = getInstanceSelectionMap(decoratedInstance);

    selections[key] =
      selections[key] ||
      (!transformer
        ? store.select(selector, comparator)
        : store
            .select(selector)
            .pipe(transformer, distinctUntilChanged(comparator)));

    return selections[key];
  }

  return undefined;
};
