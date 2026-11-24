import type { Purchase } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';

export function createPurchaseCard(purchase: Purchase): HTMLElement {
  const card = createElement('div', 'bid-card');
  const lot = purchase.lots;

  if (!lot) {
    const title = createElement('h3', 'bid-card__title', 'Unknown Lot');
    const price = createElement(
      'span',
      'bid-card__my-bid',
      `Paid: ${formatCurrency(purchase.final_price)}`
    );
    card.append(title, price);
    return card;
  }

  const title = createElement('h3', 'bid-card__title', lot.title);
  const author = createElement('p', 'bid-card__author', lot.author);

  const info = createElement('div', 'bid-card__info');
  const price = createElement(
    'span',
    'bid-card__my-bid',
    `Paid: ${formatCurrency(purchase.final_price)}`
  );

  info.append(price);

  if (purchase.promo_used) {
    const promo = createElement('span', 'bid-card__current', ` (Promo: ${purchase.promo_used})`);
    info.append(promo);
  }

  const statusBadge = createElement(
    'span',
    'bid-card__status bid-card__status--leading',
    'Purchased'
  );

  info.append(statusBadge);
  card.append(title, author, info);

  return card;
}
