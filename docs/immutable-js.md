# Using ImmutableJS

## What is ImmutableJS

[ImmutableJS](https://facebook.github.io/immutable-js/) is a library that
provides efficient immutable data structures for JavaScript, and it's a great
tool to help enforce immutability in your reducers.

It provides two main structures, `Map` and `List`, which are analogues of
`Object` and `Array`. However they provide an efficiently-implemented
copy-on-write semantic that can help you enforce immutability in your reducers
without the performance problems of `Object.freeze` or the GC churn of
`Object.assign`.

It also provides helper methods for deeply querying (`getIn`) or modifying
(`setIn`) nested objects.

## Why do I care?

Many people who do Redux implement their stores in terms of ImmutableJS data
structures. This provides a safety-net against accidental mutation of the store,
either in reducers or in reactive operator sequences attached to your
observables. However it comes at a syntactic cost: with `Immutable.Map`, you
can no longer easily dereference properties:

```typescript
const mutableFoo = {
  foo: 1
};

const foo: number = mutableFoo.foo
```

becomes:

```typescript
const immutableFoo: Map<string, any> = Immutable.fromJS({
  foo: 1;
});

const foo: number = immutableFoo.get('foo');
```

## Pre 3.3.0:

Previous to 3.3.0 we were forced to choose between the guarantees of ImmutableJS
and the syntactic convenience of raw objects:

### Raw Objects in the Store

Imagine a store with the following shape:

```typescript
{
  totalCount: 0,
  counts: {
    firstCount: 0,
    secondCount: 0
  }
};
```

Without ImmutableJS, we could write in our components:

```typescript
// Path selector
@select(['counts', 'firstCount']) firstCount$: Observable<number>;

// Selecting an immutable object
@select() counts$: Observable<ICounts>;

constructor() {
  this.counts$.map(counts: ICount => {
    // oh noes: bad mutation, subtle bug!
    return counts.firstCount++;
  });
}
```

We get the syntactic convenience of raw objects, but no protection against
accidental mutation.

### Immutable Objects in the Store

Here's that same conceptual store, defined immutably:

```typescript
Immutable.Map<string, any>({
  totalCount: 0,
  counts: Immutable.map<string, number>({
    firstCount: 0,
    secondCount: 0
  })
});
```

Now we are protected against accidental mutation:

```typescript
constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Type error: firstCount is not a property of Immutable.Map.
    return counts.firstCount++;
  });
}
```

But we are restricted to using the function selectors. which are less
declarative:

```typescript
// Path selector no longer possible: must supply a function.
@select(s => s.getIn(['counts', 'firstCount']) firstCount$: Observable<number>;
@select(s => s.get('counts')) counts$: Observable<Map<string, number>>;

constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Correct: we are forced into the non-mutating approach.
    return counts.get('firstCount') + 1;
  });
}
```

## Post 3.3.0:

In `@angular-redux/store` 3.3.0 we've allowed you to have your cake and eat it too: the
`@select` decorator can now detect if the selected state is an ImmutableJS
construct and call `.get` or `.getIn` for you.

So you no longer have to sacrifice declarative syntax for mutation-safety:

```typescript
// Path selector
@select(['counts', 'firstCount']) firstCount$: Observable<number>;

// Selecting an immutable object
@select() counts$: Observable<Map<string, number>>;

constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Correct: we are forced into the non-mutating approach.
    return counts.get('firstCount') + 1;
  });
}
```

Note that ImmutableJS is still optional. We don't depend on it directly
and you're not required to use it. But if you do, we've got you covered!
