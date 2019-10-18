import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../models/action';

export const onlyNew = <T>() => (source: Observable<Action<T>>): Observable<Action<T>> => {
  const timestamp = Date.now();

  return source.pipe(filter(action => action.timestamp > timestamp));
};
