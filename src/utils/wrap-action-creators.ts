import { ActionCreator,
  ActionCreatorsMapObject,
  bindActionCreators as bac,
  Dispatch } from 'redux';

function wrapActionCreator
  <T extends ActionCreator<T> | ActionCreatorsMapObject>(actionCreators) {
  return (dispatch: Dispatch<any>): T => bac(actionCreators, dispatch);
}
export default wrapActionCreator;

