import { setIn } from './set-in';

describe('setIn', () => {
  it('performs a shallow set correctly without mutation', () => {
    const original = { a: 1 };
    expect(setIn(original, ['b'], 2)).toEqual({ a: 1, b: 2 });
    expect(original).toEqual({ a: 1 });
  });

  it('performs a deeply nested set correctly without mutation', () => {
    const original = { a: 1 };
    const expected = {
      a: 1,
      b: {
        c: {
          d: 2,
        },
      },
    };

    expect(setIn(original, ['b', 'c', 'd'], 2)).toEqual(expected);
    expect(original).toEqual({ a: 1 });
  });

  it('performs a deeply nested set with existing keys without mutation', () => {
    const original = {
      a: 1,
      b: {
        wat: 3,
      },
    };
    const expected = {
      a: 1,
      b: {
        wat: 3,
        c: {
          d: 2,
        },
      },
    };

    expect(setIn(original, ['b', 'c', 'd'], 2)).toEqual(expected);
    expect(original).toEqual({ a: 1, b: { wat: 3 } });
  });

  it('should use setIn method of an object (case of ImmutableJS)', () => {
    let setInCalled = false;

    class TestClass {
      setIn() {
        setInCalled = true;
      }
    }

    const original = {
      root: new TestClass(),
    };
    setIn(original, ['root', 'a', 'b', 'c'], 123);
    expect(setInCalled).toEqual(true);
  });
});
