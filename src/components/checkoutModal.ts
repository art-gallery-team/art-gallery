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
  const info = createElement(
    'p',
    'checkout-form__info',
    `Base price: ${formatCurrency(currentPrice)}`
  );

  const promoLabel = createElement('label', 'checkout-form__label', 'Promo Code (try VIPART)');
  promoLabel.htmlFor = 'promo-input';

  const promoInput = createElement('input', 'checkout-form__input');
  promoInput.id = 'promo-input';
  promoInput.type = 'text';
  promoInput.placeholder = 'Enter promo code...';

  const totalText = createElement(
    'p',
    'checkout-form__total',
    `Total: ${formatCurrency(calculateCheckoutTotal([currentPrice], ''))}`
  );

  promoInput.addEventListener('input', () => {
    const total = calculateCheckoutTotal([currentPrice], promoInput.value);
    totalText.textContent = `Total: ${formatCurrency(total)}`;
  });

  const actions = createElement('div', 'checkout-form__actions');
  const cancelBtn = createElement('button', 'btn btn--secondary', 'Cancel');
  cancelBtn.type = 'button';
  const submitBtn = createElement('button', 'btn btn--primary', 'Confirm Purchase');
  submitBtn.type = 'submit';

  actions.append(cancelBtn, submitBtn);
  form.append(title, info, promoLabel, promoInput, totalText, actions);
  dialog.append(form);
  document.body.append(dialog);

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
