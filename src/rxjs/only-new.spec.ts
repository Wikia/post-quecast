import { TestScheduler } from 'rxjs/testing';
import { onlyNew } from './only-new';

describe('RxJs - onlyNew', () => {
  let scheduler: TestScheduler;
  const dateSpy = jest.spyOn(Date, 'now');

  beforeEach(() => {
    dateSpy.mockClear();
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by date', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { timestamp: 20 },
        b: { timestamp: 10 },
        c: { timestamp: 30 },
      });

      dateSpy.mockReturnValue(11);

      expectObservable(stream$.pipe(onlyNew())).toBe('-a---c-', {
        a: { timestamp: 20 },
        c: { timestamp: 30 },
      });

      dateSpy.mockReturnValue(21);

      expectObservable(stream$.pipe(onlyNew())).toBe('-----c-', {
        c: { timestamp: 30 },
      });
    });
  });
});
