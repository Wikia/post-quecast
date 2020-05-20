import { site } from 'pages/site';

describe('Two Mains', () => {
  it('should work when immediately dispatching', () => {
    site.bootstrap();
    site.main1.setupPostQuecast();

    const main1ComA = site.main1.createCommunicator({ name: 'A' });

    main1ComA.dispatch('1');

    site.main2.setupPostQuecast();

    const main2ComA = site.main2.createCommunicator({ name: 'A' });

    expect(main1ComA.results).toEqual([
      { source: 'main-1-communicator-A', type: '1', sync: 'true', reference: 'true' },
    ]);
    expect(main2ComA.results).toEqual([
      { source: 'main-1-communicator-A', type: '1', sync: '-', reference: 'true' },
    ]);

    main1ComA.clearResults();
    main2ComA.clearResults();

    main2ComA.dispatch('1');

    expect(main1ComA.results).toEqual([
      { source: 'main-2-communicator-A', type: '1', sync: '-', reference: 'true' },
    ]);
    expect(main2ComA.results).toEqual([
      { source: 'main-2-communicator-A', type: '1', sync: 'true', reference: 'true' },
    ]);
  });

  it('should work when first setting both', () => {
    site.bootstrap();
    site.main1.setupPostQuecast();
    site.main2.setupPostQuecast();

    const main2ComA = site.main2.createCommunicator({ name: 'A' });
    const main1ComA = site.main1.createCommunicator({ name: 'A' });

    main1ComA.dispatch('1');
    main2ComA.dispatch('1');

    expect(main1ComA.results).toEqual([
      { source: 'main-1-communicator-A', type: '1', sync: 'true', reference: 'true' },
      { source: 'main-2-communicator-A', type: '1', sync: '-', reference: 'true' },
    ]);
    expect(main2ComA.results).toEqual([
      { source: 'main-1-communicator-A', type: '1', sync: '-', reference: 'true' },
      { source: 'main-2-communicator-A', type: '1', sync: 'true', reference: 'true' },
    ]);
  });
});
