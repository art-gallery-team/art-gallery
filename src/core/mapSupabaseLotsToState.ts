import type { Lot } from '../types';

export interface SupabaseLotRow {
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
  status: 'active' | 'sold';
  highest_bidder_id: string | null;
  created_at?: string;
}

export interface LotStateItem extends Lot {
  isFavorite: boolean;
  isActive: boolean;
}

export function mapSupabaseLotsToState(
  rows: readonly SupabaseLotRow[],
  favoriteIds: readonly string[] = []
): LotStateItem[] {
  if (!rows.length) {
    return [];
  }

  const favoriteSet = new Set(favoriteIds);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    style: row.style,
    year: row.year,
    description: row.description,
    imageUrl: row.image_url,
    startPrice: Number(row.start_price),
    currentPrice: Number(row.current_price),
    minStep: Number(row.min_step),
    status: row.status,
    highestBidderId: row.highest_bidder_id,
    isFavorite: favoriteSet.has(row.id),
    isActive: row.status === 'active',
  }));
}
