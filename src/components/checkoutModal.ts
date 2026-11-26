import './checkoutModal.css';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { calculateCheckoutTotal } from '../core/calculateCheckoutTotal';
import { t } from '../utils/i18n';

export function openCheckoutModal(
  lotTitle: string,
  currentPrice: number,
  onConfirm: (finalPrice: number, promo: string) => Promise<void>
): void {
  const existingDialog = document.querySelector<HTMLDialogElement>('dialog.checkout-dialog');
  if (existingDialog) {
    existingDialog.close();
    existingDialog.remove();
  }

  const dialog = createElement('dialog', 'checkout-dialog');
  const form = createElement('form', 'checkout-form');

  const title = createElement('h2', 'checkout-form__title', `${t('checkout.title')}: ${lotTitle}`);

  const priceBreakdown = createElement('div', 'checkout-form__breakdown');

  const hammerPriceRow = createElement('div', 'checkout-row');
  hammerPriceRow.append(
    createElement('span', '', `${t('checkout.hammerPrice')}:`),
    createElement('span', '', formatCurrency(currentPrice))
  );

  const premiumRow = createElement('div', 'checkout-row');
  const premiumLabel = createElement('span', '', `${t('checkout.buyersPremium')}:`);
  const premiumValue = createElement('span', '', formatCurrency(currentPrice * 0.1));
  premiumRow.append(premiumLabel, premiumValue);

  priceBreakdown.append(hammerPriceRow, premiumRow);

  const promoSection = createElement('div', 'checkout-form__promo-section');

  const promoLink = createElement('button', 'checkout-form__promo-link', t('checkout.havePromo'));
  promoLink.type = 'button';

  const promoInputContainer = createElement('div', 'checkout-form__promo-input-container');
  promoInputContainer.style.display = 'none';

  const promoInput = createElement('input', 'checkout-form__input');
  promoInput.placeholder = t('checkout.promoPlaceholder');

  promoInputContainer.append(promoInput);
  promoSection.append(promoLink, promoInputContainer);

  const totalText = createElement(
    'p',
    'checkout-form__total',
    `${t('checkout.total')}: ${formatCurrency(calculateCheckoutTotal([currentPrice], ''))}`
  );

  const actions = createElement('div', 'checkout-form__actions');
  const cancelBtn = createElement('button', 'btn btn--secondary', t('bid.cancel'));
  cancelBtn.type = 'button';
  const submitBtn = createElement('button', 'btn btn--primary', t('checkout.confirm'));
  submitBtn.type = 'submit';

  actions.append(cancelBtn, submitBtn);
  form.append(title, priceBreakdown, promoSection, totalText, actions);
  dialog.append(form);
  document.body.append(dialog);

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

  dialog.addEventListener('close', () => dialog.remove());

  promoLink.addEventListener('click', () => {
    promoLink.style.display = 'none';
    promoInputContainer.style.display = 'block';
    promoInput.focus();
  });

  promoInput.addEventListener('input', () => {
    const total = calculateCheckoutTotal([currentPrice], promoInput.value);
    const isVip = promoInput.value.trim().toUpperCase() === 'VIPART';

    totalText.textContent = `${t('checkout.total')}: ${formatCurrency(total)}`;

    if (isVip) {
      premiumValue.textContent = t('checkout.waived');
      premiumValue.style.color = '#4ade80';
      premiumLabel.style.color = '#4ade80';
    } else {
      premiumValue.textContent = formatCurrency(currentPrice * 0.1);
      premiumValue.style.color = '';
      premiumLabel.style.color = '';
    }
  });

  cancelBtn.addEventListener('click', () => {
    dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const finalPrice = calculateCheckoutTotal([currentPrice], promoInput.value);
    submitBtn.disabled = true;
    submitBtn.textContent = t('bid.processing');

    try {
      await onConfirm(finalPrice, promoInput.value);
      dialog.close();
    } catch (error) {
      console.error(error);
      submitBtn.disabled = false;
      submitBtn.textContent = t('checkout.confirm');
    }
  });

  dialog.showModal();
}
