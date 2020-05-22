import { Observable } from 'rxjs';

export type RxJsOperator<TSource = any, TResult = TSource> = (
  source: Observable<TSource>,
) => Observable<TResult>;
