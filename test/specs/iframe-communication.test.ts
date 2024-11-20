import { site } from '../pages/site';

describe('IFrame Communication', () => {
  it('should work between all pages', () => {
    site.bootstrap();
    site.main1.setupPostQuecast();

    site.main1.createCommunicator({ name: 'A' });
    site.main1.createCommunicator({ name: 'B', channelId: 'other' });
    site.iframeFull.createCommunicator({ name: 'A' });
    site.iframeFull.createCommunicator({ name: 'B', channelId: 'other' });
    site.iframeLite.createTransmitter({ name: 'A' });

    site.iframeLite.transmitter('A').dispatch('1');
    site.iframeFull.communicator('A').dispatch('1');
    site.main1.communicator('A').dispatch('1');
    site.main1.communicator('B').dispatch('1');
    site.iframeFull.communicator('B').dispatch('1');

    expect(site.main1.communicator('A').results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'main-1-communicator-A', type: '1', sync: 'true', reference: 'true' },
    ]);
    expect(site.iframeFull.communicator('A').results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: 'false', reference: 'false' },
      { source: 'main-1-communicator-A', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.main1.communicator('B').results).toEqual([
      { source: 'main-1-communicator-B', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-B', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('B').results).toEqual([
      { source: 'main-1-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-B', type: '1', sync: 'false', reference: 'false' },
    ]);
  });
});
