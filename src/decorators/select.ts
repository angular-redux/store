import { NgRedux } from '../components/ng-redux';

/**
 * Selects an observable from the store, and attaches it to the decorated 
 * property.
 *
 * @param {string | string[] | function} statePathOrFunc 
 * An Rxjs selector function, property name string, or property name path
 * (array of strings/array indices) that locates the store data to be 
 * selected
 *
 * @param {function} comparer function for this selector
 */
export const select = <T>(
    statePathOrFunc?: string |
        (string | number)[] |
        Function,
    comparer?: (x: any, y: any) => boolean) => (target, key) => {

    let bindingKey = statePathOrFunc;
    if (!statePathOrFunc) {
        bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
            key.substring(0, key.length - 1) :
            key;
    }
    
    function getter() {
        return NgRedux.instance.select(bindingKey, comparer);
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
