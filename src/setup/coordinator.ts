import { merge, Observable } from 'rxjs';
import { NativeListener, RxListener } from '../connectors/listener';
import { INTERNAL_TYPES } from '../models/constants';
import { Host } from '../models/host';
import { PostMessageEvent } from '../models/post-message-event';
import { ofEventType } from '../rxjs/of-event-type';
import { onlyExternal } from '../rxjs/only-external';
import { onlyPrivate } from '../rxjs/only-private';
import { Channel } from './channel';

export class Coordinator {
  private channels = new Map<string, Channel>();
  private messages$: Observable<PostMessageEvent> = this.createMessages();

  constructor(private host: Host) {}

  private createMessages(): Observable<PostMessageEvent> {
    return merge(
      NativeListener.make(this.host).messages$,
      RxListener.make(this.host).messages$,
    ).pipe(onlyPrivate());
  }

  init(): void {
    this.handleConnect();
    this.handleBroadcast();
  }

  private handleConnect(): void {
    this.messages$.pipe(ofEventType(INTERNAL_TYPES.connect)).subscribe(event => {
      const channel: Channel = this.ensureChannel(event.data.channelId);

      channel.addConnection(event.source);
    });
  }

  private handleBroadcast(): void {
    this.messages$.pipe(onlyExternal()).subscribe(event => {
      const channel: Channel = this.ensureChannel(event.data.channelId);

      channel.broadcast(event.data.action);
    });
  }

  private ensureChannel(channelId: string): Channel {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Channel(channelId, this.host));
    }

    return this.channels.get(channelId);
  }
}
