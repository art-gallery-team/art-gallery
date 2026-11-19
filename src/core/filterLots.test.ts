import { describe, expect, it } from 'vitest';
import { filterLots } from './filterLots';
import type { Lot } from '../types';

const mockLots: Lot[] = [
  {
    id: '1',
    title: 'Sunset',
    author: 'Monet',
    style: 'Impressionism',
    year: 1872,
    description: '',
    imageUrl: '',
    startPrice: 500,
    currentPrice: 1000,
    minStep: 100,
    status: 'active',
  },
  {
    id: '2',
    title: 'Starry Night',
    author: 'Van Gogh',
    style: 'Post-Impressionism',
    year: 1889,
    description: '',
    imageUrl: '',
    startPrice: 2500,
    currentPrice: 5000,
    minStep: 500,
    status: 'active',
  },
];

describe('filterLots', () => {
  it('should return all lots if filters are empty, null, or "all"', () => {
    expect(filterLots(mockLots, '', 'all', null, null)).toHaveLength(2);
  });

  it('should filter by search query (case-insensitive)', () => {
    expect(filterLots(mockLots, 'monet', 'all', null, null)).toHaveLength(1);
  });

  it('should filter by min price only', () => {
    expect(filterLots(mockLots, '', 'all', 2000, null)).toEqual([mockLots[1]]);
  });

  it('should filter by max price only', () => {
    expect(filterLots(mockLots, '', 'all', null, 2000)).toEqual([mockLots[0]]);
  });
});
