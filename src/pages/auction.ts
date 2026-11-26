import { fetchLots } from '../api/lotsApi';
import { fetchUserFavoriteIds } from '../api/favoritesApi';
import { subscribeToAuctionUpdates } from '../api/realtimeApi';
import { createLotCard } from '../components/lotCard';
import { createElement } from '../utils/dom';
import { filterLots } from '../core/filterLots';
import { debounce } from '../utils/debounce';
import { t } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';
import type { User } from '@supabase/supabase-js';
import { getCurrentUser } from '../api/authApi';

let unsubscribeAuctionRealtime: (() => void) | null = null;

export async function renderAuctionHall(container: HTMLElement, user: User | null): Promise<void> {
  if (unsubscribeAuctionRealtime) {
    unsubscribeAuctionRealtime();
    unsubscribeAuctionRealtime = null;
  }

  container.replaceChildren();
  const loader = createElement('div', 'loader', t('auction.loading'));
  container.append(loader);

  try {
    let currentUser = user;
    let [allLots, favoriteIds] = await Promise.all([
      fetchLots(),
      currentUser ? fetchUserFavoriteIds(currentUser.id) : Promise.resolve<string[]>([]),
    ]);

    container.replaceChildren();

    const title = createElement('h1', 'page-title', t('auction.title'));
    const controls = createElement('div', 'auction-controls');
    const searchInput = createElement('input', 'auction-controls__search');
    searchInput.type = 'text';
    searchInput.placeholder = t('auction.searchPlaceholder');

    const styleSelect = createElement('select', 'auction-controls__select');
    const defaultOption = createElement('option', '', t('gallery.allStyles'));
    defaultOption.value = 'all';
    styleSelect.append(defaultOption);

    const styleMap = new Map<string, string>();
    allLots.forEach((lot) => {
      if (lot.style && !styleMap.has(lot.style)) {
        styleMap.set(lot.style, getLocalizedLot(lot).style);
      }
    });

    styleMap.forEach((localizedStyle, rawStyle) => {
      const opt = createElement('option', '', localizedStyle);
      opt.value = rawStyle;
      styleSelect.append(opt);
    });

    const sortSelect = createElement('select', 'auction-controls__select');
    const sortDefault = createElement('option', '', t('auction.sortDefault'));
    sortDefault.value = 'default';
    const sortPriceDesc = createElement('option', '', t('auction.sortPriceDesc'));
    sortPriceDesc.value = 'price-desc';
    const sortPriceAsc = createElement('option', '', t('auction.sortPriceAsc'));
    sortPriceAsc.value = 'price-asc';
    sortSelect.append(sortDefault, sortPriceDesc, sortPriceAsc);

    controls.append(searchInput, styleSelect, sortSelect);
    const grid = createElement('div', 'lots-grid');

    const refreshLotsSilently = async (): Promise<void> => {
      try {
        currentUser = await getCurrentUser();
        [allLots, favoriteIds] = await Promise.all([
          fetchLots(),
          currentUser ? fetchUserFavoriteIds(currentUser.id) : Promise.resolve<string[]>([]),
        ]);
        updateGrid();
      } catch (err) {
        console.error('Failed to refresh lots in realtime:', err);
      }
    };

    const updateGrid = (): void => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedStyle = styleSelect.value;
      const sortBy = sortSelect.value;

      let result = filterLots(allLots, '', selectedStyle, null, null);
      if (query) {
        result = result.filter((lot) => {
          const localized = getLocalizedLot(lot);
          return (
            lot.title.toLowerCase().includes(query) ||
            lot.author.toLowerCase().includes(query) ||
            localized.title.toLowerCase().includes(query) ||
            localized.author.toLowerCase().includes(query)
          );
        });
      }

      result = [...result].sort((a, b) => {
        const aIsActive = a.status === 'active';
        const bIsActive = b.status === 'active';
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        if (sortBy === 'price-desc') return b.currentPrice - a.currentPrice;
        if (sortBy === 'price-asc') return a.currentPrice - b.currentPrice;
        return b.currentPrice - a.currentPrice;
      });

      grid.replaceChildren();
      if (result.length === 0) {
        grid.append(createElement('p', 'empty-message', t('auction.empty')));
        return;
      }

      const favoriteSet = new Set(favoriteIds);

      result.forEach((lot) => {
        grid.append(
          createLotCard(
            lot,
            currentUser,
            refreshLotsSilently,
            favoriteSet.has(lot.id),
            refreshLotsSilently
          )
        );
      });
    };

    updateGrid();

    const handleSearch = debounce(updateGrid, 300);
    searchInput.addEventListener('input', handleSearch);
    styleSelect.addEventListener('change', updateGrid);
    sortSelect.addEventListener('change', updateGrid);

    container.append(title, controls, grid);

    unsubscribeAuctionRealtime = subscribeToAuctionUpdates(() => {
      void refreshLotsSilently();
    });
  } catch (error) {
    container.replaceChildren();
    container.append(createElement('div', 'error-message', t('auction.error')));
    console.error(error);
  }
}
