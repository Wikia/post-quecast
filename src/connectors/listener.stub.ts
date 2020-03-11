import { Subject } from 'rxjs';
import { PostMessageEvent } from '../models/post-message-event';

export type ListenerStub = {
  messages$: Subject<PostMessageEvent>;
};

export function createListenerStub(): ListenerStub {
  return {
    messages$: new Subject(),
  };
}
