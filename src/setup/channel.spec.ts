import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { createHostMock } from '../models/host.mock';
import { Channel } from './channel';

describe('Channel', () => {
  const dateMock = jest.spyOn(Date, 'now');

  it('should send connected message on addConnection', () => {
    const coordinatorHost = createHostMock();
    const channel = new Channel('1', coordinatorHost);

    dateMock.mockReturnValue(10);
    channel.addConnection(coordinatorHost);

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(coordinatorHost.postMessage.mock.calls[0][0]).toEqual({
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
    const coordinatorHost = createHostMock();
    const channel = new Channel('1', coordinatorHost);

    channel.broadcast({ type: 'message', foo: 'bar' });

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(coordinatorHost.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        foo: 'bar',
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast message to connected', () => {
    const coordinatorHost = createHostMock();
    const childHost = createHostMock();
    const channel = new Channel('1', coordinatorHost);
    const expected = {
      action: {
        type: 'message',
      },
      channelId: '1',
      libId: LIB_ID,
    };

    channel.addConnection(childHost);
    channel.broadcast({ type: 'message' });

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage).toHaveBeenCalledTimes(2);
    expect(coordinatorHost.postMessage.mock.calls[0][0]).toEqual(expected);
    expect(childHost.postMessage.mock.calls[1][0]).toEqual(expected);
  });

  it('should broadcast history on connected', () => {
    const coordinatorHost = createHostMock();
    const childHost = createHostMock();
    const channel = new Channel('1', coordinatorHost);

    dateMock.mockReturnValue(10);
    channel.broadcast({ type: 'first' });
    channel.addConnection(childHost);

    expect(childHost.postMessage).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        timestamp: 10,
        history: [
          {
            type: 'first',
          },
        ],
      },
      private: true,
      channelId: '1',
      libId: LIB_ID,
    });

    channel.broadcast({ type: 'second' });

    expect(childHost.postMessage).toHaveBeenCalledTimes(2);
    expect(childHost.postMessage.mock.calls[1][0]).toEqual({
      action: {
        type: 'second',
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast once per distinct connection', () => {
    const coordinatorHost = createHostMock();
    const childHost = createHostMock();
    const channel = new Channel('1', coordinatorHost);

    channel.addConnection(childHost);
    channel.addConnection(coordinatorHost);
    channel.addConnection(childHost);

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(childHost.postMessage).toHaveBeenCalledTimes(2);

    channel.broadcast({ type: 'message' });

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(2);
    expect(childHost.postMessage).toHaveBeenCalledTimes(3);
  });
});
