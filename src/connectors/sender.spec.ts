import { LIB_ID, LIB_SUBJECT } from '../models/constants';
import { createHostStub, HostStub } from '../models/host.stub';
import { PostMessageData } from '../models/post-message-data';
import { PostMessageEvent } from '../models/post-message-event';
import { NativeSender, RxSender, Sender } from './sender';

describe('Sender', () => {
  let host1: HostStub;
  let host2: HostStub;

  beforeEach(() => {
    host1 = createHostStub();
    host2 = createHostStub();
  });

  it('should create RxSender if the same host', () => {
    const spy = jest.spyOn(RxSender, 'make');
    const instance = Sender.make({ coordinatorHost: host1, host: host1 });

    expect(instance instanceof RxSender).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(host1);
  });

  it('should create NativeSender different hosts', () => {
    const spy = jest.spyOn(NativeSender, 'make');
    const instance = Sender.make({ coordinatorHost: host1, host: host2 });

    expect(instance instanceof NativeSender).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(host1);
  });

  describe('RxSender', () => {
    it('should send messages through host', () => {
      const message1 = makeMessageData('test1');
      const message2 = makeMessageData('test2');
      const rxSender = RxSender.make(host1);
      const results: PostMessageEvent[] = [];

      host1[LIB_SUBJECT].subscribe((value) => results.push(value));

      rxSender.postMessage(message1);
      rxSender.postMessage(message2);

      expect(results.length).toBe(2);
      expect(results.map((result) => result.data.action.type)).toEqual(['test1', 'test2']);
      expect(results[0].source).toBe(results[1].source);
      expect(results[0].source).toBe(host1);
    });
  });

  describe('NativeSender', () => {
    it('should send messages through host', () => {
      const message1 = makeMessageData('test1');
      const message2 = makeMessageData('test2');
      const nativeSender = NativeSender.make(host1);

      nativeSender.postMessage(message1);
      expect(host1.postMessage).toHaveBeenCalledTimes(1);
      expect(host1.postMessage).toHaveBeenCalledWith(message1, '*');

      host1.postMessage.mockClear();

      nativeSender.postMessage(message2);
      expect(host1.postMessage).toHaveBeenCalledTimes(1);
      expect(host1.postMessage).toHaveBeenCalledWith(message2, '*');
    });
  });

  function makeMessageData(type: string): PostMessageData {
    return {
      action: { type, timestamp: 10 },
      channelId: 'default',
      libId: LIB_ID,
      private: true,
    };
  }
});
