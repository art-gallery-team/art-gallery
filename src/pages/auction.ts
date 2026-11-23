import { fetchLots } from '../api/lotsApi';
import { subscribeToAuctionUpdates } from '../api/realtimeApi';
import { createLotCard } from '../components/lotCard';
import { createElement } from '../utils/dom';
import { filterLots } from '../core/filterLots';
import { debounce } from '../utils/debounce';

let unsubscribeAuctionRealtime: (() => void) | null = null;

export async function renderAuctionHall(container: HTMLElement): Promise<void> {
  if (unsubscribeAuctionRealtime) {
    unsubscribeAuctionRealtime();
    unsubscribeAuctionRealtime = null;
  }

  container.replaceChildren();
  const loader = createElement('div', 'loader', 'Loading masterpieces...');
  container.append(loader);

  try {
    let allLots = await fetchLots();
    container.replaceChildren();

    const title = createElement('h1', 'page-title', 'Auction Hall');
    const controls = createElement('div', 'auction-controls');

    const searchInput = createElement('input', 'auction-controls__search');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by title or author...';

    const styleSelect = createElement('select', 'auction-controls__select');
    const defaultOption = createElement('option', '', 'All Styles');
    defaultOption.value = 'all';

    const styles = Array.from(new Set(allLots.map((lot) => lot.style)));
    styleSelect.append(defaultOption);
    styles.forEach((style) => {
      const opt = createElement('option', '', style);
      opt.value = style;
      styleSelect.append(opt);
    });

    const sortSelect = createElement('select', 'auction-controls__select');

    const sortDefault = createElement('option', '', 'Default (Active first)');
    sortDefault.value = 'default';

    const sortPriceDesc = createElement('option', '', 'Price: High to Low');
    sortPriceDesc.value = 'price-desc';

    const sortPriceAsc = createElement('option', '', 'Price: Low to High');
    sortPriceAsc.value = 'price-asc';

    sortSelect.append(sortDefault, sortPriceDesc, sortPriceAsc);

    controls.append(searchInput, styleSelect, sortSelect);
    const grid = createElement('div', 'lots-grid');

    const refreshLotsSilently = async (): Promise<void> => {
      try {
        allLots = await fetchLots();
        updateGrid();
      } catch (err) {
        console.error('Failed to refresh lots in realtime:', err);
      }
    };

    const updateGrid = (): void => {
      const query = searchInput.value;
      const selectedStyle = styleSelect.value;
      const sortBy = sortSelect.value;

      let result = filterLots(allLots, query, selectedStyle, null, null);

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
        grid.append(createElement('p', 'empty-message', 'No lots found matching your criteria.'));
        return;
      }

      result.forEach((lot) => {
        grid.append(createLotCard(lot, refreshLotsSilently));
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
    container.append(
      createElement('div', 'error-message', 'Failed to load lots. Please try again later.')
    );
    console.error(error);
  }
}
