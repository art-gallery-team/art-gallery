import { supabase } from './supabaseClient';
import type { Purchase, Lot } from '../types';

export async function purchaseLot(
  lotId: string,
  userId: string,
  finalPrice: number,
  promoCode: string = ''
): Promise<void> {
  const { error: purchaseError } = await supabase.from('purchases').insert([
    {
      lot_id: lotId,
      user_id: userId,
      final_price: finalPrice,
      promo_used: promoCode.trim().toUpperCase() || null,
    },
  ]);

  if (purchaseError) throw new Error(purchaseError.message);

  const { error: lotError } = await supabase
    .from('lots')
    .update({ status: 'sold' })
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

interface DbPurchase {
  id: string;
  lot_id: string;
  user_id: string;
  final_price: number;
  promo_used: string | null;
  purchased_at: string;
  lots: DbLot | DbLot[] | null;
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*, lots(*)')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rawPurchases = (data || []) as DbPurchase[];

  return rawPurchases.map((row) => {
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
      final_price: row.final_price,
      promo_used: row.promo_used,
      purchased_at: row.purchased_at,
      lots: mappedLot,
    };
  });
}
