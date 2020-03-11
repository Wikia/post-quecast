import { Subject } from 'rxjs';
import { LIB_ID, LIB_SUBJECT } from './constants';
import { PostMessageEvent } from './post-message-event';

export interface Host {
  addEventListener: Window['addEventListener'];
  removeEventListener: Window['removeEventListener'];
  postMessage: Window['postMessage'];
  [LIB_ID]?: any;
  [LIB_SUBJECT]?: Subject<PostMessageEvent>;
}
