import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store';
import counter from './counter';
import pathDemo from './path-demo';

const rootReducer = combineReducers<RootState>({
  counter,
  pathDemo
});

export default rootReducer;
