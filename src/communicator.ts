import { Observable } from 'rxjs';
import { Action } from './models/action';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './models/options';
import { Receiver } from './receiver';
import { Transmitter } from './transmitter';

export class Communicator {
  actions$: Observable<Action>;
  private readonly options: PostQuecastOptions;
  private transmitter: Transmitter;
  private receiver: Receiver;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.transmitter = new Transmitter(this.options);
    this.receiver = new Receiver(this.options);
    this.actions$ = this.receiver.actions$;
  }

  emit<T>(action: Action<T>): void {
    this.transmitter.emit(action);
  }
}
