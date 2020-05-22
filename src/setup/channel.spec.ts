import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { createHostStub, HostStub } from '../models/host.stub';
import { Channel } from './channel';
import { setupPostQuecast } from './setup';

describe('Channel', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let coordinatorHost: HostStub;
  let childHost: HostStub;

  beforeEach(() => {
    coordinatorHost = createHostStub();
    childHost = createHostStub();
    setupPostQuecast(coordinatorHost);
  });

  it('should send connected message on addConnection', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const channel = new Channel('1', coordinatorHost);

    dateMock.mockReturnValue(10);
    channel.addConnection(coordinatorHost);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        timestamp: 10,
        history: [],
      },
      private: true,
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast message to coordinator host', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const channel = new Channel('1', coordinatorHost);

    channel.broadcast({ type: 'message', foo: 'bar', timestamp: 10 });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        foo: 'bar',
        timestamp: 10,
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast message to connected', () => {
    const expected = {
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: '1',
      libId: LIB_ID,
    };

    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const channel = new Channel('1', coordinatorHost);

    channel.addConnection(childHost);
    channel.broadcast({ type: 'message', timestamp: 10 });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toEqual(expected);
    expect(childHost.postMessage.mock.calls[1][0]).toEqual(expected);
  });

  it('should broadcast history on connected', () => {
    const channel = new Channel('1', coordinatorHost);

    dateMock.mockReturnValue(10);
    channel.broadcast({ type: 'first', timestamp: 10 });
    channel.addConnection(childHost);

    expect(childHost.postMessage).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        timestamp: 10,
        history: [
          {
            type: 'first',
            timestamp: 10,
          },
        ],
      },
      private: true,
      channelId: '1',
      libId: LIB_ID,
    });

    channel.broadcast({ type: 'second', timestamp: 10 });

    expect(childHost.postMessage).toHaveBeenCalledTimes(2);
    expect(childHost.postMessage.mock.calls[1][0]).toEqual({
      action: {
        type: 'second',
        timestamp: 10,
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast once per distinct connection', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const channel = new Channel('1', coordinatorHost);

    channel.addConnection(childHost);
    channel.addConnection(coordinatorHost);
    channel.addConnection(childHost);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage).toHaveBeenCalledTimes(2);

    channel.broadcast({ type: 'message', timestamp: 10 });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(childHost.postMessage).toHaveBeenCalledTimes(3);
  });
});
