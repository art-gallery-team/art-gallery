import { supabase } from './supabaseClient';

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
