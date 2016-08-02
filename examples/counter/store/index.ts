import { combineReducers } from 'redux';
const persistState = require('redux-localstorage');
import { counterReducer } from './counter.reducer';
import { IPathDemoData, pathDemoReducer } from './path-demo.reducer';
import { ISearchState, searchReducer } from './search.reducer';

export interface IAppState {
  counter?: number;
  pathDemo?: IPathDemoData;
  search?: ISearchState;
};

export const rootReducer = combineReducers<IAppState>({
  counter: counterReducer,
  pathDemo: pathDemoReducer,
  search: searchReducer
});

export const enhancers = [
  persistState('counter', { key: 'ng2-redux/examples/counter' })
];

