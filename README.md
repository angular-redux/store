
# Which Version to use?

## Angular 6+

`@angular-redux/store@^9` is what you need. This consumes breaking changes from RxJS and Angular 6, as well as updated typedefs from Redux 4.

## Angular 5

Use `@angular-redux/store@^7` - this version supports Angular 5, and also changes to using lettable operators.

## Angular 4 or lower

Use `@angular-redux/store@^6` - This supports Angular 4 and earlier.

# Support for `@angular-redux/store@6`?

Where possible, I will be maintaining and applying any fixes / enhancements for v7 into v6 where it does not introduce a breaking change.

I made a few mistakes trying to publish fixes / etc to two major versions, which caused some releases to get tagged incorrectly and caused some confusion. Sorry for any confusion this has caused, and will do better on avoiding this in the future, and being more transparent with the releases that are going out.

# @angular-redux/store

Angular bindings for [Redux](https://github.com/reactjs/redux).

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Join the chat at https://gitter.im/angular-redux/ng2-redux](https://badges.gitter.im/angular-redux/ng2-redux.svg)](https://gitter.im/angular-redux/ng2-redux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://img.shields.io/circleci/project/github/angular-redux/store.svg)](https://github.com/angular-redux/store)
[![npm version](https://img.shields.io/npm/v/@angular-redux/store.svg)](https://www.npmjs.com/package/@angular-redux/store)
[![downloads per month](https://img.shields.io/npm/dm/@angular-redux/store.svg)](https://www.npmjs.com/package/@angular-redux/store)

## What is Redux?

Redux is a popular approach to managing state in applications. It emphasises:

* A single, immutable data store.
* One-way data flow.
* An approach to change based on pure functions and a stream of actions.

You can find lots of excellent documentation here: [Redux](http://redux.js.org/).

## What is @angular-redux?

We provide a set of npm packages that help you integrate your redux store
into your Angular 2+ applications. Our approach helps you by bridging the gap
with some of Angular's advanced features, including:

* Change processing with RxJS observables.
* Compile time optimizations with `NgModule` and Ahead-of-Time compilation.
* Integration with the Angular change detector.

## Getting Started

* I already know what Redux and RxJS are. [Give me the TL;DR](https://github.com/angular-redux/store/blob/master/articles/quickstart.md).
* I'm just learning about Redux. [Break it down for me](https://github.com/angular-redux/store/blob/master/articles/intro-tutorial.md)!
* Talk is cheap. [Show me a complete code example](https://github.com/angular-redux/example-app).
* Take me to the [API docs](https://angular-redux.github.io/store).

## Examples

Here are some examples of the `angular-redux` family of packages in action:

* [Zoo Animals Combined Example App](https://github.com/angular-redux/example-app)
* [Simple SystemJS Example (Angular Quickstart)](https://github.com/angular-redux/system-js-example)

## Companion Packages

* [Reduxify your Routing with @angular-redux/router](https://github.com/angular-redux/router)
* [Reduxify your Forms with @angular-redux/form](https://github.com/angular-redux/form)

## Resources

* [Using Redux with Angular - JS Toronto Meetup 2016-07-12](https://www.youtube.com/watch?v=s4xr2avwv3s)
* [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)
* [Awesome Redux: Community Resources](https://github.com/xgrommx/awesome-redux)

## In-Depth Usage

`@angular-redux/store` uses an approach to redux based on RxJS Observables to `select` and transform
data on its way out of the store and into your UI or side-effect handlers. Observables
are an efficient analogue to `reselect` for the RxJS-heavy Angular world.

Read more here: [Select Pattern](https://github.com/angular-redux/store/blob/master/articles/select-pattern.md)

We also have a number of 'cookbooks' for specific Angular topics:

* [Using Angular's Dependency Injector with Action Creators](https://github.com/angular-redux/store/blob/master/articles/action-creator-service.md)
* [Using Angular's Dependency Injector with Middlewares](https://github.com/angular-redux/store/blob/master/articles/di-middleware.md)
* [Managing Side-Effects with redux-observable Epics](https://github.com/angular-redux/store/blob/master/articles/epics.md)
* [Using the Redux DevTools Chrome Extension](https://github.com/angular-redux/store/blob/master/articles/redux-dev-tools.md)
* [@angular-redux/store and ImmutableJS](https://github.com/angular-redux/store/blob/master/articles/immutable-js.md)
* [Strongly Typed Reducers](https://github.com/angular-redux/store/blob/master/articles/strongly-typed-reducers.md)

## Hacking on angular-redux/store

Want to hack on angular-redux/store or any of the related packages? Feel free to do so, but please test your changes before making any PRs.

Here's how to do that:

1. Write unit tests. You can check that they work by running
`npm test`.
2. Run the linter. If your editor doesn't do it automatically, do it
manually with `npm run lint`.
3. Test your changes in a 'real world scenario'. We use the [example-app](https://github.com/angular-redux/example-app) for this, using some npm
fakery to 'publish the package locally':

* clone the example app (`git clone https://github.com/angular-redux/example-app.git`)
* generate a 'local package' (`cd` to your `angular-redux/store` clone and run `npm pack`). This will create a `.tgz` file.
* hook your 'local package' up to your example-app (`cd` to your example-app clone and run `npm install --save /path/to/the/tgz/file/from/above`)
* run `ng serve --aot`

Please make sure your changes pass Angular's AoT compiler, because it's a bit finicky with TS syntax.
