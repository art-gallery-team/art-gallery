export type BidStatus = 'leading' | 'outbid' | 'none';

export interface Lot {
  id: string;
  title: string;
  author: string;
  style: string;
  year: number;
  description: string;
  imageUrl: string;
  startPrice: number;
  currentPrice: number;
  minStep: number;
  status: 'active' | 'sold' | 'closed';
  highestBidderId?: string | null;
}
