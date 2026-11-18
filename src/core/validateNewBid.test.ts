import { describe, expect, it } from 'vitest';
import { validateNewBid } from './validateNewBid';

describe('validateNewBid', () => {
  it('should return true for a valid bid', () => {
    expect(validateNewBid(1000, 1100, 100, 'active', null)).toBe(true);
  });

  it('should throw an error if the step is less than the minimum', () => {
    expect(() => validateNewBid(1000, 1050, 100, 'active', null)).toThrow(
      'Bid must be higher than the current price by at least 100'
    );
  });

  it('should throw an error if the lot is not active', () => {
    expect(() => validateNewBid(1000, 1100, 100, 'sold', null)).toThrow('Lot is not active');
  });

  it('should throw an error for invalid bid values (<= 0 or NaN)', () => {
    expect(() => validateNewBid(1000, -50, 100, 'active', null)).toThrow(
      'Bid must be a positive number'
    );
    expect(() => validateNewBid(1000, NaN, 100, 'active', null)).toThrow(
      'Bid must be a positive number'
    );
  });

  it('should prevent a user from outbidding themselves', () => {
    expect(() => validateNewBid(1000, 1100, 100, 'active', 1000)).toThrow(
      'You are already the leading bidder'
    );
  });
});
