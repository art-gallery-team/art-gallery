import type { BidStatus } from '../types';

export function getUserBidStatus(currentLotPrice: number, userMaxBid: number | null): BidStatus {
  if (userMaxBid === null || userMaxBid === 0) return 'none';
  return currentLotPrice <= userMaxBid ? 'leading' : 'outbid';
}
