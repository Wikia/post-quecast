import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { createHostMock } from './models/host.mock';
import { Receiver } from './receiver';

describe('Receiver', () => {
  let scheduler: TestScheduler;
  const action = {
    type: 'message',
    timestamp: 10,
  };

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(10);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should setup connection on create', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    expect(receiver).toBeDefined();
    expect(host.postMessage).toHaveBeenCalledTimes(1);
    expect(host.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connect,
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
  });

  it('should expose public actions', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    assertStream(receiver.actions$, '()', {});

    host.postMessage({ action, channelId: '1', libId: LIB_ID }, '*');

    assertStream(receiver.actions$, '(a)', { a: action });
  });

  it('should not expose private actions', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    assertStream(receiver.actions$, '()', {});

    host.postMessage(
      {
        action,
        channelId: '1',
        libId: LIB_ID,
        private: true,
      },
      '*',
    );

    assertStream(receiver.actions$, '()', {});
  });

  it('should keep actions history', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    assertStream(receiver.actions$, '()', {});

    host.postMessage(
      {
        action: {
          type: INTERNAL_TYPES.connected,
          history: [action, action, action],
          timestamp: 10,
        },
        private: true,
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );

    assertStream(receiver.actions$, '(abc)', { a: action, b: action, c: action });
  });

  it('should keep actions history if no subscriber', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    host.postMessage(
      {
        action: {
          type: INTERNAL_TYPES.connected,
          history: [action, action, action],
          timestamp: 10,
        },
        private: true,
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );

    assertStream(receiver.actions$, '(abc)', { a: action, b: action, c: action });
  });

  it('should work for coordinator and child', () => {
    const coordinatorHost = createHostMock();
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost, channelId: '1' });

    host.postMessage(
      {
        action: {
          type: 'host message',
          timestamp: 10,
        },
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );
    coordinatorHost.postMessage(
      {
        action: {
          type: 'coordinator host message',
          timestamp: 10,
        },
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );

    assertStream(receiver.actions$, '(a)', { a: { type: 'host message', timestamp: 10 } });
  });

  it('should work for multiple channels', () => {
    const host = createHostMock();
    const receiver1 = new Receiver({ host, coordinatorHost: host, channelId: '1' });
    const receiver2 = new Receiver({ host, coordinatorHost: host, channelId: '2' });

    host.postMessage({ action, channelId: '1', libId: LIB_ID }, '*');
    host.postMessage({ action, channelId: '2', libId: LIB_ID }, '*');
    host.postMessage({ action, channelId: '1', libId: LIB_ID }, '*');

    assertStream(receiver1.actions$, '(ab)', { a: action, b: action });
    assertStream(receiver2.actions$, '(a)', { a: action });
  });

  function assertStream(stream$: Observable<any>, marbles: string, values: any): void {
    scheduler.run(({ expectObservable }) => {
      expectObservable(stream$).toBe(marbles, values);
    });
  }
});
