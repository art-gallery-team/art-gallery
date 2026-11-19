export function validateNewBid(
  currentBid: number,
  newBid: number,
  minStep: number,
  lotStatus: 'active' | 'sold' | 'closed',
  userMaxBid: number | null = null
): boolean {
  if (lotStatus !== 'active') {
    throw new Error('Lot is not active');
  }
  if (!Number.isFinite(newBid) || newBid <= 0) {
    throw new Error('Bid must be a positive number');
  }
  if (userMaxBid !== null && userMaxBid >= currentBid) {
    throw new Error('You are already the leading bidder');
  }
  if (newBid < currentBid + minStep) {
    throw new Error(`Bid must be higher than the current price by at least ${minStep}`);
  }

  return true;
}
