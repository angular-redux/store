import 'reflect-metadata';
import { expect, use } from 'chai';

import { omit } from './omit';

describe('omit', () => {
  it('should omit the specified properties', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const output = omit(input, [ 'b', 'd' ]);

    expect(output.hasOwnProperty('b')).to.be.false;
    expect(output.hasOwnProperty('d')).to.be.false;
    expect(output).to.eql({ a: 1, c: 3 });
  });

  it('should not mutate its input', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const output = omit(input, [ 'b', 'd' ]);

    expect(input).to.eql({ a: 1, b: 2, c: 3, d: 4 });
  });
});
