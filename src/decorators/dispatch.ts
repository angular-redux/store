import {
  NgRedux,
} from '../components/ng-redux';

export function dispatch(): void | any {
  return function dispatchDecorator(target: object, key: string | symbol | number, descriptor?: PropertyDescriptor) {
    let originalMethod: Function;

    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
    const wrapped = function (...args) {

      const result = originalMethod.apply(this, args);
      NgRedux.instance.dispatch(result);
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
