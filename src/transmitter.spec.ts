import { LIB_ID } from './models/constants';
import { createHostMock } from './models/host.mock';
import { DEFAULT_OPTIONS } from './models/options';
import { Transmitter } from './transmitter';

describe('Transmitter', () => {
  const dateMock = jest.spyOn(Date, 'now');

  it('should emit on coordinator host', () => {
    const coordinatorHost = createHostMock();
    const transmitter = new Transmitter({ coordinatorHost });

    dateMock.mockReturnValue(10);
    transmitter.emit({ type: 'message' });

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

  it('should work with default options', () => {
    const postMessageSpy = jest.spyOn(window, 'postMessage');
    const transmitter = new Transmitter();

    dateMock.mockReturnValue(10);
    transmitter.emit({ type: 'message' });

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
