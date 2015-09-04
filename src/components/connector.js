import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';
import _ from 'lodash';

export default class Connector {

  constructor(store) {
    this._store = store;
    this._defaultMapStateToTarget = () => ({});
    this._defaultMapDispatchToTarget = dispatch => ({ dispatch });
  }

  connect = (mapStateToTarget, mapDispatchToTarget) => {

    const finalMapStateToTarget = mapStateToTarget || this._defaultMapStateToTarget;

    const finalMapDispatchToTarget = _.isPlainObject(mapDispatchToTarget) ?
      wrapActionCreators(mapDispatchToTarget) :
      mapDispatchToTarget || this._defaultMapDispatchToTarget;

    invariant(
      _.isFunction(finalMapStateToTarget),
      'mapStateToTarget must be a Function. Instead received $s.', finalMapStateToTarget
      );

    invariant(
      _.isPlainObject(finalMapDispatchToTarget) || _.isFunction(finalMapDispatchToTarget),
      'mapDispatchToTarget must be a plain Object or a Function. Instead received $s.', finalMapDispatchToTarget
      );

    let slice = this.getStateSlice(this._store.getState(), finalMapStateToTarget);

    const boundActionCreators = finalMapDispatchToTarget(this._store.dispatch);

    return (target) => {

      invariant(
        _.isFunction(target) || _.isObject(target),
        'The target parameter passed to connect must be a Function or a plain object.'
        );

      //Initial update
      this.updateTarget(target, slice, boundActionCreators);

      const unsubscribe = this._store.subscribe(() => {
        const nextSlice = this.getStateSlice(this._store.getState(), finalMapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          slice = nextSlice;
          this.updateTarget(target, slice, boundActionCreators);
        }
      });
      return unsubscribe;
    }

  }


  updateTarget(target, StateSlice, dispatch) {
    if (_.isFunction(target)) {
      target(StateSlice, dispatch);
    } else {
      _.assign(target, StateSlice, dispatch);
    }
  }

  getStateSlice(state, mapStateToScope) {
    const slice = mapStateToScope(state);

    invariant(
      _.isPlainObject(slice),
      '`mapStateToScope` must return an object. Instead received %s.',
      slice
      );

    return slice;
  }

}