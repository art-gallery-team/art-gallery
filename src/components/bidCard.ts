import type { Bid } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getUserBidStatus } from '../core/getUserBidStatus';
import { openCheckoutModal } from './checkoutModal';
import { purchaseLot } from '../api/purchasesApi';
import { getCurrentUser } from '../api/authApi';
import { showToast } from './toast';
import { t } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';

export function createBidCard(
  bid: Bid,
  onCheckoutSuccess: () => void,
  showCheckout: boolean = true
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

  const statusBadge = createElement('span', 'bid-card__status');
  if (status === 'leading') {
    statusBadge.textContent = t('bidCard.leading');
    statusBadge.classList.add('bid-card__status--leading');
  } else if (status === 'outbid') {
    statusBadge.textContent = t('bidCard.outbid');
    statusBadge.classList.add('bid-card__status--outbid');
  }

  info.append(myBid, currentPrice, statusBadge);
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
