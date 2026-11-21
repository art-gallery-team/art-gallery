import { supabase } from './supabaseClient';

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
