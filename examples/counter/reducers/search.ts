import { SEARCH_ACTIONS } from '../actions/search-actions';

export interface SearchState {
  onSearch: boolean;
  keyword: string;
  total: number;
}

const searchInitState: SearchState = {
  onSearch: false,
  keyword: '',
  total: -1
};

export default function searchReducer(state = searchInitState, action):
  SearchState {
  switch (action.type) {
    case SEARCH_ACTIONS.SEARCH:
      return Object.assign({}, state, {
        onSearch: true,
        keyword: action.payload,
        total: state.total
      });
    case SEARCH_ACTIONS.SEARCH_RESULT:
      let total = action.payload.total;
      return Object.assign({}, state, {
        onSearch: state.onSearch,
        keyword: state.keyword,
        total
      });
    default:
      return state;
  }
}
