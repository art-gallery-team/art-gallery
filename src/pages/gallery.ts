import { fetchLots } from '../api/lotsApi';
import { openArtworkModal } from '../components/artworkModal';
import { createElement } from '../utils/dom';
import { debounce } from '../utils/debounce';
import type { Lot } from '../types';
import './gallery.css';

export async function renderGalleryPage(
  container: HTMLElement,
  onNavigate: (path: string) => void
): Promise<void> {
  container.replaceChildren();

  const page = createElement('section', 'gallery-page');
  const header = createElement('header', 'gallery-page__header');
  const title = createElement('h1', 'gallery-page__title', 'Art Gallery');
  const subtitle = createElement(
    'p',
    'gallery-page__subtitle',
    'Permanent & current exhibition collection. Explore artworks in detail.'
  );

  const auctionCta = createElement('button', 'gallery-page__cta', 'Enter Auction Hall →');
  auctionCta.type = 'button';
  auctionCta.addEventListener('click', () => onNavigate('/auction'));

  header.append(title, subtitle, auctionCta);

  const controls = createElement('div', 'gallery-controls');

  const searchInput = createElement('input', 'gallery-controls__search');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search by title or author...';
  searchInput.setAttribute('aria-label', 'Search by artwork title or artist');

  const styleSelect = createElement('select', 'gallery-controls__select');
  styleSelect.setAttribute('aria-label', 'Filter by style');

  const defaultOption = createElement('option', '', 'All Styles');
  defaultOption.value = 'all';
  styleSelect.appendChild(defaultOption);

  controls.append(searchInput, styleSelect);

  const contentArea = createElement('div', 'gallery-content');
  contentArea.appendChild(createElement('div', 'gallery-state', 'Loading exhibition...'));

  page.append(header, controls, contentArea);
  container.appendChild(page);

  let allLots: Lot[] = [];
  let searchQuery = '';
  let selectedStyle = 'all';

  const renderCards = () => {
    contentArea.replaceChildren();

    const filtered = allLots.filter((lot) => {
      const matchesStyle = selectedStyle === 'all' || lot.style === selectedStyle;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        lot.title.toLowerCase().includes(query) ||
        lot.author.toLowerCase().includes(query);
      return matchesStyle && matchesQuery;
    });

    if (filtered.length === 0) {
      contentArea.appendChild(
        createElement('div', 'gallery-state', 'No artworks match your filter criteria.')
      );
      return;
    }

    const grid = createElement('div', 'gallery-grid');

    filtered.forEach((lot) => {
      const card = createElement('article', 'gallery-card');

      const imageWrap = createElement('div', 'gallery-card__image-wrap');

      const showPlaceholder = (): void => {
        const placeholder = createElement('div', 'gallery-card__placeholder', 'Artwork');
        imageWrap.prepend(placeholder);
      };

      if (lot.imageUrl) {
        const img = createElement('img', 'gallery-card__image');
        img.src = lot.imageUrl;
        img.alt = lot.title;
        img.loading = 'lazy';
        img.onerror = () => {
          img.onerror = null;
          img.remove();
          showPlaceholder();
        };
        imageWrap.appendChild(img);
      } else {
        showPlaceholder();
      }

      const badgeParts = [lot.year, lot.style].filter(Boolean);
      if (badgeParts.length > 0) {
        const badge = createElement('span', 'gallery-card__badge', badgeParts.join(' • '));
        imageWrap.appendChild(badge);
      }

      const body = createElement('div', 'gallery-card__body');
      const cardTitle = createElement('h2', 'gallery-card__title', lot.title);
      const cardAuthor = createElement('p', 'gallery-card__author', lot.author);

      const detailsBtn = createElement('button', 'gallery-card__btn', 'View Details');
      detailsBtn.type = 'button';
      detailsBtn.addEventListener('click', () => {
        openArtworkModal(lot, () => onNavigate('/auction'));
      });

      body.append(cardTitle, cardAuthor, detailsBtn);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });

    contentArea.appendChild(grid);
  };

  const handleSearch = debounce(() => {
    searchQuery = searchInput.value;
    renderCards();
  }, 250);

  searchInput.addEventListener('input', () => {
    handleSearch();
  });

  styleSelect.addEventListener('change', () => {
    selectedStyle = styleSelect.value;
    renderCards();
  });

  try {
    allLots = await fetchLots();

    const styles = Array.from(
      new Set(allLots.map((lot) => lot.style).filter((s): s is string => Boolean(s)))
    ).sort();

    styles.forEach((style) => {
      const opt = createElement('option', '', style);
      opt.value = style;
      styleSelect.appendChild(opt);
    });

    renderCards();
  } catch {
    contentArea.replaceChildren(
      createElement(
        'div',
        'gallery-state',
        'Failed to load gallery artworks. Please try again later.'
      )
    );
  }
}
