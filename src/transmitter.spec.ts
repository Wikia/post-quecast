import { Sender } from './connectors/sender';
import { createSenderStub } from './connectors/sender.stub';
import { LIB_ID } from './models/constants';
import { createHostStub } from './models/host.stub';
import { DEFAULT_OPTIONS } from './models/options';
import { Transmitter } from './transmitter';

describe('Transmitter', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let senderFactory: jest.SpyInstance;

  beforeEach(() => {
    senderFactory = jest.spyOn(Sender, 'make');
  });

  afterEach(() => {
    senderFactory.mockClear();
  });

  it('should dispatch on coordinator host', () => {
    const coordinatorHost = createHostStub();
    const senderStub = createSenderStub();
    senderFactory.mockImplementation(() => senderStub);
    const transmitter = new Transmitter({ coordinatorHost });

    expect(senderFactory.mock.calls[0][0].coordinatorHost).toBe(coordinatorHost);
    expect(senderFactory.mock.calls[0][0].host).toBe(DEFAULT_OPTIONS.host);

    dateMock.mockReturnValue(10);
    transmitter.dispatch({ type: 'message' });

    expect(senderStub.postMessage).toHaveBeenCalledTimes(1);
    expect(senderStub.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        timestamp: 10,
      },
      channelId: DEFAULT_OPTIONS.channelId,
      private: true,
      libId: LIB_ID,
    });
  });

  it('should pass default options', () => {
    const transmitter = new Transmitter();

    expect(transmitter).toBeDefined();
    expect(senderFactory.mock.calls[0][0].coordinatorHost).toBe(DEFAULT_OPTIONS.coordinatorHost);
    expect(senderFactory.mock.calls[0][0].host).toBe(DEFAULT_OPTIONS.host);
  });
});
