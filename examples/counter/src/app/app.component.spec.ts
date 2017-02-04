/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from './app.component';
import { CounterInfoComponent } from '../counter/counter-info.component';
import { CounterComponent } from '../counter/counter.component';
import { SearchComponent } from '../search/search.component';
import { SelectByPathComponent } from '../select-by-path/select-by-path.component';
import { SelectRootStateComponent } from '../select-root-state/select-root-state.component';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { CounterActions } from '../counter/counter.actions';
import { SearchActions } from '../search/search.actions';
import { RandomNumberService } from '../common/random-number.service';

const mockRedux = {
  dispatch(action) {},
  configureStore() {},
  select() {
    return Observable.from('test');
  }
};

NgRedux.instance = mockRedux;

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CounterInfoComponent,
        CounterComponent,
        SearchComponent,
        SelectByPathComponent,
        SelectRootStateComponent,
      ],
      providers: [
        { provide: NgRedux, useValue: mockRedux },
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
    expect(compiled.querySelector('h1').textContent).toContain('Counter Demo');
  }));
});
