import type { User } from '@supabase/supabase-js';
import './style.css';
import { getCurrentUser, onAuthStateChange } from './api/authApi';
import { openAuthModal } from './components/AuthModal';
import { createHeader } from './components/Header';
import { renderAboutPage } from './pages/about';
import { renderAuctionHall } from './pages/auction';
import { renderProfilePage } from './pages/profile';

const app = document.querySelector<HTMLDivElement>('#app');

let currentUser: User | null = null;

function getCurrentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function navigate(path: string): void {
  window.location.hash = path === '/' ? '' : path;
  renderApp();
}

function renderApp(): void {
  if (!app) return;

  const path = getCurrentPath();

  if (path === '/profile' && !currentUser) {
    openAuthModal({
      onSuccess: () => navigate('/profile'),
      onClose: () => navigate('/'),
    });
    return;
  }

  app.replaceChildren();

  const header = createHeader({
    currentPath: path,
    user: currentUser,
    onNavigate: navigate,
  });

  const mainContainer = document.createElement('main');
  app.append(header, mainContainer);

  if (path === '/auction') {
    void renderAuctionHall(mainContainer, currentUser);
  } else if (path === '/profile') {
    if (currentUser) {
      void renderProfilePage(mainContainer, currentUser);
    }
  } else {
    renderAboutPage(mainContainer, navigate);
  }
}

async function init(): Promise<void> {
  currentUser = await getCurrentUser();

  onAuthStateChange((user) => {
    currentUser = user;
    renderApp();
  });

  window.addEventListener('hashchange', renderApp);
  renderApp();
}

void init();
