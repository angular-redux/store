import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgReduxModule } from 'ng2-redux';
import { CounterActions } from '../actions/counter.actions';
import { SearchActions } from '../actions/search.actions';
import { App } from './app.component';
import { CounterInfo } from '../components/counter-info.component';
import { Counter } from '../components/counter.component';
import { Search } from '../components/search.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NgReduxModule.forRoot(),
  ],
  declarations: [
    App,
    CounterInfo,
    Counter,
    Search,
  ],
  bootstrap: [ App ],
  providers: [
    CounterActions,
    SearchActions,
  ]
})
export class AppModule {}
