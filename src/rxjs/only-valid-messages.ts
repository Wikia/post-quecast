import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPostMessageEvent, PostMessageEvent } from '../models/post-message-event';
import { RxJsOperator } from './rxjs-operator';

export function onlyValidMessages(): RxJsOperator<any, PostMessageEvent> {
  return (source: Observable<any>): Observable<PostMessageEvent> => {
    return source.pipe(filter(event => isPostMessageEvent(event)));
  };
}
