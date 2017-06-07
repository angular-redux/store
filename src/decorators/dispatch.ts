import { NgRedux } from '../components/ng-redux';

/**
 * Auto-dispatches the return value of the decorated function.
 *
 * Decorate a function creator method with @dispatch and its return
 * value will automatically be passed to ngRedux.dispatch() for you.
 */
export function dispatch(): void | any {
  return function dispatchDecorator(target: object, key: string | symbol | number, descriptor?: PropertyDescriptor) {
    let originalMethod: Function;

    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
    const wrapped = function (this: any, ...args) {
      const result = originalMethod.apply(this, args);
      if (NgRedux.instance) {
        NgRedux.instance.dispatch(result);
      }
      return result;
    }

    if (descriptor === undefined) {
      const dispatchDescriptor: PropertyDescriptor = {
        get: () => wrapped,
        set: (setMethod) => originalMethod = setMethod,
      }
      Object.defineProperty(target, key, dispatchDescriptor)
      return;
    } else {
      originalMethod = descriptor.value;
      descriptor.value = wrapped;
      return descriptor;
    }
  }
}
