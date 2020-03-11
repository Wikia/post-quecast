import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PostMessageEvent } from '../models/post-message-event';
import { RxJsOperator } from './rxjs-operator';

export function onlyPrivate(): RxJsOperator<PostMessageEvent> {
  return (source: Observable<PostMessageEvent>): Observable<PostMessageEvent> => {
    return source.pipe(filter(event => !!event.data.private));
  };
}
