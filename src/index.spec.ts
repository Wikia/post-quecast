import * as index from './index';

describe('Index', () => {
  it('should export specific number of elements', () => {
    const count = Object.keys(index).length;

    expect(count).toBe(5);
  });
});
