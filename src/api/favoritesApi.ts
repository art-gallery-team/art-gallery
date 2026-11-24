import { supabase } from './supabaseClient';
import type { Lot } from '../types';

interface FavoriteRow {
  lot_id: string;
}

const PG_UNIQUE_VIOLATION = '23505';

export async function fetchUserFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('lot_id').eq('user_id', userId);

  if (error) {
    throw new Error(`Error loading favorites: ${error.message}`);
  }

  return (data as FavoriteRow[] | null)?.map((item) => item.lot_id) ?? [];
}

export async function addFavorite(userId: string, lotId: string): Promise<void> {
  const { error } = await supabase.from('favorites').insert({ user_id: userId, lot_id: lotId });

  if (error && error.code !== PG_UNIQUE_VIOLATION) {
    throw new Error(`Error while adding to favorites: ${error.message}`);
  }
}

export async function removeFavorite(userId: string, lotId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('lot_id', lotId);

  if (error) {
    throw new Error(`Error while removing from favorites: ${error.message}`);
  }
}

export async function toggleFavorite(
  userId: string,
  lotId: string,
  currentlyFavorite: boolean
): Promise<boolean> {
  if (currentlyFavorite) {
    await removeFavorite(userId, lotId);
    return false;
  }

  await addFavorite(userId, lotId);
  return true;
}

export async function getFavoriteLots(userId: string): Promise<Lot[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, lots(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row) => {
    const rawLot = Array.isArray(row.lots) ? row.lots[0] : row.lots;
    return {
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
    };
  });
}
