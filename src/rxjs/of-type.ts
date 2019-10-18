import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../models/action';

export const ofType = <T>(...types: string[]) => (
  source: Observable<Action<T>>,
): Observable<Action<T>> => {
  return source.pipe(filter(action => types.some(type => action.type === type)));
};
