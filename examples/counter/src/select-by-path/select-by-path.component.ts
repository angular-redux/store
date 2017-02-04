import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

/**
 * A component demonstrating selecting deeply nested store properties
 * with the path syntax.
 */
@Component({
  selector: 'select-by-path',
  templateUrl: './select-by-path.component.html',
})
export class SelectByPathComponent {
  @select([ 'pathDemo', 'foo' ]) foo$: Observable<Object>;
  @select([ 'pathDemo', 'foo', 'bar', 0 ]) bar$: Observable<number>;
}
