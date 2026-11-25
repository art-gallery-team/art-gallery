import type { User } from '@supabase/supabase-js';
import { signInWithEmail, signUpWithEmail } from '../api/authApi';
import { validateAuthForm } from '../core/validateAuthForm';
import './AuthModal.css';

export interface AuthModalOptions {
  onSuccess?: (user: User) => void;
  onClose?: () => void;
}

export function openAuthModal(options: AuthModalOptions = {}): void {
  const existingModal = document.querySelector('.auth-modal-backdrop');
  if (existingModal) {
    existingModal.remove();
  }

  let isRegisterMode = false;

  const backdrop = document.createElement('div');
  backdrop.className = 'auth-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'auth-modal__close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close modal');

  const title = document.createElement('h2');
  title.className = 'auth-modal__title';
  title.textContent = 'Sign In';

  const subtitle = document.createElement('p');
  subtitle.className = 'auth-modal__subtitle';
  subtitle.textContent = 'Sign in to place bids and manage your favorite artworks';

  const form = document.createElement('form');
  form.className = 'auth-modal__form';
  form.noValidate = true;

  // Email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'auth-modal__field';

  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'auth-email';
  emailLabel.textContent = 'Email';

  const emailInput = document.createElement('input');
  emailInput.id = 'auth-email';
  emailInput.type = 'email';
  emailInput.placeholder = 'collector@example.com';
  emailInput.required = true;

  const emailError = document.createElement('span');
  emailError.className = 'auth-modal__error';

  emailGroup.append(emailLabel, emailInput, emailError);

  // Password field
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'auth-modal__field';

  const passwordLabel = document.createElement('label');
  passwordLabel.htmlFor = 'auth-password';
  passwordLabel.textContent = 'Password';

  const passwordInput = document.createElement('input');
  passwordInput.id = 'auth-password';
  passwordInput.type = 'password';
  passwordInput.placeholder = 'At least 6 characters';
  passwordInput.required = true;

  const passwordError = document.createElement('span');
  passwordError.className = 'auth-modal__error';

  passwordGroup.append(passwordLabel, passwordInput, passwordError);

  // Server error banner
  const serverError = document.createElement('div');
  serverError.className = 'auth-modal__server-error';

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'auth-modal__submit';
  submitBtn.textContent = 'Sign In';

  form.append(emailGroup, passwordGroup, serverError, submitBtn);

  // Mode switcher (Sign In <-> Sign Up)
  const footer = document.createElement('div');
  footer.className = 'auth-modal__footer';

  const switchText = document.createElement('span');
  switchText.textContent = "Don't have an account? ";

  const switchBtn = document.createElement('button');
  switchBtn.type = 'button';
  switchBtn.className = 'auth-modal__switch-btn';
  switchBtn.textContent = 'Sign Up';

  footer.append(switchText, switchBtn);
  modal.append(closeBtn, title, subtitle, form, footer);
  backdrop.append(modal);
  document.body.append(backdrop);

  const closeModal = (): void => {
    backdrop.remove();
    document.removeEventListener('keydown', handleKeyDown);
    options.onClose?.();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  closeBtn.addEventListener('click', closeModal);

  let isMouseDownOnBackdrop = false;

  backdrop.addEventListener('mousedown', (event) => {
    isMouseDownOnBackdrop = event.target === backdrop;
  });

  backdrop.addEventListener('mouseup', (event) => {
    if (isMouseDownOnBackdrop && event.target === backdrop) {
      closeModal();
    }
    isMouseDownOnBackdrop = false;
  });

  switchBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    title.textContent = isRegisterMode ? 'Create Account' : 'Sign In';
    subtitle.textContent = isRegisterMode
      ? 'Register to participate in live contemporary art auctions'
      : 'Sign in to place bids and manage your favorite artworks';
    submitBtn.textContent = isRegisterMode ? 'Sign Up' : 'Sign In';
    switchText.textContent = isRegisterMode
      ? 'Already have an account? '
      : "Don't have an account? ";
    switchBtn.textContent = isRegisterMode ? 'Sign In' : 'Sign Up';

    emailError.textContent = '';
    passwordError.textContent = '';
    serverError.textContent = '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    emailError.textContent = '';
    passwordError.textContent = '';
    serverError.textContent = '';

    const validation = validateAuthForm(emailInput.value, passwordInput.value);
    if (!validation.isValid) {
      emailError.textContent = validation.errors.email ?? '';
      passwordError.textContent = validation.errors.password ?? '';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = isRegisterMode ? 'Creating account...' : 'Signing in...';

    try {
      const user = isRegisterMode
        ? await signUpWithEmail(emailInput.value, passwordInput.value)
        : await signInWithEmail(emailInput.value, passwordInput.value);

      closeModal();
      options.onSuccess?.(user);
    } catch (error) {
      serverError.textContent =
        error instanceof Error ? error.message : 'Authentication failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isRegisterMode ? 'Sign Up' : 'Sign In';
    }
  });

  emailInput.focus();
}
