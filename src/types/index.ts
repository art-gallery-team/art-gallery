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

export interface Bid {
  id: string;
  lot_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  lots?: Lot;
}
