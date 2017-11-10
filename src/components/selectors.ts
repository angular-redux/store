import { getIn } from '../utils/get-in';
import { Observable } from 'rxjs/Observable';

export type Comparator = (x: any, y: any) => boolean;
export type Transformer<RootState, V> = (
  store$: Observable<RootState>
) => Observable<V>;
export type PropertySelector = string | number | symbol;
export type PathSelector = (string | number)[];
export type FunctionSelector<RootState, S> = ((s: RootState) => S);
export type Selector<RootState, S> =
  | PropertySelector
  | PathSelector
  | FunctionSelector<RootState, S>;

/** @hidden */
export const sniffSelectorType = <RootState, S>(
  selector?: Selector<RootState, S>
) =>
  !selector
    ? 'nil'
    : Array.isArray(selector)
      ? 'path'
      : typeof selector === 'function' ? 'function' : 'property';

/** @hidden */
export const resolver = <RootState, S>(selector?: Selector<RootState, S>) => ({
  property: function propertyResolve(state: any) {
    return state ? state[selector as PropertySelector] : undefined;
  },
  path: function path(state: RootState) {
    return getIn(state, selector as PathSelector);
  },
  function: selector as FunctionSelector<RootState, S>,
  nil: function nil(state: RootState) {
    return state;
  }
});

/** @hidden */
export const resolveToFunctionSelector = <RootState, S>(
  selector?: Selector<RootState, S>
) => resolver(selector)[sniffSelectorType(selector)];
