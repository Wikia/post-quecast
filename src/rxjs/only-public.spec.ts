import { TestScheduler } from 'rxjs/testing';
import { PostMessageEvent } from '../models/post-message-event';
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
      const stream$ = cold<PostMessageEvent>('-a-b-c-', {
        a: { data: { private: true } } as any,
        b: { data: {} } as any,
        c: { data: { private: false } } as any,
      });

      expectObservable(stream$.pipe(onlyPublic())).toBe('---b-c-', {
        b: { data: {} },
        c: { data: { private: false } },
      });
    });
  });
});
