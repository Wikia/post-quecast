import { Action } from './models/action';
import { LIB_ID } from './models/constants';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './models/options';

export class Transmitter {
  private options: PostQuecastOptions;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  emit<T>(action: Action<T>): void {
    this.options.coordinatorHost.postMessage(
      {
        action: {
          ...action,
          timestamp: Date.now(),
        },
        channelId: this.options.channelId,
        private: true,
        libId: LIB_ID,
      },
      '*',
    );
  }
}
