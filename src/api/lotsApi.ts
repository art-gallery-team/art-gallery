import { supabase } from './supabaseClient';
import type { Lot } from '../types';

interface DbLot {
  id: string;
  title: string;
  author: string;
  style: string;
  year: number;
  description: string;
  image_url: string;
  modal_images?: string[] | null;
  start_price: number;
  current_price: number;
  min_step: number;
  status: 'active' | 'sold';
  highest_bidder_id: string | null;
  created_at: string;
}

export async function fetchLots(): Promise<Lot[]> {
  const { data, error } = await supabase
    .from('lots')
    .select('*')
    .order('current_price', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const dbLots = (data || []) as DbLot[];

  return dbLots.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    style: row.style,
    year: row.year,
    description: row.description,
    imageUrl: row.image_url,
    modalImages: row.modal_images ?? [],
    startPrice: row.start_price,
    currentPrice: row.current_price,
    minStep: row.min_step,
    status: row.status,
    highestBidderId: row.highest_bidder_id,
  }));
}
