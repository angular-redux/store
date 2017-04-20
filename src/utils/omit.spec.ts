import 'reflect-metadata';

import { omit } from './omit';

describe('omit', () => {
  it('should omit the specified properties', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const output = omit(input, [ 'b', 'd' ]);

    expect(output.hasOwnProperty('b')).toBe(false);
    expect(output.hasOwnProperty('d')).toBe(false);
    expect(output).toEqual({ a: 1, c: 3 });
  });

  it('should not mutate its input', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const output = omit(input, [ 'b', 'd' ]);

    expect(input).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});
