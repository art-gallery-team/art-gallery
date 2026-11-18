import type { Lot } from '../types';

export function filterLots(
  lots: Lot[],
  searchQuery: string = '',
  style: string | null = null,
  minPrice: number | null = null,
  maxPrice: number | null = null
): Lot[] {
  const query = searchQuery.toLowerCase().trim();

  return lots.filter((lot) => {
    const matchesQuery =
      lot.title.toLowerCase().includes(query) || lot.author.toLowerCase().includes(query);

    const matchesStyle = !style || style === 'all' || lot.style === style;

    const matchesMinPrice = minPrice === null || lot.price >= minPrice;
    const matchesMaxPrice = maxPrice === null || lot.price <= maxPrice;

    return matchesQuery && matchesStyle && matchesMinPrice && matchesMaxPrice;
  });
}
