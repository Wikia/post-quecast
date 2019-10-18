import { fromEvent, Observable } from 'rxjs';
import { INTERNAL_TYPES } from '../models/constants';
import { Host } from '../models/host';
import { PostMessageEvent } from '../models/post-message-event';
import { ofEventType } from '../rxjs/of-event-type';
import { onlyExternal } from '../rxjs/only-external';
import { onlyPrivate } from '../rxjs/only-private';
import { onlyValidMessages } from '../rxjs/only-valid-messages';
import { Channel } from './channel';

export class Coordinator {
  private channels = new Map<string, Channel>();
  private messages$: Observable<PostMessageEvent> = fromEvent(this.host, 'message').pipe(
    onlyValidMessages(),
    onlyPrivate(),
  );

  constructor(private host: Host) {}

  init(): void {
    this.handleConnect();
    this.handleBroadcast();
  }

  private handleConnect(): void {
    this.messages$.pipe(ofEventType(INTERNAL_TYPES.connect)).subscribe(event => {
      const channel: Channel = this.getChannel(event.data.channelId);

      channel.addConnection(event.source);
    });
  }

  private handleBroadcast(): void {
    this.messages$.pipe(onlyExternal()).subscribe(event => {
      const channel: Channel = this.getChannel(event.data.channelId);

      channel.broadcast(event.data.action);
    });
  }

  private getChannel(channelId: string): Channel {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Channel(channelId, this.host));
    }

    return this.channels.get(channelId);
  }
}
