import type { Bid } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getUserBidStatus } from '../core/getUserBidStatus';
import { openCheckoutModal } from './checkoutModal';
import { purchaseLot } from '../api/purchasesApi';
import { getCurrentUser } from '../api/authApi';
import { showToast } from './toast';
import { t, getSavedLanguage } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';

export function createBidCard(
  bid: Bid,
  onCheckoutSuccess: () => void,
  showCheckout: boolean = true,
  isHistory: boolean = false
): HTMLElement {
  const card = createElement('div', 'bid-card');
  const lot = bid.lots;
  if (!lot) return card;

  const localized = getLocalizedLot(lot);
  const status = getUserBidStatus(lot.currentPrice, bid.amount);

  const title = createElement('h3', 'bid-card__title', localized.title);
  const author = createElement('p', 'bid-card__author', localized.author);

  const info = createElement('div', 'bid-card__info');

  const myBid = createElement(
    'span',
    'bid-card__my-bid',
    `${t('bidCard.myBid')}: ${formatCurrency(bid.amount)}`
  );

  const currentPrice = createElement(
    'span',
    'bid-card__current',
    `${t('bid.current')}: ${formatCurrency(lot.currentPrice)}`
  );

  const dateObj = new Date(bid.created_at);
  const dateStr = dateObj.toLocaleDateString(getSavedLanguage(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const bidDate = createElement('span', 'bid-card__date', dateStr);
  bidDate.style.fontSize = '0.75rem';
  bidDate.style.color = 'var(--text-muted)';
  bidDate.style.width = '100%';
  bidDate.style.marginTop = '0.25rem';

  const statusBadge = createElement('span', 'bid-card__status');

  if (isHistory) {
    if (lot.status === 'sold' && status === 'leading') {
      statusBadge.textContent = t('bidCard.won');
      statusBadge.style.color = '#4ade80';
    } else {
      statusBadge.textContent = t('bidCard.placed');
      statusBadge.style.color = 'var(--text-muted)';
    }
    statusBadge.style.marginLeft = 'auto';
  } else {
    if (status === 'leading') {
      statusBadge.textContent = t('bidCard.leading');
      statusBadge.classList.add('bid-card__status--leading');
      statusBadge.style.marginLeft = 'auto';
    } else if (status === 'outbid') {
      statusBadge.textContent = t('bidCard.outbid');
      statusBadge.classList.add('bid-card__status--outbid');
      statusBadge.style.marginLeft = 'auto';
    }
  }

  info.append(myBid, currentPrice, statusBadge, bidDate);
  card.append(title, author, info);

  if (showCheckout && status === 'leading' && lot.status === 'active') {
    const checkoutBtn = createElement('button', 'btn btn--primary', t('bidCard.checkout'));
    checkoutBtn.style.marginTop = '1rem';
    checkoutBtn.style.width = '100%';

    checkoutBtn.addEventListener('click', async () => {
      checkoutBtn.disabled = true;
      try {
        const user = await getCurrentUser();
        if (!user) return;

        openCheckoutModal(localized.title, lot.currentPrice, async (finalPrice, promo) => {
          try {
            await purchaseLot(lot.id, user.id, finalPrice, promo);
            showToast(t('toast.purchaseSuccess'), 'success');
            onCheckoutSuccess();
          } catch (error) {
            showToast(t('toast.purchaseError'), 'error');
            throw error;
          }
        });
      } finally {
        checkoutBtn.disabled = false;
      }
    });

    card.append(checkoutBtn);
  }

  return card;
}
