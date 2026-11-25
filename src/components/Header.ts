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
  const header = document.createElement('header');
  header.className = 'app-header';

  const inner = document.createElement('div');
  inner.className = 'app-header__inner';

  const logo = document.createElement('button');
  logo.type = 'button';
  logo.className = 'app-header__logo';
  logo.textContent = 'Art Gallery & Auction';
  logo.addEventListener('click', () => onNavigate('/'));

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
    linkBtn.addEventListener('click', () => onNavigate(path));
    nav.append(linkBtn);
  });

  const authActions = document.createElement('div');
  authActions.className = 'app-header__auth';

  // Селектор языка (EN / RU / BE)
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

  // Кнопка переключения темы
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

  authActions.prepend(langSelect, themeBtn);

  if (user) {
    const userEmail = document.createElement('span');
    userEmail.className = 'app-header__user';
    userEmail.textContent = user.email ?? t('header.collector');

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'app-header__btn app-header__btn--outline';
    logoutBtn.textContent = t('auth.signOut');
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      if (currentPath === '/profile') {
        onNavigate('/');
      }
    });

    authActions.append(userEmail, logoutBtn);
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.className = 'app-header__btn';
    loginBtn.textContent = t('auth.signIn');
    loginBtn.addEventListener('click', () => {
      openAuthModal();
    });

    authActions.append(loginBtn);
  }

  inner.append(logo, nav, authActions);
  header.append(inner);
  return header;
}
