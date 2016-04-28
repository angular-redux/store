# 2.2.2

### Features

* **type definitions**: 
  * Ported to typescript
  * Supports typed stores / reducers 
  * Uses offical Redux type definitions
* **Type Injectable**:
  * Able to inject `NgRedux` into your component by type, and not need `@Inject('ngRedux')`
  * `@Inject('ngRedux')` still works
 
 ```ts
 import { NgRedux } from 'ng2-redux';
 // ... 
 export class MyComponent {
   constructor(private ngRedux: NgRedux) {
   }
 }
 ```
* **State as Observable**: Ability to expose parts of your state as an observable.
 
 ```ts
 select<S>(selector: string | number | symbol | ((state: RootState) => S), comparer?: (x: any, y: any) => boolean): Observable<S>;
    wrapActionCreators: (actions: any) => (dispatch: Redux.Dispatch<any>) => Redux.ActionCreator<{}> | Redux.ActionCreatorsMapObject;
 ```
 
 Example use:
 
 ```js
 import { NgRedux } from 'ng2-redux';
 // ... 
 export class MyComponent implements OnInit {
   countByKey$: Observable<number>;
   countByFunc$: Observable<number>;
   constructor(private ngRedux: NgRedux) {
   }
   ngOnInit() {
      this.countByKey$ = this.ngRedux.select('count');
      this.countByFunc$ = this.ngRedux.select(state=>state.count); 
    }
 }
 ```
 
 Also have the ability to provide a custom compare function.
 
 ```js
 import { is, Map } from 'immutable';
 import { NgRedux } from 'ng2-redux';
 
 // ...
 export class MyComponent implements OnInit {
  person$: Observable<Map<string,any>>;
  constructor(private ngRedux: ngRedux) { }
  ngOnInit() {
    // even if the reference of the object has changed, 
    // if the data is the same - it wont be treated as a change
    this.person$ = this.ngRedux.select(state=>state.people.get(0),is);
  } 
} 
```