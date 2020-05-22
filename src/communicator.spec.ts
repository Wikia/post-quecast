import { Communicator } from './communicator';
import { createHostStub, HostStub } from './models/host.stub';
import { DEFAULT_OPTIONS } from './models/options';
import { Receiver } from './receiver';
import { setupPostQuecast } from './setup/setup';
import { Transmitter } from './transmitter';

jest.mock('./transmitter');
jest.mock('./receiver');

describe('Communicator', () => {
  const transmitterMock: jest.Mock = Transmitter as any;
  const receiverMock: jest.Mock = Receiver as any;

  beforeEach(() => {
    transmitterMock.mockClear();
    receiverMock.mockClear();
  });

  it('should work with default options', () => {
    // tslint:disable-next-line:no-unused-expression
    new Communicator();

    expect(transmitterMock).toHaveBeenCalledTimes(1);
    expect(receiverMock).toHaveBeenCalledTimes(1);
    expect(transmitterMock.mock.calls[0][0]).toEqual(DEFAULT_OPTIONS);
    expect(receiverMock.mock.calls[0][0]).toEqual(DEFAULT_OPTIONS);
  });

  describe('Implementation', () => {
    let communicator: Communicator;
    let host: HostStub;

    beforeEach(() => {
      host = createHostStub();
      setupPostQuecast(host);
      communicator = new Communicator({ host, coordinatorHost: host });
    });

    it('should create transmitter', () => {
      expect(transmitterMock.mock.instances.length).toBe(1);
    });

    it('should create receiver', () => {
      expect(receiverMock.mock.instances.length).toBe(1);
    });

    it('should dispatch through transmitter', () => {
      communicator.dispatch({ type: 'message' });

      expect(transmitterMock.mock.instances[0].dispatch).toHaveBeenCalledTimes(1);
      expect(transmitterMock.mock.instances[0].dispatch.mock.calls[0][0]).toEqual({
        type: 'message',
      });
    });

    it('should listen through receiver', () => {
      const callback = () => ({});

      communicator.addListener(callback);

      expect(receiverMock.mock.instances[0].addListener).toHaveBeenCalledTimes(1);
      expect(receiverMock.mock.instances[0].removeListener).toHaveBeenCalledTimes(0);

      communicator.removeListener(callback);

      expect(receiverMock.mock.instances[0].addListener).toHaveBeenCalledTimes(1);
      expect(receiverMock.mock.instances[0].removeListener).toHaveBeenCalledTimes(1);
    });
  });
});
