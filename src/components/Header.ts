import type { User } from '@supabase/supabase-js';
import { signOut } from '../api/authApi';
import { openAuthModal } from './AuthModal';
import './Header.css';
import { getSavedTheme, toggleTheme } from '../utils/theme';
import { getSavedLanguage, setLanguage, t, type Language } from '../utils/i18n';

export interface HeaderOptions {
  currentPath: string;
  user: User | null;
  onNavigate: (path: string) => void;
}

export function createHeader({ currentPath, user, onNavigate }: HeaderOptions): HTMLElement {
  document.body.style.overflow = '';

  const header = document.createElement('header');
  header.className = 'app-header';

  const backdrop = document.createElement('div');
  backdrop.className = 'app-header__backdrop';

  const inner = document.createElement('div');
  inner.className = 'app-header__inner';

  const logo = document.createElement('button');
  logo.type = 'button';
  logo.className = 'app-header__logo';
  logo.textContent = 'Art Gallery & Auction';

  const burgerBtn = document.createElement('button');
  burgerBtn.type = 'button';
  burgerBtn.className = 'app-header__burger';
  burgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
  burgerBtn.setAttribute('aria-expanded', 'false');
  burgerBtn.textContent = '☰';

  const menuContainer = document.createElement('div');
  menuContainer.className = 'app-header__menu';

  const closeMenu = (): void => {
    header.classList.remove('app-header--menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.textContent = '☰';
    document.body.style.overflow = '';
  };

  const toggleMenu = (): void => {
    const isOpen = header.classList.toggle('app-header--menu-open');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    burgerBtn.textContent = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  logo.addEventListener('click', () => {
    closeMenu();
    onNavigate('/');
  });

  const nav = document.createElement('nav');
  nav.className = 'app-header__nav';

  const links = [
    { path: '/', label: t('nav.about') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/auction', label: t('nav.auction') },
    ...(user ? [{ path: '/profile', label: t('nav.profile') }] : []),
  ];

  links.forEach(({ path, label }) => {
    const linkBtn = document.createElement('button');
    linkBtn.type = 'button';
    linkBtn.className = 'app-header__link';
    if (currentPath === path) {
      linkBtn.classList.add('app-header__link--active');
    }
    linkBtn.textContent = label;
    linkBtn.addEventListener('click', () => {
      closeMenu();
      onNavigate(path);
    });
    nav.append(linkBtn);
  });

  const authActions = document.createElement('div');
  authActions.className = 'app-header__auth';

  const controlsRow = document.createElement('div');
  controlsRow.className = 'app-header__controls-row';

  const langSelect = document.createElement('select');
  langSelect.className = 'app-header__lang-select';
  langSelect.setAttribute('aria-label', 'Select language');

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'ru', label: 'RU' },
    { value: 'be', label: 'BE' },
  ];

  const currentLang = getSavedLanguage();

  languages.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === currentLang) {
      option.selected = true;
    }
    langSelect.append(option);
  });

  langSelect.addEventListener('change', () => {
    setLanguage(langSelect.value as Language);
  });

  const themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'app-header__btn app-header__btn--outline app-header__theme-btn';

  const updateThemeLabel = (theme: 'dark' | 'light'): void => {
    themeBtn.textContent = theme === 'dark' ? t('theme.light') : t('theme.dark');
    themeBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light catalog theme' : 'Switch to dark gallery theme'
    );
  };

  updateThemeLabel(getSavedTheme());

  themeBtn.addEventListener('click', () => {
    const newTheme = toggleTheme();
    updateThemeLabel(newTheme);
  });

  if (user) {
    const userGroup = document.createElement('div');
    userGroup.className = 'app-header__user-group';

    const userEmail = document.createElement('button');
    userEmail.type = 'button';
    userEmail.className = 'app-header__user';
    userEmail.textContent = user.email ?? t('header.collector');
    userEmail.title = t('nav.profile');
    userEmail.addEventListener('click', () => {
      closeMenu();
      onNavigate('/profile');
    });

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'app-header__btn app-header__btn--outline app-header__auth-btn';
    logoutBtn.textContent = t('auth.signOut');
    logoutBtn.addEventListener('click', async () => {
      closeMenu();
      await signOut();
      if (currentPath === '/profile') {
        onNavigate('/');
      }
    });

    userGroup.append(userEmail, logoutBtn);
    authActions.append(userGroup);
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.className = 'app-header__btn app-header__auth-btn';
    loginBtn.textContent = t('auth.signIn');
    loginBtn.addEventListener('click', () => {
      closeMenu();
      openAuthModal();
    });

    authActions.append(loginBtn);
  }

  controlsRow.append(langSelect, themeBtn);
  authActions.append(controlsRow);

  const handleDocumentKeyDown = (event: KeyboardEvent): void => {
    if (!document.body.contains(header)) {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      return;
    }
    if (event.key === 'Escape' && header.classList.contains('app-header--menu-open')) {
      closeMenu();
    }
  };

  document.addEventListener('keydown', handleDocumentKeyDown);

  menuContainer.append(nav, authActions);
  inner.append(logo, burgerBtn, menuContainer);
  header.append(backdrop, inner);
  return header;
}
