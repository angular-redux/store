import shallowEqual from './shallow-equal';

describe('Utils', () => {
  describe('shallowEqual', () => {
    it('should return true if arguments fields are equal', () => {
      expect(
        shallowEqual(
          { a: 1, b: 2, c: undefined },
          { a: 1, b: 2, c: undefined })).toEqual(true);

      expect(
        shallowEqual(
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 2, c: 3 })).toEqual(true);

      const o = {};
      expect(
        shallowEqual(
          { a: 1, b: 2, c: o },
          { a: 1, b: 2, c: o })).toEqual(true);
    });

    it('should return false if first argument has too many keys', () => {
      expect(
        shallowEqual(
          { a: 1, b: 2, c: 3 },
          { a: 1, b: 2 })).toEqual(false);
    });

    it('should return false if second argument has too many keys', () => {
      expect(
        shallowEqual(
          { a: 1, b: 2 },
          { a: 1, b: 2, c: 3 })).toEqual(false);
    });

    it('should return false if arguments have different keys', () => {
      expect(
        shallowEqual(
          { a: 1, b: 2, c: undefined },
          { a: 1, bb: 2, c: undefined })).toEqual(false);
    });

    it('should return true for two references to the same thing', () => {
      const thing = { a: 1, b: 2, c: undefined };
      expect(shallowEqual(thing, thing)).toEqual(true);
    });
  });
});
