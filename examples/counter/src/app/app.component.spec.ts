/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CounterInfoComponent } from '../counter/counter-info.component';
import { CounterComponent } from '../counter/counter.component';
import { SearchComponent } from '../search/search.component';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { CounterActions } from '../counter/counter.actions';
import { SearchActions } from '../search/search.actions';
import { RandomNumberService } from '../common/random-number.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CounterInfoComponent,
        CounterComponent,
        SearchComponent,
      ],
      providers: [
        NgRedux,
        DevToolsExtension,
        CounterActions,
        SearchActions,
        RandomNumberService,
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Counter Example');
  }));
});
