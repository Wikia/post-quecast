import { TestScheduler } from 'rxjs/testing';
import { isPostMessageEvent } from '../models/post-message-event';
import { onlyValidMessages } from './only-valid-messages';

jest.mock('../models/post-message-event');

describe('RxJs - onlyValidMessages', () => {
  const isPostMessageEventMock: jest.Mock = isPostMessageEvent as any;
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should delegate check to isPostMessageEvent method (true)', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-');

      isPostMessageEventMock.mockReturnValue(true);
      expectObservable(stream$.pipe(onlyValidMessages())).toBe('-a-b-c-');
    });
  });

  it('should delegate check to isPostMessageEvent method (false)', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const stream$ = cold('-a-b-c-');

      isPostMessageEventMock.mockReturnValue(false);
      expectObservable(stream$.pipe(onlyValidMessages())).toBe('-------');
    });
  });
});
