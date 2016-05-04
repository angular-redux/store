import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import * as Redux from 'redux';
import * as invariant from 'invariant';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store, Action, ActionCreator, Reducer } from 'redux';
import {Injectable} from '@angular/core';

const VALID_SELECTORS = ['string', 'number', 'symbol', 'function'];
const ERROR_MESSAGE = `Expected selector to be one of: 
${VALID_SELECTORS.join(',')}. Instead recieved %s`;
const checkSelector = (s) => VALID_SELECTORS.indexOf(typeof s, 0) >= 0;

@Injectable()
export class NgRedux<RootState> {
    private _store: Redux.Store<RootState>;
    private _store$: BehaviorSubject<RootState>;
    private _defaultMapStateToTarget: Function;
    private _defaultMapDispatchToTarget: Function;


    /**
     * Creates an instance of NgRedux.
     * 
     * @param {Redux.Store<RootState>} store Redux store 
     */
    constructor(store: Redux.Store<RootState>) {
        this._store = store;
        this._store$ = this.observableFromStore(store);
        this._store.subscribe(() => this._store$.next(this._store.getState()));
        this._defaultMapStateToTarget = () => ({});
        this._defaultMapDispatchToTarget = dispatch => ({ dispatch });
        const cleanedStore = _.omit(store, ['dispatch', 'getState', 'subscribe', 'replaceReducer'])
        Object.assign(this, cleanedStore);
    }

    /**
     * Create an observable from a Redux store. 
     * 
     * @param {Store<RootState>} store Redux store to create an observable from
     * @returns {BehaviorSubject<RootState>}
     */
    observableFromStore = (store: Store<RootState>) => {
        return new BehaviorSubject(store.getState());
    };


    /**
     * Select a slice of state to expose as an observable. 
     * 
     * @template S
     * @param {(string | number | symbol | ((state: RootState) => S))} selector key or function to select a part of the state
     * @param {(x: any, y: any) => boolean} [comparer]  optional comparison function called to test if an item is distinct from the previous item in the source.
     * @returns {Observable<S>} an Observable that emits items from the source Observable with distinct values.
     */
    select<S>(selector: string | number | symbol | ((state: RootState) => S),
        comparer?: (x: any, y: any) => boolean): Observable<S> {


        invariant(checkSelector(selector), ERROR_MESSAGE, selector);

        if (
            typeof selector === 'string' ||
            typeof selector === 'number' ||
            typeof selector === 'symbol') {
            return this._store$
                .map(state => state[selector])
                .distinctUntilChanged(comparer);
        } else if (typeof selector === 'function') {
            return this._store$
                .map(selector).distinctUntilChanged(comparer);
        }

    }
    wrapActionCreators = (actions) => wrapActionCreators(actions);

    /**
     * Map the specified actions to the target
     * @param {any} actions the actions to bind to the target
     * @returns {(target:any)=>void} a function to pass your target into
     */
    mapDispatchToTarget = (actions) => (target) => {
        return this.updateTarget(target, {}, this.getBoundActions(actions));
    };

    /**
     * Connect your component to your redux state. 
     * 
     * @param {*} mapStateToTarget connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
     * @param {*} mapDispatchToTarget  Optional. If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged onto `target`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).
     * @returns a function that accepts a target object to map the state and/or dispatch onto, or a function that will recieve the result of mapStateToTarget and mapDispatchToTarget as paramaters
     */
    connect = (mapStateToTarget: any, mapDispatchToTarget: any) => {

        const finalMapStateToTarget = mapStateToTarget
            || this._defaultMapStateToTarget;

        invariant(
            _.isFunction(finalMapStateToTarget),
            'mapStateToTarget must be a Function. Instead received %s.',
            finalMapStateToTarget);

        let slice = this.getStateSlice(this._store.getState(),
            finalMapStateToTarget);

        const boundActionCreators = this.getBoundActions(mapDispatchToTarget);

        return (target) => {

            invariant(
                _.isFunction(target) || _.isObject(target),
                'The target parameter passed to connect must be a Function or' +
                'a plain object.'
            );

            // Initial update

            this.updateTarget(target, slice, boundActionCreators);

            const unsubscribe = this._store.subscribe(() => {
                const nextSlice = this.getStateSlice(this._store.getState(),
                    finalMapStateToTarget);

                if (!shallowEqual(slice, nextSlice)) {
                    slice = nextSlice;
                    this.updateTarget(target, slice, boundActionCreators);
                }
            });
            return unsubscribe;
        };

    };



    /**
     * Get the current state of the application
     * @returns {RootState} the application state
     */
    getState = (): RootState => {
        return this._store.getState();
    };


    /**
     * Subscribe to the Redux store changes
     * 
     * @param {() => void} listener callback to invoke when the state is updated
     * @returns a function to unsubscribe
     */
    subscribe = (listener: () => void) => {
        return this._store.subscribe(listener);
    };

    /**
    * Replaces the reducer currently used by the store to calculate the state.
    *
    * You might need this if your app implements code splitting and you want to
    * load some of the reducers dynamically. You might also need this if you
    * implement a hot reloading mechanism for Redux.
    *
    * @param nextReducer The reducer for the store to use instead.
    */
    replaceReducer = (nextReducer: Reducer<RootState>) => {
        return this._store.replaceReducer(nextReducer);
    };


    /**
     * Dispatch an action to Redux 
     */
    dispatch = <A extends Action>(action: A): any => {
        return this._store.dispatch(action);
    };

    private updateTarget(target, StateSlice, dispatch) {
        if (_.isFunction(target)) {
            target(StateSlice, dispatch);
        } else {
            _.assign(target, StateSlice, dispatch);
        }
    }

    private getStateSlice(state, mapStateToScope) {
        const slice = mapStateToScope(state);

        invariant(
            _.isPlainObject(slice),
            '`mapStateToScope` must return an object. Instead received %s.',
            slice
        );

        return slice;
    }

    private getBoundActions = (actions) => {
        const finalMapDispatchToTarget = _.isPlainObject(actions) ?
            wrapActionCreators(actions) :
            actions || this._defaultMapDispatchToTarget;
        invariant(
            _.isPlainObject(finalMapDispatchToTarget)
            || _.isFunction(finalMapDispatchToTarget),
            'mapDispatchToTarget must be a plain Object or a Function. ' +
            'Instead received % s.',
            finalMapDispatchToTarget);

        return finalMapDispatchToTarget(this._store.dispatch);
    };

}
