import './profile.css';
import type { User } from '@supabase/supabase-js';
import type { Bid } from '../types';
import { getUserBids } from '../api/bidsApi';
import { getUserPurchases } from '../api/purchasesApi';
import { createBidCard } from '../components/bidCard';
import { createPurchaseCard } from '../components/purchaseCard';
import { createElement } from '../utils/dom';

export async function renderProfilePage(container: HTMLElement, user: User): Promise<void> {
  container.replaceChildren();
  const loader = createElement('div', 'loader', 'Loading your profile...');
  container.append(loader);

  try {
    const [bids, purchases] = await Promise.all([getUserBids(user.id), getUserPurchases(user.id)]);

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
    const purchasesTabBtn = createElement('button', 'profile-tabs__btn', 'My Purchases');

    tabsContainer.append(activeTabBtn, historyTabBtn, purchasesTabBtn);

    const listContainer = createElement('div', 'profile-list');

    const renderList = (tab: 'active' | 'history' | 'purchases') => {
      listContainer.replaceChildren();

      if (tab === 'purchases') {
        if (purchases.length === 0) {
          listContainer.append(
            createElement('p', 'empty-message', 'You have not purchased any lots yet.')
          );
          return;
        }
        purchases.forEach((purchase) => listContainer.append(createPurchaseCard(purchase)));
        return;
      }

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
        uniqueActiveBids.forEach((bid) =>
          listContainer.append(createBidCard(bid, () => renderProfilePage(container, user)))
        );
      } else {
        bids.forEach((bid) =>
          listContainer.append(createBidCard(bid, () => renderProfilePage(container, user)))
        );
      }
    };

    const resetTabs = () => {
      activeTabBtn.classList.remove('profile-tabs__btn--active');
      historyTabBtn.classList.remove('profile-tabs__btn--active');
      purchasesTabBtn.classList.remove('profile-tabs__btn--active');
    };

    activeTabBtn.addEventListener('click', () => {
      resetTabs();
      activeTabBtn.classList.add('profile-tabs__btn--active');
      renderList('active');
    });

    historyTabBtn.addEventListener('click', () => {
      resetTabs();
      historyTabBtn.classList.add('profile-tabs__btn--active');
      renderList('history');
    });

    purchasesTabBtn.addEventListener('click', () => {
      resetTabs();
      purchasesTabBtn.classList.add('profile-tabs__btn--active');
      renderList('purchases');
    });

    renderList('active');

    container.append(title, email, tabsContainer, listContainer);
  } catch (error) {
    container.replaceChildren();
    container.append(createElement('div', 'error-message', 'Failed to load profile data.'));
    console.error(error);
  }
}
