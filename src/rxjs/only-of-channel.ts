import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PostMessageEvent } from '../models/post-message-event';

export const onlyOfChannel = (channelId: string) => (
  source: Observable<PostMessageEvent>,
): Observable<PostMessageEvent> => {
  return source.pipe(filter(event => event.data.channelId === channelId));
};
