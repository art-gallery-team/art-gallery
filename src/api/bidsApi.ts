import { supabase } from './supabaseClient';
import type { Bid, Lot } from '../types';

export async function placeBid(lotId: string, userId: string, amount: number): Promise<void> {
  const { error: bidError } = await supabase
    .from('bids')
    .insert([{ lot_id: lotId, user_id: userId, amount }]);

  if (bidError) throw new Error(bidError.message);

  const { error: lotError } = await supabase
    .from('lots')
    .update({ current_price: amount, highest_bidder_id: userId })
    .eq('id', lotId);

  if (lotError) throw new Error(lotError.message);
}

interface DbLot {
  id: string;
  title: string;
  author: string;
  style: string;
  year: number;
  description: string;
  image_url: string;
  start_price: number;
  current_price: number;
  min_step: number;
  status: 'active' | 'sold' | 'closed';
  highest_bidder_id: string | null;
}

interface DbBid {
  id: string;
  lot_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  lots: DbLot | DbLot[] | null;
}

export async function getUserBids(userId: string): Promise<Bid[]> {
  const { data, error } = await supabase
    .from('bids')
    .select('*, lots(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rawBids = (data || []) as DbBid[];

  return rawBids.map((row) => {
    const rawLot = Array.isArray(row.lots) ? row.lots[0] : row.lots;

    const mappedLot: Lot | undefined = rawLot
      ? {
          id: rawLot.id,
          title: rawLot.title,
          author: rawLot.author,
          style: rawLot.style,
          year: rawLot.year,
          description: rawLot.description,
          imageUrl: rawLot.image_url,
          startPrice: rawLot.start_price,
          currentPrice: rawLot.current_price,
          minStep: rawLot.min_step,
          status: rawLot.status,
          highestBidderId: rawLot.highest_bidder_id,
        }
      : undefined;

    return {
      id: row.id,
      lot_id: row.lot_id,
      user_id: row.user_id,
      amount: row.amount,
      created_at: row.created_at,
      lots: mappedLot,
    };
  });
}
