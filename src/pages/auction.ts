import { fetchLots } from '../api/lotsApi';
import { createLotCard } from '../components/lotCard';
import { createElement } from '../utils/dom';
import { filterLots } from '../core/filterLots';
import { debounce } from '../utils/debounce';
import type { Lot } from '../types';

export async function renderAuctionHall(container: HTMLElement): Promise<void> {
  container.replaceChildren();
  const loader = createElement('div', 'loader', 'Loading masterpieces...');
  container.append(loader);

  try {
    const allLots = await fetchLots();
    allLots.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.currentPrice - a.currentPrice;
    });
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

    controls.append(searchInput, styleSelect);
    const grid = createElement('div', 'lots-grid');

    const updateGrid = (lotsToRender: Lot[]) => {
      grid.replaceChildren();
      if (lotsToRender.length === 0) {
        grid.append(createElement('p', 'empty-message', 'No lots found matching your criteria.'));
        return;
      }
      lotsToRender.forEach((lot) => {
        grid.append(createLotCard(lot, () => renderAuctionHall(container)));
      });
    };

    updateGrid(allLots);

    const handleSearch = debounce(() => {
      const query = searchInput.value;
      const selectedStyle = styleSelect.value;
      const filtered = filterLots(allLots, query, selectedStyle, null, null);
      updateGrid(filtered);
    }, 300);

    searchInput.addEventListener('input', handleSearch);
    styleSelect.addEventListener('change', () => {
      const query = searchInput.value;
      const selectedStyle = styleSelect.value;
      const filtered = filterLots(allLots, query, selectedStyle, null, null);
      updateGrid(filtered);
    });

    container.append(title, controls, grid);
  } catch (error) {
    container.replaceChildren();
    container.append(
      createElement('div', 'error-message', 'Failed to load lots. Please try again later.')
    );
    console.error(error);
  }
}
