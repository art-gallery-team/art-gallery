import { supabase } from './supabaseClient';
import type { Lot } from '../types';

export async function fetchLots(): Promise<Lot[]> {
  const { data, error } = await supabase
    .from('lots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    style: row.style,
    year: row.year,
    description: row.description,
    imageUrl: row.image_url,
    startPrice: row.start_price,
    currentPrice: row.current_price,
    minStep: row.min_step,
    status: row.status,
    highestBidderId: row.highest_bidder_id,
  }));
}
