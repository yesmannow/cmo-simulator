import { calculateAdstock } from '../adstock/calculateAdstock';

describe('calculateAdstock', () => {
  it('should calculate adstock correctly', () => {
    expect(calculateAdstock(100, 50, 0.5)).toBe(125); // 100 + 0.5 * 50
    expect(calculateAdstock(200, 0, 0.8)).toBe(200);  // 200 + 0.8 * 0
    expect(calculateAdstock(0, 100, 0.9)).toBe(90);   // 0 + 0.9 * 100
  });
});
