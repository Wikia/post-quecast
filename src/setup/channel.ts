import { NativeSender, RxSender, Sender } from '../connectors/sender';
import { Action } from '../models/action';
import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { Host } from '../models/host';

export class Channel {
  private connectors = new Map<Host, Sender>();
  private history: Action[] = [];

  constructor(private channelId: string, private host: Host) {
    this.connectors.set(this.host, RxSender.make(this.host));
  }

  addConnection(connection: Host): void {
    this.ensurePostMessage(connection).postMessage({
      action: this.createConnectedAction(),
      private: true,
      channelId: this.channelId,
      libId: LIB_ID,
    });
  }

  private createConnectedAction(): Action {
    return {
      type: INTERNAL_TYPES.connected,
      history: this.history,
      timestamp: Date.now(),
    };
  }

  broadcast<T>(action: Action<T>): void {
    this.history.push(action);
    this.connectors.forEach(sender => {
      sender.postMessage({ action, channelId: this.channelId, libId: LIB_ID });
    });
  }

  private ensurePostMessage(connection: Host): Sender {
    if (!this.connectors.has(connection)) {
      this.connectors.set(connection, NativeSender.make(connection));
    }

    return this.connectors.get(connection);
  }
}
