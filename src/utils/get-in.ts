/**
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices.
 *
 * @hidden
 */
export function getIn(
  v: any | undefined,
  pathElems: (string | number)[]
): any | undefined {
  if (!v) {
    return v;
  }

  // If this is an ImmutableJS structure, use existing getIn function
  if ('function' === typeof v.getIn) {
    return v.getIn(pathElems);
  }

  const [firstElem, ...restElems] = pathElems;

  if (undefined === v[firstElem]) {
    return undefined;
  }

  if (restElems.length === 0) {
    return v[firstElem];
  }

  return getIn(v[firstElem], restElems);
}
