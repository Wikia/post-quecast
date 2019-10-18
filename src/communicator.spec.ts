import { Communicator } from './communicator';
import { createHostMock, HostMock } from './models/host.mock';
import { DEFAULT_OPTIONS } from './models/options';
import { Receiver } from './receiver';
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
    let host: HostMock;

    beforeEach(() => {
      host = createHostMock();
      communicator = new Communicator({ host, coordinatorHost: host });
    });

    it('should create transmitter', () => {
      expect(transmitterMock.mock.instances.length).toBe(1);
    });

    it('should create receiver', () => {
      expect(receiverMock.mock.instances.length).toBe(1);
    });

    it('should emit through transmitter', () => {
      communicator.emit({ type: 'message' });

      expect(transmitterMock.mock.instances[0].emit).toHaveBeenCalledTimes(1);
      expect(transmitterMock.mock.instances[0].emit.mock.calls[0][0]).toEqual({ type: 'message' });
    });

    it('should bind actions$', () => {
      expect(communicator.actions$).toBe(receiverMock.mock.instances[0].actions$);
    });
  });
});
