import './checkoutModal.css';
import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { calculateCheckoutTotal } from '../core/calculateCheckoutTotal';

export function openCheckoutModal(
  lotTitle: string,
  currentPrice: number,
  onConfirm: (finalPrice: number, promo: string) => Promise<void>
): void {
  const dialog = createElement('dialog', 'checkout-dialog');
  const form = createElement('form', 'checkout-form');

  const title = createElement('h2', 'checkout-form__title', `Checkout: ${lotTitle}`);

  const priceBreakdown = createElement('div', 'checkout-form__breakdown');

  const hammerPriceRow = createElement('div', 'checkout-row');
  hammerPriceRow.append(
    createElement('span', '', 'Hammer Price:'),
    createElement('span', '', formatCurrency(currentPrice))
  );

  const premiumRow = createElement('div', 'checkout-row');
  const premiumLabel = createElement('span', '', "Buyer's Premium (10%):");
  const premiumValue = createElement('span', '', formatCurrency(currentPrice * 0.1));
  premiumRow.append(premiumLabel, premiumValue);

  priceBreakdown.append(hammerPriceRow, premiumRow);

  const promoSection = createElement('div', 'checkout-form__promo-section');

  const promoLink = createElement('button', 'checkout-form__promo-link', 'Have a promo code?');
  promoLink.type = 'button';

  const promoInputContainer = createElement('div', 'checkout-form__promo-input-container');
  promoInputContainer.style.display = 'none';

  const promoInput = createElement('input', 'checkout-form__input');
  promoInput.placeholder = 'Enter code (e.g., VIPART)';

  promoInputContainer.append(promoInput);
  promoSection.append(promoLink, promoInputContainer);

  const totalText = createElement(
    'p',
    'checkout-form__total',
    `Total: ${formatCurrency(calculateCheckoutTotal([currentPrice], ''))}`
  );

  const actions = createElement('div', 'checkout-form__actions');
  const cancelBtn = createElement('button', 'btn btn--secondary', 'Cancel');
  cancelBtn.type = 'button';
  const submitBtn = createElement('button', 'btn btn--primary', 'Confirm Purchase');
  submitBtn.type = 'submit';

  actions.append(cancelBtn, submitBtn);
  form.append(title, priceBreakdown, promoSection, totalText, actions);
  dialog.append(form);
  document.body.append(dialog);

  promoLink.addEventListener('click', () => {
    promoLink.style.display = 'none';
    promoInputContainer.style.display = 'block';
    promoInput.focus();
  });

  promoInput.addEventListener('input', () => {
    const total = calculateCheckoutTotal([currentPrice], promoInput.value);
    const isVip = promoInput.value.trim().toUpperCase() === 'VIPART';

    totalText.textContent = `Total: ${formatCurrency(total)}`;

    if (isVip) {
      premiumValue.textContent = 'Waived (VIP)';
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
    dialog.remove();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const finalPrice = calculateCheckoutTotal([currentPrice], promoInput.value);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      await onConfirm(finalPrice, promoInput.value);
      dialog.close();
      dialog.remove();
    } catch (error) {
      console.error(error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Purchase';
    }
  });

  dialog.showModal();
}
