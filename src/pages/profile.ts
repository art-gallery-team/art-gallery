import './profile.css';
import type { User } from '@supabase/supabase-js';
import type { Bid } from '../types';
import { getUserBids } from '../api/bidsApi';
import { createBidCard } from '../components/bidCard';
import { createElement } from '../utils/dom';

export async function renderProfilePage(container: HTMLElement, user: User): Promise<void> {
  container.replaceChildren();
  const loader = createElement('div', 'loader', 'Loading your profile...');
  container.append(loader);

  try {
    const bids = await getUserBids(user.id);
    container.replaceChildren();

    const title = createElement('h1', 'page-title', 'Personal Cabinet');
    const email = createElement('p', 'profile-email', `Logged in as: ${user.email}`);

    const tabsContainer = createElement('div', 'profile-tabs');
    const activeTabBtn = createElement(
      'button',
      'profile-tabs__btn profile-tabs__btn--active',
      'Active Bids'
    );
    const historyTabBtn = createElement('button', 'profile-tabs__btn', 'Bidding History');
    tabsContainer.append(activeTabBtn, historyTabBtn);

    const listContainer = createElement('div', 'profile-list');

    const renderList = (tab: 'active' | 'history') => {
      listContainer.replaceChildren();

      if (bids.length === 0) {
        listContainer.append(createElement('p', 'empty-message', 'You have no bids yet.'));
        return;
      }

      if (tab === 'active') {
        const activeBids = bids.filter((b) => b.lots?.status === 'active');

        const highestBidsMap = new Map<string, Bid>();
        activeBids.forEach((bid) => {
          if (!bid.lots) return;
          const existing = highestBidsMap.get(bid.lot_id);
          if (!existing || bid.amount > existing.amount) {
            highestBidsMap.set(bid.lot_id, bid);
          }
        });

        const uniqueActiveBids = Array.from(highestBidsMap.values());

        if (uniqueActiveBids.length === 0) {
          listContainer.append(createElement('p', 'empty-message', 'No active bids.'));
          return;
        }
        uniqueActiveBids.forEach((bid) => listContainer.append(createBidCard(bid)));
      } else {
        bids.forEach((bid) => listContainer.append(createBidCard(bid)));
      }
    };

    activeTabBtn.addEventListener('click', () => {
      activeTabBtn.classList.add('profile-tabs__btn--active');
      historyTabBtn.classList.remove('profile-tabs__btn--active');
      renderList('active');
    });

    historyTabBtn.addEventListener('click', () => {
      historyTabBtn.classList.add('profile-tabs__btn--active');
      activeTabBtn.classList.remove('profile-tabs__btn--active');
      renderList('history');
    });

    renderList('active');

    container.append(title, email, tabsContainer, listContainer);
  } catch (error) {
    container.replaceChildren();
    container.append(createElement('div', 'error-message', 'Failed to load profile data.'));
    console.error(error);
  }
}
