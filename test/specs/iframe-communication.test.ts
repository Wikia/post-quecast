import { site } from 'pages/site';

describe('IFrame Communication', () => {
  it('should work between all pages', () => {
    site.bootstrap();
    site.main.setupPostQuecast();

    site.main.createCommunicator({ name: 'A' });
    site.main.createCommunicator({ name: 'B', channelId: 'other' });
    site.iframeFull.createCommunicator({ name: 'A' });
    site.iframeFull.createCommunicator({ name: 'B', channelId: 'other' });
    site.iframeLite.createTransmitter({ name: 'A' });

    site.iframeLite.transmitter('A').dispatch('1');
    site.iframeFull.communicator('A').dispatch('1');
    site.main.communicator('A').dispatch('1');
    site.main.communicator('B').dispatch('1');
    site.iframeFull.communicator('B').dispatch('1');

    expect(site.main.communicator('A').results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'main-communicator-A', type: '1', sync: 'true', reference: 'true' },
    ]);
    expect(site.iframeFull.communicator('A').results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: 'false', reference: 'false' },
      { source: 'main-communicator-A', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.main.communicator('B').results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-B', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('B').results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-B', type: '1', sync: 'false', reference: 'false' },
    ]);
  });
});
