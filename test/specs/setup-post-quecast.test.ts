import { site } from 'pages/site';

describe('Setup Post Quecast', () => {
  it('should start working after calling setupPostQuecast', () => {
    site.bootstrap();

    site.main.createTransmitter({ name: 'before' });
    site.main.createCommunicator({ name: 'before' });

    site.main.transmitter('before').dispatch('1');
    site.main.communicator('before').dispatch('1');

    site.main.setupPostQuecast();
    site.main.setupPostQuecast();
    site.main.setupPostQuecast();

    site.main.transmitter('before').dispatch('2');
    site.main.communicator('before').dispatch('2');

    site.main.createTransmitter({ name: 'after' });
    site.main.createCommunicator({ name: 'after' });

    expect(site.main.communicator('before').results).toEqual([]);
    expect(site.main.communicator('after').results).toEqual([
      { source: 'main-transmitter-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-communicator-before', type: '2', sync: '-', reference: 'false' },
    ]);

    site.main.transmitter('after').dispatch('1');
    site.main.communicator('after').dispatch('1');

    expect(site.main.communicator('before').results).toEqual([]);
    expect(site.main.communicator('after').results).toEqual([
      { source: 'main-transmitter-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'main-transmitter-after', type: '1', sync: '-', reference: 'true' },
      { source: 'main-communicator-after', type: '1', sync: 'true', reference: 'true' },
    ]);
  });

  it('calling setupPostQuecast in iframe should have no effect', () => {
    site.bootstrap();
    site.main.setupPostQuecast();

    site.main.createCommunicator({ name: 'before' });
    site.iframeFull.createCommunicator({ name: 'before' });
    site.main.communicator('before').dispatch('1');
    site.iframeFull.communicator('before').dispatch('1');

    expect(site.main.communicator('before').results).toEqual([
      { source: 'main-communicator-before', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-before', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('before').results).toEqual([
      { source: 'main-communicator-before', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '1', sync: 'false', reference: 'false' },
    ]);
    site.main.communicator('before').clearResults();
    site.iframeFull.communicator('before').clearResults();

    site.iframeFull.setupPostQuecast();
    site.iframeFull.setupPostQuecast();

    site.iframeFull.createCommunicator({ name: 'after' });

    expect(site.iframeFull.communicator('after').results).toEqual([
      { source: 'main-communicator-before', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '1', sync: '-', reference: 'false' },
    ]);
    site.iframeFull.communicator('after').clearResults();

    site.main.communicator('before').dispatch('2');
    site.iframeFull.communicator('before').dispatch('2');
    site.iframeFull.communicator('after').dispatch('2');

    expect(site.main.communicator('before').results).toEqual([
      { source: 'main-communicator-before', type: '2', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('before').results).toEqual([
      { source: 'main-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '2', sync: 'false', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(site.iframeFull.communicator('after').results).toEqual([
      { source: 'main-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-before', type: '2', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-after', type: '2', sync: 'false', reference: 'false' },
    ]);
  });
});
