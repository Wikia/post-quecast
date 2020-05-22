import { CallbackConnector } from '../connectors/connectors';
import { LIB_ID } from '../models/constants';
import { Host } from '../models/host';
import { createHostStub } from '../models/host.stub';
import { Coordinator } from './coordinator';
import { setupPostQuecast } from './setup';

jest.mock('./coordinator');

describe('setupPostQuecast', () => {
  const coordinatorMock: jest.Mock = Coordinator as any;

  beforeEach(() => {
    coordinatorMock.mockClear();
  });

  it('should work on default host', () => {
    setupPostQuecast();
    expect(Coordinator).toHaveBeenCalledTimes(1);
    expect((window as Host)[LIB_ID] instanceof Coordinator);
    expect((window as Host)[LIB_ID].callbackConnector instanceof CallbackConnector);
  });

  it('should work on custom host', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);
    expect(Coordinator).toHaveBeenCalledTimes(1);
    expect(hostStub[LIB_ID] instanceof Coordinator);
    expect(hostStub[LIB_ID].callbackConnector instanceof CallbackConnector);
  });

  it('should work for two different hosts', () => {
    const host1 = createHostStub();
    const host2 = createHostStub();

    setupPostQuecast(host1);
    setupPostQuecast(host2);
    expect(Coordinator).toHaveBeenCalledTimes(2);
    expect(host1[LIB_ID] instanceof Coordinator);
    expect(host1[LIB_ID].callbackConnector instanceof CallbackConnector);
    expect(host2[LIB_ID] instanceof Coordinator);
    expect(host2[LIB_ID].callbackConnector instanceof CallbackConnector);
  });

  it('should be idempotent', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);
    setupPostQuecast(hostStub);

    expect(Coordinator).toHaveBeenCalledTimes(1);
  });
});
