import { Action } from './models/action';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './models/options';
import { ActionCallback, Receiver } from './receiver';
import { Transmitter } from './transmitter';

export class Communicator {
  private readonly transmitter: Transmitter;
  private readonly receiver: Receiver;

  constructor(_options: Partial<PostQuecastOptions> = {}) {
    const options: PostQuecastOptions = {
      ...DEFAULT_OPTIONS,
      ..._options,
    };

    this.transmitter = new Transmitter(options);
    this.receiver = new Receiver(options);
  }

  dispatch<T>(action: Action<T>): void {
    this.transmitter.dispatch(action);
  }

  addListener(cb: ActionCallback): void {
    this.receiver.addListener(cb);
  }

  removeListener(cb: ActionCallback): void {
    this.receiver.removeListener(cb);
  }
}
