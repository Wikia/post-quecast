import { TestScheduler } from 'rxjs/testing';
import { PostMessageEvent } from '../models/post-message-event';
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
      const stream$ = cold<PostMessageEvent>('-a-b-c-', {
        a: { data: { private: true } } as any,
        b: { data: {} } as any,
        c: { data: { private: false } } as any,
      });

      expectObservable(stream$.pipe(onlyPrivate())).toBe('-a-----', {
        a: { data: { private: true } },
      });
    });
  });
});
