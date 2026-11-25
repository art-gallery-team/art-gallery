import { fetchLots } from '../api/lotsApi';
import { openArtworkModal } from '../components/artworkModal';
import { createElement } from '../utils/dom';
import { debounce } from '../utils/debounce';
import { t } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';
import type { Lot } from '../types';
import './gallery.css';

export async function renderGalleryPage(
  container: HTMLElement,
  onNavigate: (path: string) => void
): Promise<void> {
  container.replaceChildren();

  const page = createElement('section', 'gallery-page');
  const header = createElement('header', 'gallery-page__header');
  const title = createElement('h1', 'gallery-page__title', t('gallery.title'));
  const subtitle = createElement('p', 'gallery-page__subtitle', t('gallery.subtitle'));

  const auctionCta = createElement('button', 'gallery-page__cta', t('gallery.ctaAuction'));
  auctionCta.type = 'button';
  auctionCta.addEventListener('click', () => onNavigate('/auction'));

  header.append(title, subtitle, auctionCta);

  const controls = createElement('div', 'gallery-controls');

  const searchInput = createElement('input', 'gallery-controls__search');
  searchInput.type = 'search';
  searchInput.placeholder = t('gallery.searchPlaceholder');
  searchInput.setAttribute('aria-label', t('gallery.searchPlaceholder'));

  const styleSelect = createElement('select', 'gallery-controls__select');
  styleSelect.setAttribute('aria-label', t('gallery.allStyles'));

  const defaultOption = createElement('option', '', t('gallery.allStyles'));
  defaultOption.value = 'all';
  styleSelect.appendChild(defaultOption);

  controls.append(searchInput, styleSelect);

  const contentArea = createElement('div', 'gallery-content');
  contentArea.appendChild(createElement('div', 'gallery-state', t('gallery.loading')));

  page.append(header, controls, contentArea);
  container.appendChild(page);

  let allLots: Lot[] = [];
  let searchQuery = '';
  let selectedStyle = 'all';

  const renderCards = () => {
    contentArea.replaceChildren();

    const filtered = allLots.filter((lot) => {
      const localized = getLocalizedLot(lot);
      const matchesStyle = selectedStyle === 'all' || lot.style === selectedStyle;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        localized.title.toLowerCase().includes(query) ||
        localized.author.toLowerCase().includes(query) ||
        lot.title.toLowerCase().includes(query) ||
        lot.author.toLowerCase().includes(query);
      return matchesStyle && matchesQuery;
    });

    if (filtered.length === 0) {
      contentArea.appendChild(createElement('div', 'gallery-state', t('gallery.empty')));
      return;
    }

    const grid = createElement('div', 'gallery-grid');

    filtered.forEach((lot) => {
      const localized = getLocalizedLot(lot);
      const card = createElement('article', 'gallery-card');

      const imageWrap = createElement('div', 'gallery-card__image-wrap');

      const showPlaceholder = (): void => {
        const placeholder = createElement('div', 'gallery-card__placeholder', 'Artwork');
        imageWrap.prepend(placeholder);
      };

      if (lot.imageUrl) {
        const img = createElement('img', 'gallery-card__image');
        img.src = lot.imageUrl;
        img.alt = localized.title;
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

      const badgeParts = [lot.year, localized.style].filter(Boolean);
      if (badgeParts.length > 0) {
        const badge = createElement('span', 'gallery-card__badge', badgeParts.join(' • '));
        imageWrap.appendChild(badge);
      }

      const body = createElement('div', 'gallery-card__body');
      const cardTitle = createElement('h2', 'gallery-card__title', localized.title);
      const cardAuthor = createElement('p', 'gallery-card__author', localized.author);

      const detailsBtn = createElement('button', 'gallery-card__btn', t('gallery.viewDetails'));
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

    // Собираем уникальные оригинальные стили и их переведённые названия
    const styleMap = new Map<string, string>();
    allLots.forEach((lot) => {
      if (lot.style && !styleMap.has(lot.style)) {
        styleMap.set(lot.style, getLocalizedLot(lot).style);
      }
    });

    Array.from(styleMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .forEach(([rawStyle, localizedStyle]) => {
        const opt = createElement('option', '', localizedStyle);
        opt.value = rawStyle;
        styleSelect.appendChild(opt);
      });

    renderCards();
  } catch {
    contentArea.replaceChildren(createElement('div', 'gallery-state', t('gallery.error')));
  }
}
