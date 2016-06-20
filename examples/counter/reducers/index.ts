import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store';
import counter from './counter';

const rootReducer = combineReducers<RootState>({
  counter
});

export default rootReducer;
