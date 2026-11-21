import type { User } from '@supabase/supabase-js';
import './style.css';
import { getCurrentUser, onAuthStateChange } from './api/authApi';
import { openAuthModal } from './components/AuthModal';
import { createHeader } from './components/Header';
import { renderAboutPage } from './pages/about';
import { renderAuctionHall } from './pages/auction';

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

function renderProfilePlaceholder(container: HTMLElement): void {
  container.replaceChildren();
  const wrapper = document.createElement('section');
  wrapper.style.maxWidth = '960px';
  wrapper.style.margin = '48px auto';
  wrapper.style.padding = '0 20px';

  const title = document.createElement('h1');
  title.textContent = 'Personal Cabinet';

  const info = document.createElement('p');
  info.style.color = '#9ca3af';
  info.textContent = `Logged in as ${currentUser?.email ?? ''}. Active bids, favorites, and purchases will appear here.`;

  wrapper.append(title, info);
  container.append(wrapper);
}

function renderApp(): void {
  if (!app) return;

  const path = getCurrentPath();

  // Protect private route /profile
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
    void renderAuctionHall(mainContainer);
  } else if (path === '/profile') {
    renderProfilePlaceholder(mainContainer);
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
