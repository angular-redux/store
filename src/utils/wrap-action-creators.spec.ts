import {expect} from 'chai';
import wrapActionCreators from './wrap-action-creators';
import {ActionCreator, ActionCreatorsMapObject}  from 'redux';


interface ITest extends ActionCreatorsMapObject {
  action: (payload: any) => any;
}

describe('wrapActionCreators', () => {
  it(`should return a function that wraps function in a 
    call to bindActionCreators`, () => {

      let dispatch = (action) => ({ dispatched: action });

      const actionResult = { type: 'action' };

      const action = (payload) => ({ type: 'TYPE', payload });
      const actionCreatorObj = { action };

      const wrappedAction = wrapActionCreators<ActionCreator<any>>(action);
      const boundActionResult = wrappedAction(dispatch)('payload');
      expect(boundActionResult.dispatched)
        .to
        .deep
        .equal({ type: 'TYPE', payload: 'payload' });

      const wrappedActionObj = wrapActionCreators<ITest>(actionCreatorObj);
      const boundActionObjResult = wrappedActionObj(dispatch).action('payload');

      expect(boundActionObjResult.dispatched)
        .to
        .deep
        .equal({ type: 'TYPE', payload: 'payload' });
    });
});

