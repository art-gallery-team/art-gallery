import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { validateNewBid } from '../core/validateNewBid';

export function openBidModal(
  lotTitle: string,
  currentPrice: number,
  minStep: number,
  onConfirm: (amount: number) => Promise<void>
): void {
  const dialog = createElement('dialog', 'bid-dialog');
  const form = createElement('form', 'bid-form');
  form.method = 'dialog';

  const title = createElement('h2', 'bid-form__title', `Bid for "${lotTitle}"`);
  const info = createElement(
    'p',
    'bid-form__info',
    `Current: ${formatCurrency(currentPrice)}. Min step: ${formatCurrency(minStep)}`
  );

  const input = createElement('input', 'bid-form__input');
  input.type = 'number';
  input.value = String(currentPrice + minStep);
  input.required = true;

  const errorMsg = createElement('p', 'bid-form__error');
  errorMsg.style.display = 'none';

  const actions = createElement('div', 'bid-form__actions');
  const cancelBtn = createElement('button', 'btn btn--secondary', 'Cancel');
  cancelBtn.type = 'button';
  const submitBtn = createElement('button', 'btn btn--primary', 'Confirm Bid');
  submitBtn.type = 'submit';

  actions.append(cancelBtn, submitBtn);
  form.append(title, info, input, errorMsg, actions);
  dialog.append(form);
  document.body.append(dialog);

  cancelBtn.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(input.value);
    errorMsg.style.display = 'none';

    try {
      validateNewBid(currentPrice, amount, minStep, 'active', null);

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      await onConfirm(amount);

      dialog.close();
      dialog.remove();
    } catch (error) {
      errorMsg.textContent = error instanceof Error ? error.message : 'Unknown error';
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Bid';
    }
  });

  dialog.showModal();
}
