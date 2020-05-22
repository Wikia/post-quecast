import { fromEventPattern, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Action, Communicator } from '../../src';

type Options = ConstructorParameters<typeof Communicator>[0];

export class RxCommunicator {
  action$: Observable<Action>;
  private communicator: Communicator;

  constructor(options?: Options) {
    this.communicator = new Communicator(options);
    this.action$ = fromEventPattern(
      (handler) => this.communicator.addListener(handler),
      (handler) => this.communicator.removeListener(handler),
    ).pipe(shareReplay({ refCount: true }));
  }

  dispatch<T>(action: Action<T>): void {
    this.communicator.dispatch(action);
  }
}
