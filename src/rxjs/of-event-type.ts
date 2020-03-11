import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PostMessageEvent } from '../models/post-message-event';
import { RxJsOperator } from './rxjs-operator';

export function ofEventType(...types: string[]): RxJsOperator<PostMessageEvent> {
  return (source: Observable<PostMessageEvent>): Observable<PostMessageEvent> => {
    return source.pipe(filter(event => types.some(type => event.data.action.type === type)));
  };
}
