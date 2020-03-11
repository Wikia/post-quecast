import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from '../models/action';
import { PostMessageEvent } from '../models/post-message-event';
import { RxJsOperator } from './rxjs-operator';

export function mapAction(): RxJsOperator<PostMessageEvent, Action> {
  return (source: Observable<PostMessageEvent>): Observable<Action> => {
    return source.pipe(map(event => event.data.action));
  };
}
