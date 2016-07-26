import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store';
import counter from './counter.reducer';
import pathDemo from './path-demo.reducer';
import searchReducer from './search.reducer';
const rootReducer = combineReducers<RootState>({
  counter,
  pathDemo,
  searchReducer
});

export default rootReducer;
