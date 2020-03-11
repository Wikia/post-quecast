import { createHostStub } from '../models/host.stub';
import { isRxMode } from './is-rx-mode';

describe('isRxMode', () => {
  const host1 = createHostStub();
  const host2 = createHostStub();

  it('should return true', () => {
    expect(isRxMode({ host: host1, coordinatorHost: host1 }));
  });

  it('should return false', () => {
    expect(isRxMode({ host: host1, coordinatorHost: host2 }));
  });
});
