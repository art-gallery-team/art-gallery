import type { Purchase } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { t } from '../utils/i18n';
import { getLocalizedLot } from '../utils/lotTranslations';

export function createPurchaseCard(purchase: Purchase): HTMLElement {
  const card = createElement('div', 'bid-card');
  const lot = purchase.lots;

  if (!lot) {
    const title = createElement('h3', 'bid-card__title', t('purchaseCard.unknownLot'));
    const price = createElement(
      'span',
      'bid-card__my-bid',
      `${t('purchaseCard.paid')}: ${formatCurrency(purchase.final_price)}`
    );
    card.append(title, price);
    return card;
  }

  const localized = getLocalizedLot(lot);
  const title = createElement('h3', 'bid-card__title', localized.title);
  const author = createElement('p', 'bid-card__author', localized.author);

  const info = createElement('div', 'bid-card__info');
  const price = createElement(
    'span',
    'bid-card__my-bid',
    `${t('purchaseCard.paid')}: ${formatCurrency(purchase.final_price)}`
  );

  info.append(price);

  if (purchase.promo_used) {
    const promo = createElement(
      'span',
      'bid-card__current',
      ` (${t('purchaseCard.promo')}: ${purchase.promo_used})`
    );
    info.append(promo);
  }

  const statusBadge = createElement(
    'span',
    'bid-card__status bid-card__status--leading',
    t('purchaseCard.purchased')
  );

  info.append(statusBadge);
  card.append(title, author, info);

  return card;
}
