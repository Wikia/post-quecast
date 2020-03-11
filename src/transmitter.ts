import { Sender } from './connectors/sender';
import { Action } from './models/action';
import { LIB_ID } from './models/constants';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './models/options';

export class Transmitter {
  private readonly channelId: string;
  private readonly sender: Sender;

  constructor(_options: Partial<PostQuecastOptions> = {}) {
    const options: PostQuecastOptions = {
      ...DEFAULT_OPTIONS,
      ..._options,
    };

    this.channelId = options.channelId;
    this.sender = Sender.make(options);
  }

  dispatch<T>(action: Action<T>): void {
    this.sender.postMessage({
      action: {
        ...action,
        timestamp: Date.now(),
      },
      channelId: this.channelId,
      private: true,
      libId: LIB_ID,
    });
  }
}
