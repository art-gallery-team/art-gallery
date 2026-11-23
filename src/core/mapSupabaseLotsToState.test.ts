import { describe, it, expect } from 'vitest';
import { mapSupabaseLotsToState, type SupabaseLotRow } from './mapSupabaseLotsToState';

const createMockRow = (overrides: Partial<SupabaseLotRow> = {}): SupabaseLotRow => ({
  id: 'lot-1',
  title: 'The Persistence of Memory',
  author: 'Salvador Dalí',
  style: 'Surrealism',
  year: 1931,
  description: 'An iconic surrealist masterpiece featuring soft melting pocket watches.',
  image_url: 'https://unsplash.com',
  start_price: 5000,
  current_price: 5400,
  min_step: 200,
  status: 'active',
  highest_bidder_id: 'user-42',
  ...overrides,
});

describe('mapSupabaseLotsToState', () => {
  it('correctly converts fields from snake_case to camelCase according to the Lot interface', () => {
    const row = createMockRow();
    const result = mapSupabaseLotsToState([row], []);

    expect(result).toEqual([
      {
        id: 'lot-1',
        title: 'The Persistence of Memory',
        author: 'Salvador Dalí',
        style: 'Surrealism',
        year: 1931,
        description: 'An iconic surrealist masterpiece featuring soft melting pocket watches.',
        imageUrl: 'https://unsplash.com',
        startPrice: 5000,
        currentPrice: 5400,
        minStep: 200,
        status: 'active',
        highestBidderId: 'user-42',
        isFavorite: false,
        isActive: true,
      },
    ]);
  });

  it('sets isFavorite to true only for items in favoriteIds', () => {
    const rows = [
      createMockRow({ id: 'lot-1' }),
      createMockRow({ id: 'lot-2' }),
      createMockRow({ id: 'lot-3' }),
    ];

    const result = mapSupabaseLotsToState(rows, ['lot-2']);

    expect(result[0].isFavorite).toBe(false);
    expect(result[1].isFavorite).toBe(true);
    expect(result[2].isFavorite).toBe(false);
  });

  it('calculates isActive as true for status === "active" and false for "sold"', () => {
    const rows = [
      createMockRow({ id: 'lot-active', status: 'active' }),
      createMockRow({ id: 'lot-sold', status: 'sold' }),
    ];

    const result = mapSupabaseLotsToState(rows, []);

    expect(result[0].isActive).toBe(true);
    expect(result[1].isActive).toBe(false);
  });

  it('keeps highestBidderId as null if there have been no bids yet', () => {
    const row = createMockRow({
      start_price: 4100,
      current_price: 4100,
      highest_bidder_id: null,
    });

    const [mapped] = mapSupabaseLotsToState([row], []);

    expect(mapped.highestBidderId).toBeNull();
    expect(mapped.currentPrice).toBe(4100);
  });

  it('returns an empty array when the list of lots is empty', () => {
    expect(mapSupabaseLotsToState([], ['lot-1'])).toEqual([]);
  });
});
