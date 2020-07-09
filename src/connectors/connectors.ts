/* tslint:disable:max-classes-per-file */
import { LIB_ID } from '../models/constants';
import { Host } from '../models/host';
import { PostQuecastOptions } from '../models/options';
import { isPostMessageData, PostMessageData } from '../models/post-message-data';
import { isPostQuecastEvent, PostQuecastEvent } from '../models/post-quecast-event';

export type PostQuecastCallback = (event: PostQuecastEvent) => void;

function isCallbackMode(options: Pick<PostQuecastOptions, 'host' | 'coordinatorHost'>): boolean {
  return (
    options.host === options.coordinatorHost && !!options.coordinatorHost[LIB_ID]?.callbackConnector
  );
}

export abstract class Connector {
  static make(options: Pick<PostQuecastOptions, 'host' | 'coordinatorHost'>): Connector {
    if (isCallbackMode(options)) {
      return options.coordinatorHost[LIB_ID].callbackConnector;
    }

    return new PostMessageConnector({
      senderHost: options.coordinatorHost,
      listenerHost: options.host,
    });
  }

  abstract dispatch(data: PostMessageData): void;
  abstract addListener(cb: PostQuecastCallback): void;
  abstract removeListener(cb: PostQuecastCallback): void;
}

export class CallbackConnector implements Connector {
  private callbacks: PostQuecastCallback[] = [];

  constructor(private coordinatorHost: Host) {}

  dispatch(data: PostMessageData): void {
    if (!isPostMessageData(data)) {
      throw new Error(`Incorrect object type. Expected PostMessageData, but got ${data}`);
    }

    this.callbacks.forEach((cb) => cb({ data, source: this.coordinatorHost }));
  }

  addListener(cb: PostQuecastCallback): void {
    this.callbacks.push(cb);
  }

  removeListener(cb: PostQuecastCallback): void {
    this.callbacks = this.callbacks.filter((_cb) => _cb !== cb);
  }
}

interface PostMessageConnectorOptions {
  senderHost: Host;
  listenerHost: Host;
}

export class PostMessageConnector implements Connector {
  private map = new Map<PostQuecastCallback, (event: any) => void>();

  constructor(private options: PostMessageConnectorOptions) {}

  dispatch(data: PostMessageData): void {
    if (!isPostMessageData(data)) {
      throw new Error(`Incorrect object type. Expected PostMessageData, but got ${data}`);
    }
    this.options.senderHost.postMessage(data, '*');
  }

  addListener(cb: PostQuecastCallback): void {
    const wrapper = (event: any) => {
      if (!isPostQuecastEvent(event)) {
        return;
      }
      cb(event);
    };
    this.map.set(cb, wrapper);

    this.options.listenerHost.addEventListener('message', wrapper);
  }

  removeListener(cb: PostQuecastCallback): void {
    const wrapper = this.map.get(cb);

    this.options.listenerHost.removeEventListener('message', wrapper);
    this.map.delete(cb);
  }
}
