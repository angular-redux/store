import { isObject, isFunction, isPlainObject} from './type-checks';

describe('typeChecks', () => {
  describe('isObject', () => {
    it('should return true for an object literal', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return true for a new Object', () => {
      expect(isObject(new Object())).toBe(true);
    });

    it('should return true for an instance of a class', () => {
      class Foo {};
      expect(isObject(new Foo())).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false for a function', () => {
      expect(isObject(function foo() {})).toBe(false);
    });

    it('should return false for an arrow function', () => {
      expect(isObject(() => undefined)).toBe(false);
    });

    it('should return false for a constructor function', () => {
      class Foo {};
      expect(isObject(Foo)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isObject('foo')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isObject(1)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for a function', () => {
      expect(isFunction(function () {})).toBe(true);
    });

    it('should return true for an arrow function', () => {
      expect(isFunction(() => undefined)).toBe(true);
    });

    it('should return true for a constructor function', () => {
      class Foo {};
      expect(isFunction(Foo)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isFunction(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isFunction(undefined)).toBe(false);
    });

    it('should return false for an object literal', () => {
      expect(isFunction({})).toBe(false);
    });

    it('should return false for an instance of a class', () => {
      class Foo {};
      expect(isFunction(new Foo())).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isFunction('foo')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isFunction(1)).toBe(false);
    });

    it('should return false for a list', () => {
      expect(isFunction([])).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should return true for an object literal', () => {
      expect(isPlainObject({})).toBe(true);
    });

    it('should return true for a new Object', () => {
      expect(isPlainObject(new Object())).toBe(true);
    });

    it('should return false for an instance of a class', () => {
      class Foo {};
      expect(isPlainObject(new Foo())).toBe(false);
    });

    it('should return false for null', () => {
      expect(isPlainObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isPlainObject(undefined)).toBe(false);
    });

    it('should return false for a function', () => {
      expect(isPlainObject(function foo() {})).toBe(false);
    });

    it('should return false for an arrow function', () => {
      expect(isPlainObject(() => undefined)).toBe(false);
    });

    it('should return false for a constructor function', () => {
      class Foo {};
      expect(isPlainObject(Foo)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isPlainObject('foo')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isObject(1)).toBe(false);
    });
  });
});
