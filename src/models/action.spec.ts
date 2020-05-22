import { isActionOfType } from './action';

describe('Action', () => {
  it('should isActionOfType work', () => {
    const actions = [{ type: '1' }, { type: '2' }, { type: '1' }];

    expect(actions.map((event) => isActionOfType(event, '1'))).toEqual([true, false, true]);
  });
});
