// This may look suspicious, but the point is to add ImmutableJS integration
// only if the project itself already has a dependency on immutable. If not,
// then this variable is left null and no integration is attempted.
let immutable;
try {
  immutable = require('immutable');
} catch (e) {}

/*
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices.
 */
export function getIn(
  v: Object,
  pathElems: (string | number)[]): any {
    if (!v) {
      return v;
    }

    if (immutable && immutable.Iterable.isIterable(v)) {
      return (<{getIn: (path: (string | number)[]) => any}>v).getIn(pathElems);
    }

    const [ firstElem, ...restElems] = pathElems;

    if (undefined === v[firstElem]) {
      return undefined;
    }

    if (restElems.length === 0) {
        return v[firstElem];
    }

    return getIn(v[firstElem], restElems);
}

