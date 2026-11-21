import type { Lot } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { openBidModal } from './bidModal';
import { openAuthModal } from './AuthModal';
import { placeBid } from '../api/bidsApi';
import { getCurrentUser } from '../api/authApi';

export function createLotCard(lot: Lot, onBidSuccess: () => void): HTMLElement {
  const card = createElement('article', 'lot-card');

  if (lot.status !== 'active') {
    card.classList.add('lot-card--sold');
  }

  const img = createElement('img', 'lot-card__image');
  img.src = lot.imageUrl;
  img.alt = lot.title;
  img.loading = 'lazy';

  const content = createElement('div', 'lot-card__content');
  const title = createElement('h3', 'lot-card__title', lot.title);
  const author = createElement('p', 'lot-card__author', lot.author);

  const priceBlock = createElement('div', 'lot-card__price-block');
  const priceLabel = createElement('span', 'lot-card__price-label', 'Current Price');
  const price = createElement('span', 'lot-card__price', formatCurrency(lot.currentPrice));
  priceBlock.append(priceLabel, price);

  const bidBtn = createElement(
    'button',
    'lot-card__btn',
    lot.status === 'active' ? 'Place a Bid' : 'Sold'
  );

  if (lot.status !== 'active') {
    bidBtn.setAttribute('disabled', 'true');
  } else {
    bidBtn.addEventListener('click', async () => {
      const user = await getCurrentUser();

      if (!user) {
        openAuthModal({
          onSuccess: () => {
            openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
              const currentUser = await getCurrentUser();
              if (currentUser) {
                await placeBid(lot.id, currentUser.id, amount);
                onBidSuccess();
              }
            });
          },
        });
        return;
      }

      openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
        await placeBid(lot.id, user.id, amount);
        onBidSuccess();
      });
    });
  }

  content.append(title, author, priceBlock, bidBtn);
  card.append(img, content);

  return card;
}
