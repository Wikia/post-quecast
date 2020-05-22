import { Action, setupPostQuecast } from '../../src';
import { createHostStub, HostStub } from '../../src/models/host.stub';
import { RxCommunicator } from './rx-communicator';

describe('RxCommunicator', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let host: HostStub;
  let communicator: RxCommunicator;
  const action = {
    type: 'message',
    timestamp: 10,
  };

  beforeEach(() => {
    dateMock.mockReturnValue(10);
    host = createHostStub();
    setupPostQuecast(host);
    communicator = new RxCommunicator({ host, coordinatorHost: host });
  });

  it('should keep history', () => {
    const results1: Action[] = [];
    const results2: Action[] = [];

    communicator.dispatch(action);
    communicator.action$.subscribe((a) => results1.push(a));

    expect(results1).toEqual([action]);

    communicator.dispatch(action);

    expect(results1).toEqual([action, action]);

    communicator.action$.subscribe((a) => results2.push(a));

    expect(results2).toEqual([action, action]);

    communicator.dispatch(action);

    expect(results1).toEqual([action, action, action]);
    expect(results2).toEqual([action, action, action]);
  });

  it('should unsubscribe', () => {
    const results1: Action[] = [];
    const results2: Action[] = [];

    const subscription1 = communicator.action$.subscribe((a) => results1.push(a));
    communicator.action$.subscribe((a) => results2.push(a));

    communicator.dispatch(action);

    expect(results1).toEqual([action]);
    expect(results2).toEqual([action]);

    subscription1.unsubscribe();
    communicator.dispatch(action);

    expect(results1).toEqual([action]);
    expect(results2).toEqual([action, action]);
  });

  it('should be able to resubscribe', () => {
    const results: Action[] = [];

    const subscription = communicator.action$.subscribe((a) => results.push(a));
    communicator.dispatch(action);

    expect(results).toEqual([action]);

    subscription.unsubscribe();
    results.length = 0;
    communicator.dispatch(action);

    expect(results).toEqual([]);

    communicator.action$.subscribe((a) => results.push(a));
    communicator.dispatch(action);

    expect(results).toEqual([action, action, action]);
  });
});
