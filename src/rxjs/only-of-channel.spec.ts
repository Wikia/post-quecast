import { TestScheduler } from 'rxjs/testing';
import { onlyOfChannel } from './only-of-channel';

describe('RxJs - onlyOfChannel', () => {
  let scheduler: TestScheduler;
  const dateSpy = jest.spyOn(Date, 'now');

  beforeEach(() => {
    dateSpy.mockClear();
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should filter by channel id', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-', {
        a: { data: { channelId: '1' } },
        b: { data: { channelId: '2' } },
        c: { data: { channelId: '1' } },
      });

      dateSpy.mockReturnValue(11);

      expectObservable(stream$.pipe(onlyOfChannel('1'))).toBe('-a---c-', {
        a: { data: { channelId: '1' } },
        c: { data: { channelId: '1' } },
      });

      dateSpy.mockReturnValue(21);

      expectObservable(stream$.pipe(onlyOfChannel('2'))).toBe('---b---', {
        b: { data: { channelId: '2' } },
      });
    });
  });
});
