import { IFractalStoreOptions, setClassOptions } from './helpers';

/**
 * Modifies the behaviour of any `@select`, `@select$`, or `@dispatch`
 * decorators to operate on a substore defined by the IFractalStoreOptions.
 *
 * See:
 * https://github.com/angular-redux/store/blob/master/articles/fractal-store.md
 * for more information about SubStores.
 */
export function WithSubStore({
  basePathMethodName,
  localReducer,
}: IFractalStoreOptions): ClassDecorator {
  return function decorate(constructor: Function): void {
    setClassOptions(constructor, {
      basePathMethodName,
      localReducer,
    });
  };
}
