import shallowEqual from './utils/shallowEqual';

export default class Connector {

  constructor(store) {
    this.store = store;
    this.unsubscribe = undefined;
  }

  disconnect() {
    this.unsubscribe();
  }

  connect(selectors, callback, disableCaching = false) {
    if (!Array.isArray(selectors)) {
      selectors = [selectors];
    }

    //Initial update
    let params = selectors.map(selector => selector(this.store.getState()));
    callback(...params);

    this.unsubscribe = this.store.subscribe(() => {
      let nextParams = selectors.map(selector => selector(this.store.getState()));
      if (disableCaching || !shallowEqual(params, nextParams)) {
        callback(...nextParams);
        params = nextParams;
      }
    });

    return this;
  }

  getStore() {
    return this.store;
  }

}