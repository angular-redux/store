import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgReduxModule, DevToolsExtension } from 'ng2-redux';
import { CounterActions } from '../counter/counter.actions';
import { SearchActions } from '../search/search.actions';
import { AppComponent } from './app.component';
import { CounterInfoComponent } from '../counter/counter-info.component';
import { CounterComponent } from '../counter/counter.component';
import { SearchComponent } from '../search/search.component';
import { RandomNumberService } from '../common/random-number.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NgReduxModule,
  ],
  declarations: [
    AppComponent,
    CounterInfoComponent,
    CounterComponent,
    SearchComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    CounterActions,
    SearchActions,
    RandomNumberService,
  ]
})
export class AppModule {}
