/* tslint:disable:max-classes-per-file */
import { fromEvent, Observable } from 'rxjs';
import { LIB_SUBJECT } from '../models/constants';
import { Host } from '../models/host';
import { PostQuecastOptions } from '../models/options';
import { PostMessageEvent } from '../models/post-message-event';
import { onlyValidMessages } from '../rxjs/only-valid-messages';
import { isRxMode } from './is-rx-mode';

export abstract class Listener {
  static make(options: Pick<PostQuecastOptions, 'host' | 'coordinatorHost'>): Listener {
    if (isRxMode(options)) {
      return RxListener.make(options.coordinatorHost);
    }

    return NativeListener.make(options.host);
  }

  messages$: Observable<PostMessageEvent>;
}

export class RxListener implements Listener {
  static make(host: Host): RxListener {
    return new RxListener(host);
  }

  readonly messages$: Observable<PostMessageEvent>;

  private constructor(host: Host) {
    this.messages$ = host[LIB_SUBJECT].asObservable().pipe(onlyValidMessages());
  }
}

export class NativeListener implements Listener {
  static make(host: Host): NativeListener {
    return new NativeListener(host);
  }

  readonly messages$: Observable<PostMessageEvent>;

  private constructor(host: Host) {
    this.messages$ = fromEvent(host, 'message').pipe(onlyValidMessages());
  }
}
