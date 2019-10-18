import { TestScheduler } from 'rxjs/testing';
import { onlyPublic } from './only-public';

describe('RxJs - onlyPublic', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by public', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { private: true } },
        b: { data: {} },
        c: { data: { private: false } },
      });

      expectObservable(stream$.pipe(onlyPublic())).toBe('---b-c-', {
        b: { data: {} },
        c: { data: { private: false } },
      });
    });
  });
});
