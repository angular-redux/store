import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store/configureStore';
import counter from './counter';

const rootReducer = combineReducers<RootState>({
  counter
});

export default rootReducer;
