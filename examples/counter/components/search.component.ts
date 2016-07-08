import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { SearchActions } from '../actions/search-actions';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'search',
  providers: [SearchActions],
  template: `
  <p>
    Counter: {{ counter }} <br/> 
    Counter$ Async: {{ counter$ | async }} <br/>
    <input id='search-input' type="text" class="search"
    [(ngModel)]="keyword" (ngModelChange)="searchKeyword()"/>
  </p>
  `
})
export class Search {
  counter$: Observable<any>;
  search$: Observable<any>;
  counter;
  keyword: string;

  constructor(private actions: SearchActions, private ngRedux: NgRedux<any>) { }

  ngOnInit() {
    this.counter$ = this.ngRedux.select(state => state.searchReducer.total);
    this.search$ = this.ngRedux.select(state => state.searchReducer.keyword);

    

this.search$.subscribe((keyword) => {
      if (keyword != '') {
        this.actions.fetchResultDispatch(keyword.length)
      }
    });
    
    this.counter$.subscribe(state => {

      this.counter = state;
    });

    

    
    
  }

  private searchKeyword() {
    this.actions.searchDispatch(this.keyword);
  }
}
