import type { User } from '@supabase/supabase-js';
import type { Lot } from '../types';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { getCurrentUser } from '../api/authApi';
import { placeBid } from '../api/bidsApi';
import { openAuthModal } from './AuthModal';
import { openBidModal } from './bidModal';
import { showToast } from './toast';
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

  const images =
    lot.modalImages && lot.modalImages.length > 0
      ? lot.modalImages
      : lot.imageUrl
        ? [lot.imageUrl]
        : [];

  let currentIndex = 0;
  const mediaWrapper = createElement('div', 'artwork-modal__media');

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: TouchEvent): void => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent): void => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) showNextImage();
    if (touchEndX > touchStartX + 50) showPrevImage();
  };

  mediaWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
  mediaWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });

  const showPrevImage = (): void => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderMedia();
  };

  const showNextImage = (): void => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    renderMedia();
  };

  const renderMedia = (): void => {
    mediaWrapper.replaceChildren();

    const showPlaceholder = (): void => {
      const placeholder = createElement('div', 'artwork-modal__placeholder', 'Artwork');
      mediaWrapper.replaceChildren(placeholder);
    };

    if (images.length === 0) {
      showPlaceholder();
      return;
    }

    const img = createElement('img', 'artwork-modal__image');
    img.src = images[currentIndex];
    img.alt = `${lot.title} by ${lot.author} (${currentIndex + 1}/${images.length})`;
    img.onerror = () => {
      img.onerror = null;

      if (lot.imageUrl && images[currentIndex] !== lot.imageUrl) {
        img.src = lot.imageUrl;
      } else {
        showPlaceholder();
      }
    };
    mediaWrapper.appendChild(img);

    if (images.length > 1) {
      const prevBtn = createElement(
        'button',
        'artwork-modal__nav-btn artwork-modal__nav-btn--prev',
        '‹'
      );
      prevBtn.type = 'button';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.addEventListener('click', showPrevImage);

      const nextBtn = createElement(
        'button',
        'artwork-modal__nav-btn artwork-modal__nav-btn--next',
        '›'
      );
      nextBtn.type = 'button';
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.addEventListener('click', showNextImage);

      const counter = createElement(
        'span',
        'artwork-modal__counter',
        `${currentIndex + 1} / ${images.length}`
      );

      mediaWrapper.append(prevBtn, nextBtn, counter);
    }
  };

  renderMedia();

  const content = createElement('div', 'artwork-modal__content');
  const header = createElement('div', 'artwork-modal__header');

  const isActive = lot.status === 'active';
  const statusLabel = lot.status === 'closed' ? 'Closed' : isActive ? 'In Auction' : 'Sold';
  const statusBadge = createElement(
    'span',
    `artwork-modal__status ${isActive ? 'artwork-modal__status--active' : 'artwork-modal__status--sold'}`,
    statusLabel
  );

  const title = createElement('h2', 'artwork-modal__title', lot.title);
  const author = createElement('p', 'artwork-modal__author', `by ${lot.author}`);

  header.append(statusBadge, title, author);

  const meta = createElement('div', 'artwork-modal__meta');
  if (lot.year) {
    meta.appendChild(createElement('span', 'artwork-modal__tag', `Year: ${lot.year}`));
  }
  if (lot.style) {
    meta.appendChild(createElement('span', 'artwork-modal__tag', `Style: ${lot.style}`));
  }

  const description = createElement(
    'p',
    'artwork-modal__description',
    lot.description || 'No detailed curatorial description provided for this artwork.'
  );

  content.append(header, meta, description);

  if (auctionOptions) {
    const auctionInfo = createElement('div', 'artwork-modal__auction-info');

    const currentStat = createElement('div', 'artwork-modal__bid-stat');
    currentStat.append(
      createElement('span', 'artwork-modal__bid-label', 'Current Price'),
      createElement(
        'span',
        'artwork-modal__bid-value artwork-modal__bid-value--highlight',
        formatCurrency(lot.currentPrice)
      )
    );

    const startStat = createElement('div', 'artwork-modal__bid-stat');
    startStat.append(
      createElement('span', 'artwork-modal__bid-label', 'Start Price'),
      createElement('span', 'artwork-modal__bid-value', formatCurrency(lot.startPrice))
    );

    const stepStat = createElement('div', 'artwork-modal__bid-stat');
    stepStat.append(
      createElement('span', 'artwork-modal__bid-label', 'Min Step'),
      createElement('span', 'artwork-modal__bid-value', `+${formatCurrency(lot.minStep)}`)
    );

    auctionInfo.append(currentStat, startStat, stepStat);
    content.appendChild(auctionInfo);
  }

  const actions = createElement('div', 'artwork-modal__actions');

  if (auctionOptions) {
    const isLeading =
      auctionOptions.user !== null && lot.highestBidderId === auctionOptions.user.id;

    let btnText = 'Place a Bid';
    if (lot.status === 'sold') btnText = 'Sold';
    else if (lot.status === 'closed') btnText = 'Closed';
    else if (isLeading) btnText = 'You are leading';

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
    const auctionBtn = createElement('button', 'artwork-modal__cta', 'Go to Auction Hall');
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

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft') showPrevImage();
    if (event.key === 'ArrowRight') showNextImage();
  };

  document.addEventListener('keydown', handleKeyDown);

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
    mediaWrapper.removeEventListener('touchstart', handleTouchStart);
    mediaWrapper.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('keydown', handleKeyDown);
    dialog.remove();
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}
