export type BidStatus = 'leading' | 'outbid' | 'none';

export interface Lot {
  id: string;
  title: string;
  author: string;
  style: string;
  price: number;
  status: 'active' | 'sold' | 'closed';
}
