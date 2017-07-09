import { Reducer, Action } from 'redux';
import { PathSelector } from './selectors';
import { setIn } from '../utils/set-in';
import { getIn } from '../utils/get-in';

let reducerMap: { [id: string]: Reducer<any> } = {};

const composeReducers = (...reducers: Reducer<any>[]): Reducer<any> =>
  (state: any, action: Action) =>
    reducers.reduce((subState, reducer) => reducer(subState, action), state);

/**
 * @param rootReducer Call this on your root reducer to enable SubStore functionality for
 * pre-configured stores (e.g. when using NgRedux.provideStore()).  NgRedux.configureStore
 * does it for you under the hood.
 */
export function enableFractalReducers(rootReducer: Reducer<any>) {
  reducerMap = {};
  return composeReducers(rootFractalReducer, rootReducer);
}

/** @hidden */
export function registerFractalReducer(
  basePath: PathSelector,
  localReducer: Reducer<any>): void {
    const existingFractalReducer = reducerMap[JSON.stringify(basePath)];
    if (existingFractalReducer && existingFractalReducer !== localReducer) {
      throw new Error(`attempt to overwrite fractal reducer for basePath ${basePath}`);
    }

    reducerMap[JSON.stringify(basePath)] = localReducer;
  }

/** @hidden */
export function replaceLocalReducer(
  basePath: PathSelector,
  nextLocalReducer: Reducer<any>): void {
    reducerMap[JSON.stringify(basePath)] = nextLocalReducer;
  }

function rootFractalReducer(
  state: {} = {},
  action: Action & { '@angular-redux::fractalkey'?: string }) {
    const fractalKey = action['@angular-redux::fractalkey'];
    const fractalPath = fractalKey ? JSON.parse(fractalKey) : [];
    const localReducer = reducerMap[fractalKey || ''];
    return fractalKey && localReducer ?
      setIn(
        state,
        fractalPath,
        localReducer(
          getIn(state, fractalPath),
          action)) :
      state;
  }
