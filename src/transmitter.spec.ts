import { LIB_ID } from './models/constants';
import { createHostStub, HostStub } from './models/host.stub';
import { DEFAULT_OPTIONS } from './models/options';
import { setupPostQuecast } from './setup/setup';
import { Transmitter } from './transmitter';

describe('Transmitter', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let coordinatorHost: HostStub;
  let childHost: HostStub;

  beforeEach(() => {
    coordinatorHost = createHostStub();
    childHost = createHostStub();
    setupPostQuecast(coordinatorHost);
    dateMock.mockReturnValue(10);
  });

  it('should dispatch on coordinator host', () => {
    const spy = jest.spyOn(coordinatorHost['@wikia/post-quecast'].callbackConnector, 'dispatch');
    const transmitter = new Transmitter({ coordinatorHost, host: coordinatorHost });

    transmitter.dispatch({ type: 'message' });

    expect(spy).toHaveBeenCalledTimes(2);
    // sent message
    expect(spy.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: DEFAULT_OPTIONS.channelId,
      private: true,
      libId: LIB_ID,
    });
    // broadcast message
    expect(spy.mock.calls[1][0]).toEqual({
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: DEFAULT_OPTIONS.channelId,
      libId: LIB_ID,
    });
  });

  it('should dispatch on child host', () => {
    const transmitter = new Transmitter({ coordinatorHost, host: childHost });

    transmitter.dispatch({ type: 'message' });

    expect(coordinatorHost.postMessage).toHaveBeenCalledTimes(1);
    expect(coordinatorHost.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: DEFAULT_OPTIONS.channelId,
      private: true,
      libId: LIB_ID,
    });
  });

  it('should pass with default options', () => {
    const postMessageSpy = jest.spyOn(window, 'postMessage');
    const transmitter = new Transmitter();

    transmitter.dispatch({ type: 'message' });

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    expect(postMessageSpy.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: DEFAULT_OPTIONS.channelId,
      private: true,
      libId: LIB_ID,
    });
  });
});
