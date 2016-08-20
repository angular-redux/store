import 'reflect-metadata';
import {expect, use} from 'chai';

import { invariant } from './invariant';

describe('invariant', () => {
  it('shouldn\'t throw an error for a true condition', () => {
    invariant(true, 'Condition is true');
  });

  it('should throw an error for a false condition', () => {
    expect(invariant.bind(null, false, 'Condition is false'))
      .to.throw(Error);
  });

  it('should use the expected message', () => {
    expect(invariant.bind(null, false, 'the expected message'))
      .throws(Error, 'the expected message');
  });

  it('should use the expected message and context', () => {
    expect(invariant.bind(null, false, 'the expected message', 'context'))
      .throws(Error, 'the expected message: context');
  });

  it('should allow string substitution with \'%s\'', () => {
    expect(invariant.bind(null, false, '%s: the expected message', 'context'))
      .throws(Error, 'context: the expected message');
  });
});
