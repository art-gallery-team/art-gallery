import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format number to USD string', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});
