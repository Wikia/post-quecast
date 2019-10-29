import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from '../models/action';
import { PostMessageEvent } from '../models/post-message-event';

export const mapAction = () => (source: Observable<PostMessageEvent>): Observable<Action> => {
  return source.pipe(map(event => event.data.action));
};
