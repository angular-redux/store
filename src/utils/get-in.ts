/*
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices.
 */
export function getIn(v, pathElems: (string | number)[]): any {
    if (!v) {
      return v;
    }

    // If this is an ImmutableJS structure, use existing getIn function
    if (typeof v.getIn === 'function') {
      return v.getIn(pathElems);
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

