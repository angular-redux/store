import { expect, use } from 'chai';

import { isObject, isFunction, isPlainObject} from './type-checks';

describe('typeChecks', () => {
  describe('isObject', () => {
    it('should return true for an object literal', () => {
      expect(isObject({})).to.be.true;
    });

    it('should return true for a new Object', () => {
      expect(isObject(new Object())).to.be.true;
    });

    it('should return true for an instance of a class', () => {
      class Foo {};
      expect(isObject(new Foo())).to.be.true;
    });

    it('should return false for null', () => {
      expect(isObject(null)).to.be.false;
    });

    it('should return false for undefined', () => {
      expect(isObject(undefined)).to.be.false;
    });

    it('should return false for a function', () => {
      expect(isObject(function foo() {})).to.be.false;
    });

    it('should return false for an arrow function', () => {
      expect(isObject(() => undefined)).to.be.false;
    });

    it('should return false for a constructor function', () => {
      class Foo {};
      expect(isObject(Foo)).to.be.false;
    });

    it('should return false for a string', () => {
      expect(isObject('foo')).to.be.false;
    });

    it('should return false for a number', () => {
      expect(isObject(1)).to.be.false;
    });
  });

  describe('isFunction', () => {
    it('should return true for a function', () => {
      expect(isFunction(function () {})).to.be.true;
    });

    it('should return true for an arrow function', () => {
      expect(isFunction(() => undefined)).to.be.true;
    });

    it('should return true for a constructor function', () => {
      class Foo {};
      expect(isFunction(Foo)).to.be.true;
    });

    it('should return false for null', () => {
      expect(isFunction(null)).to.be.false;
    });

    it('should return false for undefined', () => {
      expect(isFunction(undefined)).to.be.false;
    });

    it('should return false for an object literal', () => {
      expect(isFunction({})).to.be.false;
    });

    it('should return false for an instance of a class', () => {
      class Foo {};
      expect(isFunction(new Foo())).to.be.false;
    });

    it('should return false for a string', () => {
      expect(isFunction('foo')).to.be.false;
    });

    it('should return false for a number', () => {
      expect(isFunction(1)).to.be.false;
    });

    it('should return false for a list', () => {
      expect(isFunction([])).to.be.false;
    });
  });

  describe('isPlainObject', () => {
    it('should return true for an object literal', () => {
      expect(isPlainObject({})).to.be.true;
    });

    it('should return true for a new Object', () => {
      expect(isPlainObject(new Object())).to.be.true;
    });

    it('should return false for an instance of a class', () => {
      class Foo {};
      expect(isPlainObject(new Foo())).to.be.false;
    });

    it('should return false for null', () => {
      expect(isPlainObject(null)).to.be.false;
    });

    it('should return false for undefined', () => {
      expect(isPlainObject(undefined)).to.be.false;
    });

    it('should return false for a function', () => {
      expect(isPlainObject(function foo() {})).to.be.false;
    });

    it('should return false for an arrow function', () => {
      expect(isPlainObject(() => undefined)).to.be.false;
    });

    it('should return false for a constructor function', () => {
      class Foo {};
      expect(isPlainObject(Foo)).to.be.false;
    });

    it('should return false for a string', () => {
      expect(isPlainObject('foo')).to.be.false;
    });

    it('should return false for a number', () => {
      expect(isObject(1)).to.be.false;
    });
  });
});
