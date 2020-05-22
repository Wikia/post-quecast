import { isEventOfType, PostQuecastEvent } from './post-quecast-event';

describe('PostQuecastEvent', () => {
  it('should isEventOfType work', () => {
    const events: PostQuecastEvent[] = [
      { data: { action: { type: '1' } } },
      { data: { action: { type: '2' } } },
      { data: { action: { type: '1' } } },
    ] as any;

    expect(events.map((event) => isEventOfType(event, '1'))).toEqual([true, false, true]);
  });
});
