import { CallbackConnector, PostMessageConnector } from '../connectors/connectors';
import { INTERNAL_TYPES } from '../models/constants';
import { Host } from '../models/host';
import {
  isEventExternal,
  isEventOfType,
  isEventPublic,
  PostQuecastEvent,
} from '../models/post-quecast-event';
import { Channel } from './channel';

export class Coordinator {
  callbackConnector: CallbackConnector;
  private postMessageConnector: PostMessageConnector;
  private channels = new Map<string, Channel>();

  constructor(private coordinatorHost: Host) {
    this.callbackConnector = new CallbackConnector(coordinatorHost);
    this.postMessageConnector = new PostMessageConnector({
      senderHost: coordinatorHost,
      listenerHost: coordinatorHost,
    });
  }

  init(): void {
    const handleEvents = (event: PostQuecastEvent) => {
      if (isEventPublic(event)) {
        return;
      }

      this.handleConnect(event);
      this.handleBroadcast(event);
    };

    this.callbackConnector.addListener(handleEvents);
    this.postMessageConnector.addListener(handleEvents);
  }

  private handleConnect(event: PostQuecastEvent): void {
    if (!isEventOfType(event, INTERNAL_TYPES.connect)) {
      return;
    }

    const channel: Channel = this.ensureChannel(event.data.channelId);

    channel.addConnection(event.source);
  }

  private handleBroadcast(event: PostQuecastEvent): void {
    if (!isEventExternal(event)) {
      return;
    }

    const channel: Channel = this.ensureChannel(event.data.channelId);

    channel.broadcast(event.data.action);
  }

  private ensureChannel(channelId: string): Channel {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Channel(channelId, this.coordinatorHost));
    }

    return this.channels.get(channelId);
  }
}
