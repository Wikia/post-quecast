import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../models/action';
import { RxJsOperator } from './rxjs-operator';

export function ofType<T>(...types: string[]): RxJsOperator<Action<T>> {
  return (source: Observable<Action<T>>): Observable<Action<T>> => {
    return source.pipe(filter(action => types.some(type => action.type === type)));
  };
}
