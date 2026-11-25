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

export function createLotCard(
  lot: Lot,
  user: User | null,
  onBidSuccess: () => void,
  isInitiallyFavorite: boolean = false,
  onFavoriteToggle?: () => void
): HTMLElement {
  const card = createElement('article', 'lot-card');

  if (lot.status !== 'active') {
    card.classList.add('lot-card--sold');
  }

  const imgWrapper = createElement('div', 'lot-card__img-wrapper');
  imgWrapper.style.position = 'relative';

  const img = createElement('img', 'lot-card__image');
  img.src = lot.imageUrl;
  img.alt = lot.title;
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
      showToast(isFavorite ? 'Added to favorites!' : 'Removed from favorites', 'success');
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      showToast('Failed to update favorites', 'error');
    } finally {
      favBtn.disabled = false;
    }
  });
  imgWrapper.append(favBtn);

  const content = createElement('div', 'lot-card__content');
  const title = createElement('h3', 'lot-card__title', lot.title);
  const author = createElement('p', 'lot-card__author', lot.author);

  const priceBlock = createElement('div', 'lot-card__price-block');
  const priceLabel = createElement('span', 'lot-card__price-label', 'Current Price');
  const price = createElement('span', 'lot-card__price', formatCurrency(lot.currentPrice));
  priceBlock.append(priceLabel, price);

  const isLeading = user !== null && lot.highestBidderId === user.id;

  let btnText = 'Place a Bid';
  if (lot.status === 'sold') btnText = 'Sold';
  else if (lot.status === 'closed') btnText = 'Closed';
  else if (isLeading) btnText = 'You are leading';

  const actions = createElement('div', 'lot-card__actions');

  const detailsBtn = createElement(
    'button',
    'lot-card__btn lot-card__btn--secondary',
    'View Details'
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
              openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
                const u = await getCurrentUser();
                if (u) {
                  await placeBid(lot.id, u.id, amount);
                  showToast('Bid placed successfully!', 'success');
                  onBidSuccess();
                }
              });
            },
          });
          return;
        }

        openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
          await placeBid(lot.id, currentUser.id, amount);
          showToast('Bid placed successfully!', 'success');
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
