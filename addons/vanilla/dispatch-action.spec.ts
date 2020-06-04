import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { transformIntoHostStub } from '../../src/models/host.stub';
import { dispatchAction } from './dispatch-action';

describe('dispatchAction', () => {
  const dateMock = jest.spyOn(Date, 'now');
  let communicatorDefault: Communicator;
  let communicatorOther: Communicator;

  beforeEach(() => {
    dateMock.mockReturnValue(10);
    transformIntoHostStub(window);
    setupPostQuecast();
    communicatorDefault = new Communicator();
    communicatorOther = new Communicator({ channelId: 'other channel' });
  });

  it('should receive dispatched message', () => {
    const resultsDefault: Action = [];
    const resultsOther: Action = [];

    communicatorDefault.addListener((a) => resultsDefault.push(a));
    communicatorOther.addListener((a) => resultsOther.push(a));

    dispatchAction({ type: 'action A' });
    dispatchAction({ type: 'action B', payload: 'some data' });
    dispatchAction({ type: 'action C' }, 'other channel');

    expect(resultsDefault).toEqual([
      { type: 'action A', timestamp: 10 },
      { type: 'action B', payload: 'some data', timestamp: 10 },
    ]);
    expect(resultsOther).toEqual([{ type: 'action C', timestamp: 10 }]);
  });
});
