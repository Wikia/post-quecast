import { LIB_ID, LIB_SUBJECT } from '../models/constants';
import { createHostStub, HostStub } from '../models/host.stub';
import { PostMessageData } from '../models/post-message-data';
import { PostMessageEvent } from '../models/post-message-event';
import { Listener, NativeListener, RxListener } from './listener';

describe('Listener', () => {
  let host1: HostStub;
  let host2: HostStub;

  beforeEach(() => {
    host1 = createHostStub();
    host2 = createHostStub();
  });

  it('should create rx listener if the same host', () => {
    const spy = jest.spyOn(RxListener, 'make');
    const instance = Listener.make({ coordinatorHost: host1, host: host1 });

    expect(instance instanceof RxListener).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(host1);
  });

  it('should create native listener different hosts', () => {
    const spy = jest.spyOn(NativeListener, 'make');
    const instance = Listener.make({ coordinatorHost: host1, host: host2 });

    expect(instance instanceof NativeListener).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(host2);
  });

  describe('RxListener', () => {
    it('should receive messages from host subject', () => {
      const rxListener = RxListener.make(host1);
      const results: PostMessageEvent[] = [];

      rxListener.messages$.subscribe(value => results.push(value));
      host1[LIB_SUBJECT].next(makeMessage('test1'));
      host1[LIB_SUBJECT].next(makeMessage('test2'));
      host1[LIB_SUBJECT].next('invalid' as any);

      expect(results.length).toBe(2);
      expect(results.map(result => result.data.action.type)).toEqual(['test1', 'test2']);
    });
  });

  describe('NativeListener', () => {
    it('should receive messages from host subject', () => {
      const nativeListener = NativeListener.make(host1);
      const results: PostMessageEvent[] = [];

      nativeListener.messages$.subscribe(value => results.push(value));
      host1.postMessage(makeMessageData('test1'), '*');
      host1.postMessage(makeMessageData('test2'), '*');
      host1.postMessage('invalid', '*');

      expect(results.length).toBe(2);
      expect(results.map(result => result.data.action.type)).toEqual(['test1', 'test2']);
    });
  });

  function makeMessage(type: string): PostMessageEvent {
    return {
      data: makeMessageData(type),
      source: host1,
    };
  }

  function makeMessageData(type: string): PostMessageData {
    return {
      action: { type, timestamp: 10 },
      channelId: 'default',
      libId: LIB_ID,
      private: true,
    };
  }
});
