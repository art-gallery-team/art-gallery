import type { Bid } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getUserBidStatus } from '../core/getUserBidStatus';
import { openCheckoutModal } from './checkoutModal';
import { purchaseLot } from '../api/purchasesApi';
import { getCurrentUser } from '../api/authApi';
import { showToast } from './toast';

export function createBidCard(bid: Bid): HTMLElement {
  const card = createElement('div', 'bid-card');

  const lot = bid.lots;
  if (!lot) return card;

  const status = getUserBidStatus(lot.currentPrice, bid.amount);

  const title = createElement('h3', 'bid-card__title', lot.title);
  const author = createElement('p', 'bid-card__author', lot.author);

  const info = createElement('div', 'bid-card__info');
  const myBid = createElement('span', 'bid-card__my-bid', `My Bid: ${formatCurrency(bid.amount)}`);
  const currentPrice = createElement(
    'span',
    'bid-card__current',
    `Current: ${formatCurrency(lot.currentPrice)}`
  );

  const statusBadge = createElement('span', 'bid-card__status');
  if (status === 'leading') {
    statusBadge.textContent = 'Leading';
    statusBadge.classList.add('bid-card__status--leading');
  } else if (status === 'outbid') {
    statusBadge.textContent = 'Outbid';
    statusBadge.classList.add('bid-card__status--outbid');
  }

  info.append(myBid, currentPrice, statusBadge);
  card.append(title, author, info);

  if (status === 'leading' && lot.status === 'active') {
    const checkoutBtn = createElement('button', 'btn btn--primary', 'Checkout');
    checkoutBtn.style.marginTop = '1rem';
    checkoutBtn.style.width = '100%';

    checkoutBtn.addEventListener('click', async () => {
      const user = await getCurrentUser();
      if (!user) return;

      openCheckoutModal(lot.title, lot.currentPrice, async (finalPrice, promo) => {
        try {
          await purchaseLot(lot.id, user.id, finalPrice, promo);
          showToast('Lot purchased successfully!', 'success');

          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          showToast('Failed to complete purchase. Try again.', 'error');
          console.error(error);
        }
      });
    });

    card.append(checkoutBtn);
  }

  return card;
}
