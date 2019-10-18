import { TestScheduler } from 'rxjs/testing';
import { mapAction } from './map-action';

describe('RxJs - mapAction', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should map event to action', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { action: { type: '1' } } },
        b: { data: { action: { type: '2' } } },
        c: { data: { action: { type: '1', foo: 'bar' } } },
      });

      expectObservable(stream$.pipe(mapAction())).toBe('-a-b-c-', {
        a: { type: '1' },
        b: { type: '2' },
        c: { type: '1', foo: 'bar' },
      });
    });
  });
});
