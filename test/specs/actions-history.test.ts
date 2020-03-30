import { site } from 'pages/site';

describe('Actions History', () => {
  it('should keep history of messages', () => {
    site.bootstrap();
    site.main.setupPostQuecast();

    const mainComA = site.main.createCommunicator({ name: 'A' });
    const fullComA = site.iframeFull.createCommunicator({ name: 'A' });
    const liteTranA = site.iframeLite.createTransmitter({ name: 'A' });

    mainComA.dispatch('1');
    fullComA.dispatch('1');
    liteTranA.dispatch('1');

    expect(mainComA.results).toEqual([
      { source: 'main-communicator-A', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(fullComA.results).toEqual([
      { source: 'main-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: 'false', reference: 'false' },
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
    ]);

    mainComA.clearResults();
    fullComA.clearResults();

    const mainComB = site.main.createCommunicator({ name: 'B' });
    const fullComB = site.iframeFull.createCommunicator({ name: 'B' });
    const liteTranB = site.iframeLite.createTransmitter({ name: 'B' });

    expect(mainComB.results).toEqual([
      { source: 'main-communicator-A', type: '1', sync: '-', reference: 'true' },
      { source: 'iframe-full-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(fullComB.results).toEqual([
      { source: 'main-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-A', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-A', type: '1', sync: '-', reference: 'false' },
    ]);

    mainComB.clearResults();
    fullComB.clearResults();

    mainComB.dispatch('1');
    fullComB.dispatch('1');
    liteTranB.dispatch('1');

    expect(mainComA.results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: '-', reference: 'true' },
      { source: 'iframe-full-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-B', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(mainComB.results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: 'true', reference: 'true' },
      { source: 'iframe-full-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-B', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(fullComA.results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-lite-transmitter-B', type: '1', sync: '-', reference: 'false' },
    ]);
    expect(fullComB.results).toEqual([
      { source: 'main-communicator-B', type: '1', sync: '-', reference: 'false' },
      { source: 'iframe-full-communicator-B', type: '1', sync: 'false', reference: 'false' },
      { source: 'iframe-lite-transmitter-B', type: '1', sync: '-', reference: 'false' },
    ]);

    mainComA.clearResults();
    fullComA.clearResults();
    mainComB.clearResults();
    fullComB.clearResults();

    const mainComOnlyNew = site.main.createCommunicator({ name: 'C', onlyNew: true });
    const fullComOnlyNew = site.iframeFull.createCommunicator({ name: 'C', onlyNew: true });

    expect(mainComOnlyNew.results).toEqual([]);
    expect(fullComOnlyNew.results).toEqual([]);

    liteTranA.dispatch('2');

    expect(mainComA.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(fullComA.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(mainComB.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(fullComB.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(mainComOnlyNew.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
    expect(fullComOnlyNew.results).toEqual([
      { source: 'iframe-lite-transmitter-A', type: '2', sync: '-', reference: 'false' },
    ]);
  });
});