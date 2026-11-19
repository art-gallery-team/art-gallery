import { fetchLots } from '../api/lotsApi';
import { createLotCard } from '../components/lotCard';
import { createElement } from '../utils/dom';

export async function renderAuctionHall(container: HTMLElement): Promise<void> {
  container.replaceChildren();
  const loader = createElement('div', 'loader', 'Loading masterpieces...');
  container.append(loader);

  try {
    const lots = await fetchLots();

    container.replaceChildren();

    const title = createElement('h1', 'page-title', 'Auction Hall');

    const grid = createElement('div', 'lots-grid');

    lots.forEach((lot) => {
      grid.append(createLotCard(lot));
    });

    container.append(title, grid);
  } catch (error) {
    container.replaceChildren();
    const errorMsg = createElement(
      'div',
      'error-message',
      'Failed to load lots. Please try again later.'
    );
    container.append(errorMsg);
    console.error(error);
  }
}
