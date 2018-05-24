/**
 * Sets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices. Path elements are created if
 * not there already. Does not mutate the given object.
 *
 * @hidden
 */
export const setIn = (
  obj: any,
  [firstElem, ...restElems]: (string | number)[],
  value: any
): Object =>
  'function' === typeof (obj[firstElem] || {}).setIn
    ? {
        ...obj,
        [firstElem]: obj[firstElem].setIn(restElems, value),
      }
    : {
        ...obj,
        [firstElem]:
          restElems.length === 0
            ? value
            : setIn(obj[firstElem] || {}, restElems, value),
      };
