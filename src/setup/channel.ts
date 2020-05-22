import { Connector, PostMessageConnector } from '../connectors/connectors';
import { Action } from '../models/action';
import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { Host } from '../models/host';

export class Channel {
  private connectors = new Map<Host, Connector>();
  private history: Action[] = [];

  constructor(private channelId: string, coordinatorHost: Host) {
    this.connectors.set(coordinatorHost, coordinatorHost[LIB_ID].callbackConnector);
  }

  addConnection(connection: Host): void {
    this.ensureConnector(connection).dispatch({
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
    this.connectors.forEach((connector) => {
      connector.dispatch({ action, channelId: this.channelId, libId: LIB_ID });
    });
  }

  private ensureConnector(connection: Host): Connector {
    if (!this.connectors.has(connection)) {
      this.connectors.set(
        connection,
        new PostMessageConnector({ senderHost: connection, listenerHost: connection }),
      );
    }

    return this.connectors.get(connection);
  }
}
