import 'reflect-metadata';

import { invariant } from './invariant';

describe('invariant', () => {
  it('shouldn\'t throw an error for a true condition', () => {
    invariant(true, 'Condition is true');
  });

  it('should throw an error for a false condition', () => {
    expect(invariant.bind(null, false, 'Condition is false'))
      .toThrowError();
  });

  it('should use the expected message', () => {
    expect(invariant.bind(null, false, 'the expected message'))
      .toThrowError('the expected message');
  });

  it('should use the expected message and context', () => {
    expect(invariant.bind(null, false, 'the expected message', 'context'))
      .toThrowError('the expected message: context');
  });

  it('should allow string substitution with \'%s\'', () => {
    expect(invariant.bind(null, false, '%s: the expected message', 'context'))
      .toThrowError('context: the expected message');
  });
});
