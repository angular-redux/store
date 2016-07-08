import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store';
import counter from './counter';
import pathDemo from './path-demo';
import searchReducer from './search';
const rootReducer = combineReducers<RootState>({
  counter,
  pathDemo,
  searchReducer
});

export default rootReducer;
