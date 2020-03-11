import { merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import { Listener } from './connectors/listener';
import { Sender } from './connectors/sender';
import { Action } from './models/action';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { PostQuecastOptions } from './models/options';
import { PostMessageEvent } from './models/post-message-event';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';

export class Receiver {
  actions$: Observable<Action>;
  private readonly channelId: string;
  private readonly listener: Listener;
  private readonly sender: Sender;

  constructor(options: PostQuecastOptions) {
    this.channelId = options.channelId;
    this.listener = Listener.make(options);
    this.sender = Sender.make(options);
    this.setupActions();
    this.setupConnection();
  }

  private setupActions(): void {
    const messages$: Observable<PostMessageEvent> = this.listener.messages$.pipe(
      onlyOfChannel(this.channelId),
    );

    const history$ = messages$.pipe(
      onlyPrivate(),
      mapAction(),
      ofType(INTERNAL_TYPES.connected),
      take(1),
      mergeMap(action => of(...action.history)),
    );

    const public$ = messages$.pipe(onlyPublic(), mapAction());

    this.actions$ = merge(history$, public$).pipe(shareReplay());
    this.actions$.subscribe(); // start listening right away
  }

  private setupConnection(): void {
    this.sender.postMessage({
      action: { type: INTERNAL_TYPES.connect, timestamp: Date.now() },
      channelId: this.channelId,
      private: true,
      libId: LIB_ID,
    });
  }
}
