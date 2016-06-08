/**
 * Creates a copy of object, but with properties matching 'props'
 * omitted.
 * 
 * @param {Object} object: the object to be copied and filtered.
 * @param {string[]} props: a list of property names to be excluded
 *  from the filtered copy.
 */
export function omit(object: Object, props: string[]): Object {
  const clone = Object.assign({}, object);
  props.forEach(prop => delete clone[prop]);
  return clone;
};
