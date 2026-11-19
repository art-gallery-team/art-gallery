import { describe, expect, it } from 'vitest';
import { calculateCheckoutTotal } from './calculateCheckoutTotal';

describe('calculateCheckoutTotal', () => {
  it('should calculate total with a 10% commission', () => {
    expect(calculateCheckoutTotal([1000, 1000], '')).toBe(2200);
  });

  it('should reset commission to zero with VIPART promo code (case-insensitive)', () => {
    expect(calculateCheckoutTotal([1000, 1000], '  vipart  ')).toBe(2000);
  });

  it('should return 0 for an empty array of lots', () => {
    expect(calculateCheckoutTotal([], 'VIPART')).toBe(0);
  });
});
