import { NgZone } from '@angular/core';
import { Action } from 'redux';

import { Observable } from 'rxjs';
import { map, take, toArray } from 'rxjs/operators';

import { NgRedux } from '../components/ng-redux';
import { RootStore } from '../components/root-store';
import { select, select$ } from './select';

interface IAppState {
  foo: string;
  baz: number;
}

type PayloadAction = Action & { payload?: any };

class MockNgZone {
  run = (fn: Function) => fn();
}

describe('Select decorators', () => {
  let ngRedux: NgRedux<IAppState>;

  const mockNgZone = (new MockNgZone() as any) as NgZone;
  const defaultState = { foo: 'bar', baz: -1 };

  const rootReducer = (state = defaultState, action: PayloadAction) =>
    action.payload ? Object.assign({}, state, { baz: action.payload }) : state;

  beforeEach(() => {
    ngRedux = new RootStore<IAppState>(mockNgZone);
    NgRedux.instance = ngRedux;
    ngRedux.configureStore(rootReducer, defaultState);
  });

  describe('@select', () => {
    describe('when passed no arguments', () => {
      // tslint:disable-next-line:max-line-length
      it('binds to a store property that matches the name of the class property', done => {
        class MockClass {
          @select() baz: Observable<number>;
        }
        const mockInstance = new MockClass();

        mockInstance.baz
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-1, 1]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 1 });
      });

      // tslint:disable-next-line:max-line-length
      it('binds by name ignoring any $ characters in the class property name', done => {
        class MockClass {
          @select() baz$: Observable<number>;
        }
        const mockInstance = new MockClass();

        mockInstance.baz$
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-1, 4]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 4 });
      });
    });

    describe('when passed a string', () => {
      // tslint:disable-next-line:max-line-length
      it('binds to the store property whose name matches the string value', done => {
        class MockClass {
          @select('baz') obs$: Observable<number>;
        }
        const mockInstance = new MockClass();

        mockInstance.obs$
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-1, 3]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 3 });
      });
    });

    describe('when passed a function', () => {
      it('attempts to use that function as the selector function', done => {
        const selector = (state: IAppState) => state.baz * 2;
        class MockClass {
          @select(selector) obs$: Observable<number>;
        }
        const mockInstance = new MockClass();

        mockInstance.obs$
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-2, 10]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 5 });
      });
    });

    describe('when passed a comparator', () => {
      const comparator = (_: any, y: any): boolean => y === 1;
      class MockClass {
        @select('baz', comparator)
        baz$: Observable<number>;
      }

      it('should only trigger next when comparator returns true', done => {
        const mockInstance = new MockClass();
        mockInstance.baz$
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-1, 2]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 1 });
        ngRedux.dispatch({ type: 'nvm', payload: 2 });
      });

      it('should receive previous and next value for comparison', done => {
        const spy = jasmine.createSpy('spy');
        class LocalMockClass {
          @select('baz', spy)
          baz$: Observable<number>;
        }

        const mockInstance = new LocalMockClass();
        mockInstance.baz$.pipe(take(3)).subscribe(undefined, undefined, done);

        ngRedux.dispatch({ type: 'nvm', payload: 1 });
        ngRedux.dispatch({ type: 'nvm', payload: 2 });

        expect(spy).toHaveBeenCalledWith(-1, 1);
        expect(spy).toHaveBeenCalledWith(1, 2);
      });
    });
  });

  describe('@select$', () => {
    const transformer = (baz$: Observable<number>) =>
      baz$.pipe(map(baz => 2 * baz));

    it('applies a transformer to the observable', done => {
      class MockClass {
        @select$('baz', transformer)
        baz$: Observable<number>;
      }
      const mockInstance = new MockClass();

      mockInstance.baz$
        .pipe(take(2), toArray())
        .subscribe(values => expect(values).toEqual([-2, 10]), undefined, done);
      ngRedux.dispatch({ type: 'nvm', payload: 5 });
    });

    describe('when passed a comparator', () => {
      const comparator = (_: any, y: any): boolean => y === 1;
      class MockClass {
        @select$('baz', transformer, comparator)
        baz$: Observable<number>;
      }

      it('should only trigger next when the comparator returns true', done => {
        const mockInstance = new MockClass();
        mockInstance.baz$
          .pipe(take(2), toArray())
          .subscribe(
            values => expect(values).toEqual([-2, 2]),
            undefined,
            done
          );
        ngRedux.dispatch({ type: 'nvm', payload: 1 });
        ngRedux.dispatch({ type: 'nvm', payload: 2 });
      });

      it('should receive previous and next value for comparison', done => {
        const spy = jasmine.createSpy('spy');
        class SpyClass {
          @select$('baz', transformer, spy)
          baz$: Observable<number>;
        }

        const mockInstance = new SpyClass();
        mockInstance.baz$.pipe(take(3)).subscribe(undefined, undefined, done);

        ngRedux.dispatch({ type: 'nvm', payload: 1 });
        ngRedux.dispatch({ type: 'nvm', payload: 2 });

        expect(spy).toHaveBeenCalledWith(-2, 2);
        expect(spy).toHaveBeenCalledWith(2, 4);
      });
    });
  });
});
