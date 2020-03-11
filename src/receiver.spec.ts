import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Listener } from './connectors/listener';
import { createListenerStub, ListenerStub } from './connectors/listener.stub';
import { Sender } from './connectors/sender';
import { createSenderStub, SenderStub } from './connectors/sender.stub';
import { Action } from './models/action';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { PostMessageData } from './models/post-message-data';
import { PostMessageEvent } from './models/post-message-event';
import { Receiver } from './receiver';

describe('Receiver', () => {
  let scheduler: TestScheduler;
  let senderFactory: jest.SpyInstance;
  let listenerFactory: jest.SpyInstance;
  let senderStub: SenderStub;
  let listenerStub: ListenerStub;
  let receiver: Receiver;
  const coordinatorHost = 1 as any;
  const host = 2 as any;
  const action = {
    type: 'message',
    timestamp: 10,
  };

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(10);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    senderStub = createSenderStub();
    listenerStub = createListenerStub();
    senderFactory = jest.spyOn(Sender, 'make').mockReturnValue(senderStub);
    listenerFactory = jest.spyOn(Listener, 'make').mockReturnValue(listenerStub);
    receiver = receiver = new Receiver({ host, coordinatorHost, channelId: '1' });
  });

  it('should pass correct arguments to connector factory', () => {
    const senderArgs = senderFactory.mock.calls[0][0];
    const listenerArgs = listenerFactory.mock.calls[0][0];

    expect(receiver).toBeDefined();
    expect(senderFactory).toHaveBeenCalledTimes(1);
    expect(listenerFactory).toHaveBeenCalledTimes(1);
    expect(senderArgs.host).toBe(host);
    expect(senderArgs.coordinatorHost).toBe(coordinatorHost);
    expect(listenerArgs.host).toBe(host);
    expect(listenerArgs.coordinatorHost).toBe(coordinatorHost);
  });

  it('should setup connection on create', () => {
    expect(receiver).toBeDefined();
    expect(senderStub.postMessage).toHaveBeenCalledTimes(1);
    expect(senderStub.postMessage.mock.calls[0][0]).toEqual({
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
    assertStream(receiver.actions$, '()', {});

    listenerStub.messages$.next(makeMessageEvent(action));

    assertStream(receiver.actions$, '(a)', { a: action });
  });

  it('should not expose private actions', () => {
    assertStream(receiver.actions$, '()', {});

    listenerStub.messages$.next(makeMessageEvent(action, { private: true }));

    assertStream(receiver.actions$, '()', {});
  });

  it('should keep actions history', () => {
    assertStream(receiver.actions$, '()', {});

    listenerStub.messages$.next(
      makeMessageEvent(
        {
          type: INTERNAL_TYPES.connected,
          history: [action, action, action],
          timestamp: 10,
        },
        { private: true },
      ),
    );

    assertStream(receiver.actions$, '(abc)', { a: action, b: action, c: action });
  });

  it('should keep actions history if no subscriber', () => {
    listenerStub.messages$.next(
      makeMessageEvent(
        {
          type: INTERNAL_TYPES.connected,
          history: [action, action, action],
          timestamp: 10,
        },
        { private: true },
      ),
    );

    assertStream(receiver.actions$, '(abc)', { a: action, b: action, c: action });
  });

  it('should work for multiple channels', () => {
    const receiver1 = new Receiver({ host, coordinatorHost, channelId: '1' });
    const receiver2 = new Receiver({ host, coordinatorHost, channelId: '2' });

    listenerStub.messages$.next(makeMessageEvent(action));
    listenerStub.messages$.next(makeMessageEvent(action, { channelId: '2' }));
    listenerStub.messages$.next(makeMessageEvent(action));

    assertStream(receiver1.actions$, '(ab)', { a: action, b: action });
    assertStream(receiver2.actions$, '(a)', { a: action });
  });

  function makeMessageEvent(
    _action: Action,
    additional: Partial<PostMessageData> = {},
  ): PostMessageEvent {
    return {
      source: host,
      data: {
        action: _action,
        libId: LIB_ID,
        channelId: '1',
        ...additional,
      },
    };
  }

  function assertStream(stream$: Observable<any>, marbles: string, values: any): void {
    scheduler.run(({ expectObservable }) => {
      expectObservable(stream$).toBe(marbles, values);
    });
  }
});
