import { TestScheduler } from 'rxjs/testing';
import { ofType } from './of-type';

describe('RxJs - ofType', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by type', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { type: '1' },
        b: { type: '2' },
        c: { type: '1' },
      });

      expectObservable(stream$.pipe(ofType('1'))).toBe('-a---c-', {
        a: { type: '1' },
        c: { type: '1' },
      });
    });
  });
});
