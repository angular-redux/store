import { NgRedux } from '@angular-redux/store';

export const SEARCH_ACTIONS = {
  SEARCH: 'SEARCH',
  SEARCH_RESULT: 'SEARCH_RESULT',
  TERMINATE: 'TERMINATE',
  SEARCH_NEXT: 'SEARCH_NEXT',
  SEARCH_PREVIOUS: 'SEARCH_PREVIOUS'
};

import { Injectable } from '@angular/core';
@Injectable()
export class SearchActions {
  constructor(private ngRedux: NgRedux<any>) {}

  searchDispatch(keyword: string) {
    this.ngRedux.dispatch(this.search(keyword));
  }

  fetchResultDispatch(total: number) {
    this.ngRedux.dispatch(this.fetchResult(total));
  }

  private search(keyword: string) {
    return {
      type: SEARCH_ACTIONS.SEARCH,
      payload: keyword
    };
  }

  private fetchResult(total: number) {
    return {
      type: SEARCH_ACTIONS.SEARCH_RESULT,
      payload: {
        total: total
      }
    };
  }
}
