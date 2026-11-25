import type { User } from '@supabase/supabase-js';
import { signOut } from '../api/authApi';
import { openAuthModal } from './AuthModal';
import './Header.css';
import { getSavedTheme, toggleTheme } from '../utils/theme';

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
    { path: '/', label: 'About Us' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/auction', label: 'Auction Hall' },
    ...(user ? [{ path: '/profile', label: 'Profile' }] : []),
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

  const themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'app-header__btn app-header__btn--outline app-header__theme-btn ';

  const updateThemeLabel = (theme: 'dark' | 'light'): void => {
    themeBtn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
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

  authActions.prepend(themeBtn);

  if (user) {
    const userEmail = document.createElement('span');
    userEmail.className = 'app-header__user';
    userEmail.textContent = user.email ?? 'Collector';

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'app-header__btn app-header__btn--outline';
    logoutBtn.textContent = 'Sign Out';
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
    loginBtn.textContent = 'Sign In';
    loginBtn.addEventListener('click', () => {
      openAuthModal();
    });

    authActions.append(loginBtn);
  }

  inner.append(logo, nav, authActions);
  header.append(inner);
  return header;
}
