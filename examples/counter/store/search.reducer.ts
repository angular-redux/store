import { tassign } from 'tassign';
import { SEARCH_ACTIONS } from '../actions/search.actions';

export interface ISearchState {
  onSearch: boolean;
  keyword: string;
  total: number;
}

const INIT_STATE: ISearchState = {
  onSearch: false,
  keyword: '',
  total: 0
};

export function searchReducer(
  state = INIT_STATE,
  action): ISearchState {

  switch (action.type) {
    case SEARCH_ACTIONS.SEARCH:
      return tassign(state, {
        onSearch: true,
        keyword: action.payload,
        total: state.total
      });
    case SEARCH_ACTIONS.SEARCH_RESULT:
      let total = action.payload.total;
      return tassign(state, {
        onSearch: state.onSearch,
        keyword: state.keyword,
        total
      });
    default:
      return state;
  }
}
