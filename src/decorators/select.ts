import { NgRedux } from '../components/ng-redux';

/**
 * Selects an observable from the store, and attaches it to the decorated 
 * property.
 *
 * @param {string | function} stateKeyOrFunc 
 * An Rxjs selector function or a string indicating the name of the store
 * property to be selected.
 * */
export const select = <T>(stateKeyOrFunc?) => (target, key) => {
    let bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) : key;

    if (typeof stateKeyOrFunc === 'string') {
        bindingKey = stateKeyOrFunc;
    }

    function getter() {
        return NgRedux.instance
            .select(typeof stateKeyOrFunc === 'function' ?
                    stateKeyOrFunc : bindingKey);
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
