import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, toArray } from 'rxjs/operators';

import { MockNgRedux } from './ng-redux.mock';
import { NgRedux, select, select$ } from '../src';

@Component({
  template: 'whatever',
  selector: 'test-component',
})
class TestComponent {
  @select('foo') readonly obs$: Observable<number>;

  @select$('bar', obs$ => obs$.pipe(map((x: any) => 2 * x)))
  readonly barTimesTwo$: Observable<number>;

  readonly baz$: Observable<number>;

  constructor(ngRedux: NgRedux<any>) {
    this.baz$ = ngRedux.select('baz');
  }
}

describe('NgReduxMock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should reset stubs used by @select', () => {
    const instance = TestBed.createComponent(TestComponent).debugElement
      .componentInstance;

    const stub1 = MockNgRedux.getSelectorStub('foo');
    stub1.next(1);
    stub1.next(2);
    stub1.complete();

    instance.obs$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([1, 2]));

    MockNgRedux.reset();

    // Reset should result in a new stub getting created.
    const stub2 = MockNgRedux.getSelectorStub('foo');
    expect(stub1 === stub2).toBe(false);

    stub2.next(3);
    stub2.complete();

    instance.obs$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([3]));
  });

  it('should reset stubs used by @select$', () => {
    const instance = TestBed.createComponent(TestComponent).debugElement
      .componentInstance;

    const stub1 = MockNgRedux.getSelectorStub('bar');
    stub1.next(1);
    stub1.next(2);
    stub1.complete();

    instance.barTimesTwo$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([2, 4]));

    MockNgRedux.reset();

    // Reset should result in a new stub getting created.
    const stub2 = MockNgRedux.getSelectorStub('bar');
    expect(stub1 === stub2).toBe(false);

    stub2.next(3);
    stub2.complete();

    instance.obs$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([6]));
  });

  it('should reset stubs used by .select', () => {
    const instance = TestBed.createComponent(TestComponent).debugElement
      .componentInstance;

    const stub1 = MockNgRedux.getSelectorStub('baz');
    stub1.next(1);
    stub1.next(2);
    stub1.complete();

    instance.baz$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([1, 2]));

    MockNgRedux.reset();

    // Reset should result in a new stub getting created.
    const stub2 = MockNgRedux.getSelectorStub('baz');
    expect(stub1 === stub2).toBe(false);

    stub2.next(3);
    stub2.complete();

    instance.obs$
      .pipe(toArray())
      .subscribe((values: number[]) => expect(values).toEqual([3]));
  });
});
