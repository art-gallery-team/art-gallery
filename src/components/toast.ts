import { createElement } from '../utils/dom';

export function showToast(message: string, type: 'warning' | 'error' = 'warning'): void {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = createElement('div', 'toast-container');
    document.body.append(container);
  }

  const toast = createElement('div', `toast toast--${type}`, message);
  container.append(toast);

  setTimeout(() => toast.classList.add('toast--visible'), 10);

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
