import { TestScheduler } from 'rxjs/testing';
import { onlyPrivate } from './only-private';

describe('RxJs - onlyPrivate', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by private', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { private: true } },
        b: { data: {} },
        c: { data: { private: false } },
      });

      expectObservable(stream$.pipe(onlyPrivate())).toBe('-a-----', {
        a: { data: { private: true } },
      });
    });
  });
});
