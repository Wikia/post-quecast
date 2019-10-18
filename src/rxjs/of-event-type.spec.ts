import { TestScheduler } from 'rxjs/testing';
import { ofEventType } from './of-event-type';

describe('RxJs - ofEventType', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by event type', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { action: { type: '1' } } },
        b: { data: { action: { type: '2' } } },
        c: { data: { action: { type: '1' } } },
      });

      expectObservable(stream$.pipe(ofEventType('1'))).toBe('-a---c-', {
        a: { data: { action: { type: '1' } } },
        c: { data: { action: { type: '1' } } },
      });
    });
  });
});
