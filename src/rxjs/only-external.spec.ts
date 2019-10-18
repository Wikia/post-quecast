import { TestScheduler } from 'rxjs/testing';
import { INTERNAL_TYPES } from '../models/constants';
import { onlyExternal } from './only-external';

describe('RxJs - onlyExternal', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should cover all internal types', () => {
    expect(Object.keys(INTERNAL_TYPES).length).toBe(2);
  });

  it('should filter out internal types', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { action: { type: 'message' } } },
        b: { data: { action: { type: INTERNAL_TYPES.connect } } },
        c: { data: { action: { type: INTERNAL_TYPES.connected } } },
      });

      expectObservable(stream$.pipe(onlyExternal())).toBe('-a-----', {
        a: { data: { action: { type: 'message' } } },
      });
    });
  });
});
