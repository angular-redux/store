import { sniffSelectorType } from './selectors';

describe('Selectors', () => {
  it('sniffs a string property selector', () =>
    expect(sniffSelectorType('propName')).toBe('property'));

  it('sniffs a number property selector', () =>
    expect(sniffSelectorType(3)).toBe('property'));

  it('sniffs a symbol property selector', () =>
    expect(sniffSelectorType(Symbol('whatever'))).toBe('property'));

  it('sniffs a function selector', () =>
    expect(sniffSelectorType(state => state)).toBe('function'));

  it('sniffs a path selector', () =>
    expect(sniffSelectorType(['one', 'two'])).toBe('path'));

  it('sniffs a nil selector (undefined)', () =>
    expect(sniffSelectorType()).toBe('nil'));
});
