import type { User } from '@supabase/supabase-js';
import type { Lot } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getCurrentUser } from '../api/authApi';
import { placeBid } from '../api/bidsApi';
import { openAuthModal } from './AuthModal';
import { openBidModal } from './bidModal';
import { showToast } from './toast';
import { t } from '../utils/i18n';
import './artworkModal.css';

export interface ArtworkModalAuctionOptions {
  user: User | null;
  onBidSuccess: () => void;
}

export function openArtworkModal(
  lot: Lot,
  onGoToAuction: () => void,
  auctionOptions?: ArtworkModalAuctionOptions
): void {
  const existingModal = document.querySelector<HTMLDialogElement>('dialog.artwork-modal');
  if (existingModal) {
    existingModal.close();
    existingModal.remove();
  }

  const dialog = createElement('dialog', 'artwork-modal');
  const container = createElement('div', 'artwork-modal__container');

  const closeBtn = createElement('button', 'artwork-modal__close', '×');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.addEventListener('click', () => dialog.close());

  const mediaWrapper = createElement('div', 'artwork-modal__media');

  const showPlaceholder = (): void => {
    const placeholder = createElement('div', 'artwork-modal__placeholder', 'Artwork');
    mediaWrapper.replaceChildren(placeholder);
  };

  if (lot.imageUrl) {
    const img = createElement('img', 'artwork-modal__image');
    img.src = lot.imageUrl;
    img.alt = `${lot.title} ${t('modal.by')} ${lot.author}`;
    img.onerror = () => {
      img.onerror = null;
      showPlaceholder();
    };
    mediaWrapper.appendChild(img);
  } else {
    showPlaceholder();
  }

  const content = createElement('div', 'artwork-modal__content');
  const header = createElement('div', 'artwork-modal__header');

  const isActive = lot.status === 'active';
  const statusLabel =
    lot.status === 'closed' ? t('modal.closed') : isActive ? t('modal.inAuction') : t('modal.sold');
  const statusBadge = createElement(
    'span',
    `artwork-modal__status ${isActive ? 'artwork-modal__status--active' : 'artwork-modal__status--sold'}`,
    statusLabel
  );

  const title = createElement('h2', 'artwork-modal__title', lot.title);
  const author = createElement('p', 'artwork-modal__author', `${t('modal.by')} ${lot.author}`);

  header.append(statusBadge, title, author);

  const meta = createElement('div', 'artwork-modal__meta');
  if (lot.year) {
    meta.appendChild(
      createElement('span', 'artwork-modal__tag', `${t('modal.year')}: ${lot.year}`)
    );
  }
  if (lot.style) {
    meta.appendChild(
      createElement('span', 'artwork-modal__tag', `${t('modal.style')}: ${lot.style}`)
    );
  }

  const description = createElement(
    'p',
    'artwork-modal__description',
    lot.description || t('modal.noDesc')
  );

  content.append(header, meta, description);

  if (auctionOptions) {
    const auctionInfo = createElement('div', 'artwork-modal__auction-info');

    const currentStat = createElement('div', 'artwork-modal__bid-stat');
    currentStat.append(
      createElement('span', 'artwork-modal__bid-label', t('lot.currentPrice')),
      createElement(
        'span',
        'artwork-modal__bid-value artwork-modal__bid-value--highlight',
        formatCurrency(lot.currentPrice)
      )
    );

    const startStat = createElement('div', 'artwork-modal__bid-stat');
    startStat.append(
      createElement('span', 'artwork-modal__bid-label', t('modal.startPrice')),
      createElement('span', 'artwork-modal__bid-value', formatCurrency(lot.startPrice))
    );

    const stepStat = createElement('div', 'artwork-modal__bid-stat');
    stepStat.append(
      createElement('span', 'artwork-modal__bid-label', t('modal.minStep')),
      createElement('span', 'artwork-modal__bid-value', `+${formatCurrency(lot.minStep)}`)
    );

    auctionInfo.append(currentStat, startStat, stepStat);
    content.appendChild(auctionInfo);
  }

  const actions = createElement('div', 'artwork-modal__actions');

  if (auctionOptions) {
    const isLeading =
      auctionOptions.user !== null && lot.highestBidderId === auctionOptions.user.id;

    let btnText = t('lot.placeBid');
    if (lot.status === 'sold') btnText = t('lot.sold');
    else if (lot.status === 'closed') btnText = t('lot.closed');
    else if (isLeading) btnText = t('lot.leading');

    const bidBtn = createElement('button', 'artwork-modal__cta', btnText);
    bidBtn.type = 'button';

    if (lot.status !== 'active' || isLeading) {
      bidBtn.disabled = true;
    } else {
      bidBtn.addEventListener('click', async () => {
        bidBtn.disabled = true;
        try {
          const currentUser = await getCurrentUser();
          dialog.close();

          if (!currentUser) {
            openAuthModal({
              onSuccess: () => {
                openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
                  const u = await getCurrentUser();
                  if (u) {
                    await placeBid(lot.id, u.id, amount);
                    showToast('Bid placed successfully!', 'success');
                    auctionOptions.onBidSuccess();
                  }
                });
              },
            });
            return;
          }

          openBidModal(lot.title, lot.currentPrice, lot.minStep, async (amount) => {
            await placeBid(lot.id, currentUser.id, amount);
            showToast('Bid placed successfully!', 'success');
            auctionOptions.onBidSuccess();
          });
        } finally {
          bidBtn.disabled = false;
        }
      });
    }

    actions.appendChild(bidBtn);
  } else {
    const auctionBtn = createElement('button', 'artwork-modal__cta', t('modal.goToAuction'));
    auctionBtn.type = 'button';
    auctionBtn.addEventListener('click', () => {
      dialog.close();
      onGoToAuction();
    });
    actions.appendChild(auctionBtn);
  }

  content.appendChild(actions);
  container.append(closeBtn, mediaWrapper, content);
  dialog.appendChild(container);

  let isMouseDownOnBackdrop = false;

  dialog.addEventListener('mousedown', (event) => {
    isMouseDownOnBackdrop = event.target === dialog;
  });

  dialog.addEventListener('mouseup', (event) => {
    if (isMouseDownOnBackdrop && event.target === dialog) {
      dialog.close();
    }
    isMouseDownOnBackdrop = false;
  });

  dialog.addEventListener('close', () => {
    dialog.remove();
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}
