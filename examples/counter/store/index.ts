const persistState = require('redux-localstorage');

export const enhancers = [
  persistState('counter', { key: 'ng2-redux/examples/counter' })
];

export interface RootState {
  counter: number;
  pathDemo: Object;
}
