import { Action } from './models/action';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { createHostStub, HostStub } from './models/host.stub';
import { PostMessageData } from './models/post-message-data';
import { Receiver } from './receiver';
import { setupPostQuecast } from './setup/setup';

describe('Receiver', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let coordinatorHost: HostStub;
  let childHost: HostStub;
  const action = {
    type: 'message',
    timestamp: 10,
  };

  beforeEach(() => {
    createMessage(null as any);
    dateMock.mockReturnValue(10);
    coordinatorHost = createHostStub();
    childHost = createHostStub();
    setupPostQuecast(coordinatorHost);
  });

  it('should setup connection on childHost', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const receiver = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });

    expect(receiver).toBeDefined();
    // sent message
    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(coordinatorHost.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connect,
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
    // broadcast message
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        history: [],
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
  });

  it('should setup connection on coordinatorHost', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const receiver = new Receiver({ host: coordinatorHost, coordinatorHost, channelId: '1' });

    expect(receiver).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2);
    // sent message
    expect(spy.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connect,
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
    // broadcast message
    expect(spy.mock.calls[1][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        history: [],
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
  });

  it('should expose only public actions', () => {
    const receiver = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });
    const results: Action[] = [];

    receiver.addListener((a) => results.push(a));

    expect(results).toEqual([]);

    childHost.postMessage(createMessage(action), '*');

    expect(results).toEqual([action]);

    childHost.postMessage(createMessage(action, { private: true }), '*');

    expect(results).toEqual([action]);
  });

  it('should keep actions history', () => {
    const receiver1 = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });
    const receiver2 = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });
    const results1: Action[] = [];
    const results2: Action[] = [];

    receiver1.addListener((a) => results1.push(a));

    childHost.postMessage(
      createMessage(
        { type: INTERNAL_TYPES.connected, history: [action, action, action], timestamp: 10 },
        { private: true },
      ),
      '*',
    );

    receiver2.addListener((a) => results2.push(a));

    expect(results1).toEqual(results2);
    expect(results1).toEqual([action, action, action]);

    results1.length = 0;
    results2.length = 0;

    childHost.postMessage(createMessage(action), '*');

    expect(results1).toEqual(results2);
    expect(results1).toEqual([action]);
  });

  it('should work for multiple channels', () => {
    const receiver1 = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });
    const receiver2 = new Receiver({ host: childHost, coordinatorHost, channelId: '2' });
    const results1: Action[] = [];
    const results2: Action[] = [];

    receiver1.addListener((a) => results1.push(a));
    receiver2.addListener((a) => results2.push(a));
    childHost.postMessage(createMessage(action), '*');
    childHost.postMessage(createMessage(action, { channelId: '2' }), '*');
    childHost.postMessage(createMessage(action), '*');

    expect(results1).toEqual([action, action]);
    expect(results2).toEqual([action]);
  });

  it('should stop listening after removeListener', () => {
    const receiver = new Receiver({ host: childHost, coordinatorHost, channelId: '1' });
    const results: Action[] = [];
    const listener = (a: Action) => results.push(a);

    receiver.addListener(listener);
    childHost.postMessage(createMessage(action), '*');
    receiver.removeListener(listener);
    childHost.postMessage(createMessage(action), '*');

    expect(results).toEqual([action]);
    receiver.removeListener(listener);
  });
});

function createMessage(action: Action, additional: Partial<PostMessageData> = {}): PostMessageData {
  return {
    action,
    libId: LIB_ID,
    channelId: '1',
    ...additional,
  };
}
