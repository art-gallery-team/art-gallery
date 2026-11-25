import type { Lot } from '../types';
import type { User } from '@supabase/supabase-js';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { openBidModal } from './bidModal';
import { openAuthModal } from './AuthModal';
import { openArtworkModal } from './artworkModal';
import { placeBid } from '../api/bidsApi';
import { getCurrentUser } from '../api/authApi';
import { showToast } from './toast';
import { toggleFavorite } from '../api/favoritesApi';
import { t } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';

export function createLotCard(
  lot: Lot,
  user: User | null,
  onBidSuccess: () => void,
  isInitiallyFavorite: boolean = false,
  onFavoriteToggle?: () => void
): HTMLElement {
  const localized = getLocalizedLot(lot);
  const card = createElement('article', 'lot-card');

  if (lot.status !== 'active') {
    card.classList.add('lot-card--sold');
  }

  const imgWrapper = createElement('div', 'lot-card__img-wrapper');
  imgWrapper.style.position = 'relative';

  const img = createElement('img', 'lot-card__image');
  img.src = lot.imageUrl;
  img.alt = localized.title;
  img.loading = 'lazy';
  img.onerror = () => {
    img.style.display = 'none';
    const placeholder = createElement('div', 'lot-card__placeholder', 'Artwork');
    imgWrapper.append(placeholder);
  };
  imgWrapper.append(img);

  let isFavorite = isInitiallyFavorite;
  const favBtn = createElement('button', 'lot-card__fav-btn', '♥');
  if (isFavorite) {
    favBtn.classList.add('lot-card__fav-btn--active');
  }

  favBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (favBtn.disabled) return;

    favBtn.disabled = true;
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        openAuthModal();
        return;
      }

      isFavorite = await toggleFavorite(currentUser.id, lot.id, isFavorite);
      favBtn.classList.toggle('lot-card__fav-btn--active', isFavorite);
      showToast(isFavorite ? t('toast.favAdded') : t('toast.favRemoved'), 'success');
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      showToast(t('toast.favError'), 'error');
    } finally {
      favBtn.disabled = false;
    }
  });
  imgWrapper.append(favBtn);

  const content = createElement('div', 'lot-card__content');
  const title = createElement('h3', 'lot-card__title', localized.title);
  const author = createElement('p', 'lot-card__author', localized.author);

  const priceBlock = createElement('div', 'lot-card__price-block');
  const priceLabel = createElement('span', 'lot-card__price-label', t('lot.currentPrice'));
  const price = createElement('span', 'lot-card__price', formatCurrency(lot.currentPrice));
  priceBlock.append(priceLabel, price);

  const isLeading = user !== null && lot.highestBidderId === user.id;

  let btnText = t('lot.placeBid');
  if (lot.status === 'sold') btnText = t('lot.sold');
  else if (lot.status === 'closed') btnText = t('lot.closed');
  else if (isLeading) btnText = t('lot.leading');

  const actions = createElement('div', 'lot-card__actions');

  const detailsBtn = createElement(
    'button',
    'lot-card__btn lot-card__btn--secondary',
    t('lot.viewDetails')
  );
  detailsBtn.type = 'button';
  detailsBtn.addEventListener('click', () => {
    openArtworkModal(lot, () => {}, {
      user,
      onBidSuccess,
    });
  });

  const bidBtn = createElement('button', 'lot-card__btn', btnText);
  bidBtn.type = 'button';

  if (lot.status !== 'active' || isLeading) {
    bidBtn.setAttribute('disabled', 'true');
  } else {
    bidBtn.addEventListener('click', async () => {
      bidBtn.disabled = true;
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          openAuthModal({
            onSuccess: () => {
              openBidModal(localized.title, lot.currentPrice, lot.minStep, async (amount) => {
                const u = await getCurrentUser();
                if (u) {
                  await placeBid(lot.id, u.id, amount);
                  showToast(t('toast.bidSuccess'), 'success');
                  onBidSuccess();
                }
              });
            },
          });
          return;
        }

        openBidModal(localized.title, lot.currentPrice, lot.minStep, async (amount) => {
          await placeBid(lot.id, currentUser.id, amount);
          showToast(t('toast.bidSuccess'), 'success');
          onBidSuccess();
        });
      } finally {
        bidBtn.disabled = false;
      }
    });
  }

  actions.append(detailsBtn, bidBtn);
  content.append(title, author, priceBlock, actions);
  card.append(imgWrapper, content);

  return card;
}
