import {
  AnyAction,
  Reducer,
  Dispatch,
  Unsubscribe,
  Middleware,
  Store,
  StoreEnhancer,
} from 'redux';
import { Observable } from 'rxjs';
import { ObservableStore } from './observable-store';
import { Selector, PathSelector, Comparator } from './selectors';

/**
 * This is the public interface of @angular-redux/store. It wraps the global
 * redux store and adds a few other add on methods. It's what you'll inject
 * into your Angular application as a service.
 */
export abstract class NgRedux<RootState> implements ObservableStore<RootState> {
  /** @hidden, @deprecated */
  static instance?: ObservableStore<any> = undefined;

  /**
   * Configures a Redux store and allows NgRedux to observe and dispatch
   * to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component.
   *
   * @param rootReducer Your app's root reducer
   * @param initState Your app's initial state
   * @param middleware Optional Redux middlewares
   * @param enhancers Optional Redux store enhancers
   */
  abstract configureStore: (
    rootReducer: Reducer<RootState, AnyAction>,
    initState: RootState,
    middleware?: Middleware[],
    enhancers?: StoreEnhancer<RootState>[]
  ) => void;

  /**
   * Accepts a Redux store, then sets it in NgRedux and
   * allows NgRedux to observe and dispatch to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component. If configureStore
   * has been used this cannot be used.
   *
   * @param store Your app's store
   */
  abstract provideStore: (store: Store<RootState>) => void;

  // Redux Store methods
  abstract dispatch: Dispatch<AnyAction>;
  abstract getState: () => RootState;
  abstract subscribe: (listener: () => void) => Unsubscribe;
  abstract replaceReducer: (nextReducer: Reducer<RootState, AnyAction>) => void;

  // ObservableStore methods.
  abstract select: <SelectedType>(
    selector?: Selector<RootState, SelectedType>,
    comparator?: Comparator
  ) => Observable<SelectedType>;
  abstract configureSubStore: <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState, AnyAction>
  ) => ObservableStore<SubState>;
}
