import { NgRedux } from '../components/ng-redux';

/**
 * Decorates the class property into a function that dispatches the action 
 * creator it receives.
 *
 * @param {function} func
 * A Redux Action Creator.
 */
export const dispatch = (func) => (targetClass, key) => {
    targetClass[key] = () => NgRedux.instance.dispatch(<any>func());
};
