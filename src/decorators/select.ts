import { NgRedux } from '../components/ng-redux';

/**
 * Selects an observable from the store, and attaches it to the decorated 
 * property.
 *
 * @param {string | function} stateKeyOrFunc
 * @param {function} comparer function for this selector
 * An Rxjs selector function or a string indicating the name of the store
 * property to be selected.
 * */
export const select = <T>(
    stateKeyOrFunc?,
    comparer?: (x: any, y: any) => boolean) => (target, key) => {

    let bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) : key;

    if (typeof stateKeyOrFunc === 'string') {
        bindingKey = stateKeyOrFunc;
    }

    function getter() {
      const isFunction = typeof stateKeyOrFunc === 'function';
        return NgRedux.instance
            .select(isFunction ? stateKeyOrFunc : bindingKey, comparer);
    }

    // Delete property.
    if (delete this[key]) {
        // Create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true
        });
    }
};
