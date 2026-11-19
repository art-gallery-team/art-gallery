import { describe, expect, it } from 'vitest';
import { getUserBidStatus } from './getUserBidStatus';

describe('getUserBidStatus', () => {
  it('should return "leading" if user bid is equal or higher than current price', () => {
    expect(getUserBidStatus(1000, 1000)).toBe('leading');
  });

  it('should return "outbid" if the current price exceeds the user bid', () => {
    expect(getUserBidStatus(1200, 1000)).toBe('outbid');
  });

  it('should return "none" if user bid is null or 0', () => {
    expect(getUserBidStatus(1000, null)).toBe('none');
    expect(getUserBidStatus(1000, 0)).toBe('none');
  });
});
