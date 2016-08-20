const proxyquire = require('proxyquire');

const { getIn: getInWithImmutable } = proxyquire('./get-in', {
  immutable: {
    Iterable: {
      isIterable: value => typeof value.getIn === 'function',
    },
    '@noCallThru': true,
  },
});

const { getIn: getInWithNoImmutable } = require('./get-in');

import { expect } from 'chai';

describe('getIn', () => {
  it('should make use of immutable when available in host project', () => {
    const getIn =
      path => {
        expect(path.length).to.equal(1);
        expect(path[0]).to.equal('foo');
        return 't';
      };

    const fakeImmutable = { getIn: getIn };

    expect(getInWithImmutable(fakeImmutable, [ 'foo' ])).to.equal('t');
  });

  it('should work on regular objects even when immutable is available', () => {
    const test = { foo: 1 };

    expect(getInWithImmutable(test, [ 'foo' ])).to.equal(1);
  });

  it('should run without immutable when immutable is not available', () => {
    const test = { foo: 1 };

    expect(getInWithNoImmutable(test, [ 'foo' ])).to.equal(1);
  });
});
