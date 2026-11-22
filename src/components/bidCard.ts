import type { Bid } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getUserBidStatus } from '../core/getUserBidStatus';

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

  return card;
}
