import { Observable } from 'rxjs/Observable';
import { Selector, Comparator, Transformer } from '../components/selectors';

const toKey = (val: Object | Array<any> | Function | String) =>
  val ? val.toString() : '';

const computeKey = (
  selector: Selector<any, any>,
  transformer: Transformer<any, any>,
  comparator: Comparator) =>
  `s:${toKey(selector)}:t:${toKey(transformer)}:c:${toKey(comparator)}`;

/**
 * Used to pool Observables created by @select and @select$. This
 * avoids memory leaks and improves efficiency.
 * @hidden
 */
export class SelectionMap {
  private _map: { [id: string]: Observable<any> } = {};

  set(
    selector: Selector<any, any>,
    transformer: Transformer<any, any>,
    comparator: Comparator,
    selection: Observable<any>): void {
    const key = computeKey(selector, transformer, comparator);
    this._map[key] = selection;
  }

  get(
    selector: Selector<any, any>,
    transformer: Transformer<any, any>,
    comparator: Comparator): Observable<any> {
    const key = computeKey(selector, transformer, comparator);
    return this._map[key];
  }

  reset() {
    this._map = {};
  }
}

/** @hidden */
export const selectionMap = new SelectionMap();
