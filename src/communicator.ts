import { Observable } from 'rxjs';
import { Action } from './models/action';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './models/options';
import { Receiver } from './receiver';
import { Transmitter } from './transmitter';

export class Communicator {
  readonly actions$: Observable<Action>;
  private readonly transmitter: Transmitter;

  constructor(_options: Partial<PostQuecastOptions> = {}) {
    const options: PostQuecastOptions = {
      ...DEFAULT_OPTIONS,
      ..._options,
    };

    this.transmitter = new Transmitter(options);
    this.actions$ = new Receiver(options).actions$;
  }

  dispatch<T>(action: Action<T>): void {
    this.transmitter.dispatch(action);
  }
}
