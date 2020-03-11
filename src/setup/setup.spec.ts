import { Subject } from 'rxjs';
import { LIB_ID, LIB_SUBJECT } from '../models/constants';
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
    expect((window as any)[LIB_ID] instanceof Coordinator);
    expect((window as any)[LIB_SUBJECT] instanceof Subject);
  });

  it('should work on custom host', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);
    expect(Coordinator).toHaveBeenCalledTimes(1);
    expect(hostStub[LIB_ID] instanceof Coordinator);
    expect(hostStub[LIB_SUBJECT] instanceof Subject);
  });

  it('should work for two different hosts', () => {
    const host1 = createHostStub();
    const host2 = createHostStub();

    setupPostQuecast(host1);
    setupPostQuecast(host2);
    expect(Coordinator).toHaveBeenCalledTimes(2);
    expect(host1[LIB_ID] instanceof Coordinator);
    expect(host1[LIB_SUBJECT] instanceof Subject);
    expect(host2[LIB_ID] instanceof Coordinator);
    expect(host2[LIB_SUBJECT] instanceof Subject);
  });

  it('should be idempotent', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);
    setupPostQuecast(hostStub);

    expect(Coordinator).toHaveBeenCalledTimes(1);
  });
});
