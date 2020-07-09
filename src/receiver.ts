import { Connector } from './connectors/connectors';
import { Action, isActionOfType } from './models/action';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { PostQuecastOptions } from './models/options';
import {
  getEventAction,
  isEventOfChannel,
  isEventPrivate,
  isEventPublic,
  PostQuecastEvent,
} from './models/post-quecast-event';

export type ActionCallback = (action: Action) => void;

export class Receiver {
  private callbacks: ActionCallback[] = [];
  private history: Action[] = [];
  private readonly channelId: string;
  private readonly connector: Connector;

  constructor(options: PostQuecastOptions) {
    this.channelId = options.channelId;
    this.connector = Connector.make(options);
    this.setupActions();
    this.setupConnection();
  }

  private setupActions(): void {
    this.getHistory();
    this.listenEvent();
  }

  private getHistory(): void {
    const callback = (event: PostQuecastEvent) => {
      if (!isEventOfChannel(event, this.channelId)) {
        return;
      }

      if (!isEventPrivate(event)) {
        return;
      }

      const action = getEventAction(event);

      if (!isActionOfType<{ history: Action[] }>(action, INTERNAL_TYPES.connected)) {
        return;
      }

      this.connector.removeListener(callback);
      this.handleActions(...action.history);
    };

    this.connector.addListener(callback);
  }

  private listenEvent(): void {
    const callback = (event: PostQuecastEvent) => {
      if (!isEventOfChannel(event, this.channelId)) {
        return;
      }

      if (!isEventPublic(event)) {
        return;
      }

      const action = getEventAction(event);

      this.handleActions(action);
    };

    this.connector.addListener(callback);
  }

  private handleActions(...actions: Action[]): void {
    this.history.push(...actions);
    actions.forEach((action) => this.callbacks.forEach((cb) => cb(action)));
  }

  private setupConnection(): void {
    this.connector.dispatch({
      action: { type: INTERNAL_TYPES.connect, timestamp: Date.now() },
      channelId: this.channelId,
      private: true,
      libId: LIB_ID,
    });
  }

  addListener(cb: ActionCallback): void {
    this.history.forEach((action) => cb(action));
    this.callbacks.push(cb);
  }

  removeListener(cb: ActionCallback): void {
    this.callbacks = this.callbacks.filter((_cb) => _cb !== cb);
  }
}
