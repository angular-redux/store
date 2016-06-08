export function isFunction(thing: any): boolean {
  return !!(thing && 
    thing.constructor &&
    thing.call &&
    thing.apply);
}

export function isObject(thing: any): boolean {
  return !!(thing &&
    typeof thing === 'object' &&
    !isFunction(thing));
}

export function isPlainObject(thing: any): boolean {
  return isObject(thing) && thing.constructor === Object;
}
