import { getIn } from '../utils/get-in';
import { Observable } from 'rxjs';

/**
 * Custom equality checker that can be used with `.select` and `@select`.
 * ```ts
 * const customCompare: Comparator = (x: any, y: any) => {
 *  return x.id === y.id
 * }
 *
 * @select(selector, customCompare)
 * ```
 */
export type Comparator = (x: any, y: any) => boolean;
export type Transformer<RootState, V> = (
  store$: Observable<RootState>,
  scope: any
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
      : 'function' === typeof selector
        ? 'function'
        : 'property';

/** @hidden */
export const resolver = <RootState, S>(selector?: Selector<RootState, S>) => ({
  property: (state: any) =>
    state ? state[selector as PropertySelector] : undefined,
  path: (state: RootState) => getIn(state, selector as PathSelector),
  function: selector as FunctionSelector<RootState, S>,
  nil: (state: RootState) => state,
});

/** @hidden */
export const resolveToFunctionSelector = <RootState, S>(
  selector?: Selector<RootState, S>
) => resolver(selector)[sniffSelectorType(selector)];
