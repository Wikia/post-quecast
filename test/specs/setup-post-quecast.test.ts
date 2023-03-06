import { site } from '../pages/site';

describe('Setup Post Quecast', () => {
  it('should start working after calling setupPostQuecast', () => {
    site.bootstrap();

    site.main1.createTransmitter({ name: 'before' });
    site.main1.createCommunicator({ name: 'before' });

    site.main1.transmitter('before').dispatch('1');
    site.main1.communicator('before').dispatch('1');

    site.main1.setupPostQuecast();
    site.main1.setupPostQuecast();
    site.main1.setupPostQuecast();

    site.main1.transmitter('before').dispatch('2');
    site.main1.communicator('before').dispatch('2');

    site.main1.createTransmitter({ name: 'after' });
    site.main1.createCommunicator({ name: 'after' });

    expect(site.main1.communicator('before').results).toEqual([]);
    expect(site.main1.communicator('after').results).toEqual([
      { source: 'main-1-transmitter-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-1-communicator-before', type: '2', sync: '-', reference: 'false' },
    ]);

    site.main1.transmitter('after').dispatch('1');
    site.main1.communicator('after').dispatch('1');

    expect(site.main1.communicator('before').results).toEqual([]);
    expect(site.main1.communicator('after').results).toEqual([
      { source: 'main-1-transmitter-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-1-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-1-transmitter-after', type: '1', sync: '-', reference: 'true' },
      { source: 'main-1-communicator-after', type: '1', sync: 'true', reference: 'true' },
    ]);
  });

  it('calling setupPostQuecast in iframe should have no effect', () => {
    site.bootstrap();
    site.main1.setupPostQuecast();

    site.main1.createCommunicator({ name: 'before' });
    site.iframeFull.createCommunicator({ name: 'before' });
    site.main1.communicator('before').dispatch('1');
    site.iframeFull.communicator('before').dispatch('1');

    expect(site.main1.communicator('before').results).toEqual([
      { source: 'main-1-communicator-before', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-before', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('before').results).toEqual([
      { source: 'main-1-communicator-before', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '1', sync: 'false', reference: 'false' },
    ]);
    site.main1.communicator('before').clearResults();
    site.iframeFull.communicator('before').clearResults();

    site.iframeFull.setupPostQuecast();
    site.iframeFull.setupPostQuecast();

    site.iframeFull.createCommunicator({ name: 'after' });

    expect(site.iframeFull.communicator('after').results).toEqual([
      { source: 'main-1-communicator-before', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '1', sync: '-', reference: 'false' },
    ]);
    site.iframeFull.communicator('after').clearResults();

    site.main1.communicator('before').dispatch('2');
    site.iframeFull.communicator('before').dispatch('2');
    site.iframeFull.communicator('after').dispatch('2');

    expect(site.main1.communicator('before').results).toEqual([
      { source: 'main-1-communicator-before', type: '2', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('before').results).toEqual([
      { source: 'main-1-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '2', sync: 'false', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('after').results).toEqual([
      { source: 'main-1-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: 'false', reference: 'false' },
    ]);
  });
});
