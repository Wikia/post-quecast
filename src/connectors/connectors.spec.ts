import { LIB_ID } from '../models/constants';
import { createHostStub, HostStub } from '../models/host.stub';
import { PostMessageData } from '../models/post-message-data';
import { PostQuecastEvent } from '../models/post-quecast-event';
import { setupPostQuecast } from '../setup/setup';
import {
  CallbackConnector,
  Connector,
  PostMessageConnector,
  PostQuecastCallback,
} from './connectors';

describe('Connectors', () => {
  let host1: HostStub;
  let host2: HostStub;

  beforeEach(() => {
    host1 = createHostStub();
    host2 = createHostStub();
    setupPostQuecast(host1);
  });

  it('should create CallbackConnector if the same host', () => {
    const instance = Connector.make({ coordinatorHost: host1, host: host1 });

    expect(instance instanceof CallbackConnector).toBe(true);
  });

  it('should create PostMessageConnector if different hosts', () => {
    const instance = Connector.make({ coordinatorHost: host1, host: host2 });

    expect(instance instanceof PostMessageConnector).toBe(true);
  });

  describe('PostMessageConnector', () => {
    it('should send messages', () => {
      const message1 = makeMessageData('test1');
      const message2 = makeMessageData('test2');
      const instance = new PostMessageConnector({ senderHost: host1, listenerHost: host2 });

      instance.dispatch(message1);
      expect(host1.postMessage).toHaveBeenCalledTimes(1);
      expect(host1.postMessage).toHaveBeenCalledWith(message1, '*');

      host1.postMessage.mockClear();

      try {
        instance.dispatch('invalid' as any);
      } catch (e) {
        expect(e.message).toMatch(
          'Incorrect object type. Expected PostMessageData, but got invalid',
        );
      }

      instance.dispatch(message2);
      expect(host1.postMessage).toHaveBeenCalledTimes(1);
      expect(host1.postMessage).toHaveBeenCalledWith(message2, '*');
    });

    it('should receive messages', () => {
      const instance = new PostMessageConnector({ senderHost: host1, listenerHost: host2 });
      const results: PostQuecastEvent[] = [];
      const listener: PostQuecastCallback = (value) => results.push(value);

      instance.addListener(listener);
      host2.postMessage(makeMessageData('test1'), '*');
      host2.postMessage('invalid', '*');
      host2.postMessage(makeMessageData('test2'), '*');
      instance.removeListener(listener);
      host2.postMessage(makeMessageData('test3'), '*');
      instance.removeListener(listener);

      expect(results.map((result) => result.data.action.type)).toEqual(['test1', 'test2']);
    });
  });

  describe('CallbackConnector', () => {
    it('should send and receive messages', () => {
      const instance = new CallbackConnector(host2);
      const results: PostQuecastEvent[] = [];
      const listener: PostQuecastCallback = (value) => results.push(value);

      instance.addListener(listener);
      instance.dispatch(makeMessageData('test1'));
      try {
        instance.dispatch('invalid' as any);
      } catch (e) {
        expect(e.message).toMatch(
          'Incorrect object type. Expected PostMessageData, but got invalid',
        );
      }
      instance.dispatch(makeMessageData('test2'));
      instance.removeListener(listener);
      instance.dispatch(makeMessageData('test3'));
      instance.removeListener(listener);

      expect(results.map((result) => result.data.action.type)).toEqual(['test1', 'test2']);
      expect(results[0].source).toBe(results[1].source);
      expect(results[0].source).toBe(host2);
    });
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
