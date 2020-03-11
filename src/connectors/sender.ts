/* tslint:disable:max-classes-per-file */
import { LIB_SUBJECT } from '../models/constants';
import { Host } from '../models/host';
import { PostQuecastOptions } from '../models/options';
import { PostMessageData } from '../models/post-message-data';
import { isRxMode } from './is-rx-mode';

export abstract class Sender {
  static make(options: Pick<PostQuecastOptions, 'host' | 'coordinatorHost'>): Sender {
    if (isRxMode(options)) {
      return RxSender.make(options.coordinatorHost);
    }

    return NativeSender.make(options.coordinatorHost);
  }

  abstract postMessage(message: PostMessageData): void;
}

export class RxSender implements Sender {
  static make(host: Host): RxSender {
    return new RxSender(host);
  }

  private constructor(private host: Host) {}

  postMessage(message: PostMessageData): void {
    this.host[LIB_SUBJECT].next({ data: message, source: this.host });
  }
}

export class NativeSender implements Sender {
  static make(host: Host): NativeSender {
    return new NativeSender(host);
  }

  private constructor(private host: Host) {}

  postMessage(message: PostMessageData): void {
    try {
      this.host.postMessage(message, '*');
    } catch (e) {
      // fail silently if not serializable message
    }
  }
}
