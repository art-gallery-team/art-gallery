import { supabase } from './supabaseClient';

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
