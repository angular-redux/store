import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';
import { SearchActions } from '../actions/search.actions';
import { IAppState } from '../store';

@Component({
  selector: 'search',
  providers: [ SearchActions ],
  template: `
  <input
    id='search-input'
    type="text"
    class="search"
    [(ngModel)]="keyword"
    (ngModelChange)="actions.searchDispatch($event)"/>
  <p>Number of characters (from subscription): {{ numChars }}</p>
  <p>Number of characters (from async pipe): {{ numChars$ | async }}</p>
  <p>You entered: {{ search$ | async }}<p>
  `
})
export class Search {
  // Selected observables to test async pipe model.
  @select(['search', 'total']) numChars$: Observable<number>;
  @select(['search', 'keyword']) search$: Observable<string>;

  // Members to test subscribe model.
  numChars: number;
  keyword: string;

  constructor(
    private actions: SearchActions,
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    // Exercise the flow where a state change results in a new action.
    this.search$.subscribe(keyword => {
      if (keyword != '') {
        this.actions.fetchResultDispatch(keyword.length)
      }
    });

    // Exercise the flow where you set a member on change manually instead of
    // using async pipe.
    this.numChars$.subscribe(state => {
      this.numChars = state;
    });
  }
}
