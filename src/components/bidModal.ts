import { createElement } from '../utils/dom';
import { formatCurrency } from '../core/formatCurrency';
import { validateNewBid } from '../core/validateNewBid';
import { t } from '../utils/i18n';

export function openBidModal(
  lotTitle: string,
  currentPrice: number,
  minStep: number,
  onConfirm: (amount: number) => Promise<void>
): void {
  const existingDialog = document.querySelector<HTMLDialogElement>('dialog.bid-dialog');
  if (existingDialog) {
    existingDialog.close();
    existingDialog.remove();
  }

  const dialog = createElement('dialog', 'bid-dialog');
  const form = createElement('form', 'bid-form');
  form.method = 'dialog';

  const title = createElement('h2', 'bid-form__title', `${t('bid.title')} "${lotTitle}"`);
  const info = createElement(
    'p',
    'bid-form__info',
    `${t('bid.current')}: ${formatCurrency(currentPrice)}. ${t('bid.minStep')}: ${formatCurrency(minStep)}`
  );

  const input = createElement('input', 'bid-form__input');
  input.type = 'number';
  input.value = String(currentPrice + minStep);
  input.required = true;

  const errorMsg = createElement('p', 'bid-form__error');
  errorMsg.style.display = 'none';

  const actions = createElement('div', 'bid-form__actions');
  const cancelBtn = createElement('button', 'btn btn--secondary', t('bid.cancel'));
  cancelBtn.type = 'button';
  const submitBtn = createElement('button', 'btn btn--primary', t('bid.confirm'));
  submitBtn.type = 'submit';

  actions.append(cancelBtn, submitBtn);
  form.append(title, info, input, errorMsg, actions);
  dialog.append(form);
  document.body.append(dialog);

  cancelBtn.addEventListener('click', () => {
    dialog.close();
  });

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(input.value);
    errorMsg.style.display = 'none';

    try {
      validateNewBid(currentPrice, amount, minStep, 'active', null);

      submitBtn.disabled = true;
      submitBtn.textContent = t('bid.processing');

      await onConfirm(amount);

      dialog.close();
    } catch (error) {
      errorMsg.textContent = error instanceof Error ? error.message : t('bid.unknownError');
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = t('bid.confirm');
    }
  });

  dialog.showModal();
}
