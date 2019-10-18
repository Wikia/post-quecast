import { fromEvent, merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import { Action } from './models/action';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { PostQuecastOptions } from './models/options';
import { PostMessageEvent } from './models/post-message-event';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Receiver {
  actions$: Observable<Action>;

  constructor(private options: PostQuecastOptions) {
    this.setupActions();
    this.setupConnection();
  }

  private setupActions(): void {
    const messages$: Observable<PostMessageEvent> = fromEvent(this.options.host, 'message').pipe(
      onlyValidMessages(),
      onlyOfChannel(this.options.channelId),
    );

    const history$ = messages$.pipe(
      onlyPrivate(),
      mapAction(),
      ofType(INTERNAL_TYPES.connected),
      take(1),
      mergeMap(action => of(...action.history)),
    );

    const public$ = messages$.pipe(
      onlyPublic(),
      mapAction(),
    );

    this.actions$ = merge(history$, public$).pipe(shareReplay());
    this.actions$.subscribe(); // start listening right away
  }

  private setupConnection(): void {
    this.options.coordinatorHost.postMessage(
      {
        action: { type: INTERNAL_TYPES.connect, timestamp: Date.now() },
        channelId: this.options.channelId,
        private: true,
        libId: LIB_ID,
      },
      '*',
    );
  }
}
