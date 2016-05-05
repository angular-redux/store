import { NgRedux } from './ng-redux';

/**
 * Wraps all the functions on the object it receives in Redux Dispatch calls and
 * attaches these functions to the class that it decorates.
 *
 * @param {object} obj
 * A object containing Redux Action Creator functions. All functions found will
 * be wrapped in a redux dispatch call and and attached to the class. All other 
 * properties that are not functions will be ignored.
 */
export const dispatchAll = (obj) => (targetClass) => {
    Object.keys(obj)
        .filter(key => typeof obj[key] === 'function')
        .forEach(key => targetClass.prototype[key] =
                 () => NgRedux.instance.dispatch(<any>obj[key]()));
};

