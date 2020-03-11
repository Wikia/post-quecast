import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { INTERNAL_TYPES } from '../models/constants';
import { PostMessageEvent } from '../models/post-message-event';
import { RxJsOperator } from './rxjs-operator';

export function onlyExternal(): RxJsOperator<PostMessageEvent> {
  return (source: Observable<PostMessageEvent>): Observable<PostMessageEvent> => {
    return source.pipe(
      filter(
        event =>
          !Object.values(INTERNAL_TYPES).some((type: string) => event.data.action.type === type),
      ),
    );
  };
}
