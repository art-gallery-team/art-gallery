import './profile.css';
import type { User } from '@supabase/supabase-js';
import type { Bid } from '../types';
import { getUserBids } from '../api/bidsApi';
import { getUserPurchases } from '../api/purchasesApi';
import { getFavoriteLots } from '../api/favoritesApi';
import { subscribeToAuctionUpdates } from '../api/realtimeApi';
import { createBidCard } from '../components/bidCard';
import { createPurchaseCard } from '../components/purchaseCard';
import { createLotCard } from '../components/lotCard';
import { createElement } from '../utils/dom';
import { t } from '../utils/i18n';

let unsubscribeProfileRealtime: (() => void) | null = null;

export async function renderProfilePage(container: HTMLElement, user: User): Promise<void> {
  if (unsubscribeProfileRealtime) {
    unsubscribeProfileRealtime();
    unsubscribeProfileRealtime = null;
  }

  container.replaceChildren();
  const loader = createElement('div', 'loader', t('profile.loading'));
  container.append(loader);

  try {
    let [bids, purchases, favorites] = await Promise.all([
      getUserBids(user.id),
      getUserPurchases(user.id),
      getFavoriteLots(user.id),
    ]);
    let currentTab: 'active' | 'history' | 'purchases' | 'favorites' = 'active';
    container.replaceChildren();

    const title = createElement('h1', 'page-title', t('profile.title'));
    const email = createElement('p', 'profile-email', `${t('profile.loggedInAs')}: ${user.email}`);

    const tabsContainer = createElement('div', 'profile-tabs');
    const activeTabBtn = createElement(
      'button',
      'profile-tabs__btn profile-tabs__btn--active',
      t('profile.tabActive')
    );
    const historyTabBtn = createElement('button', 'profile-tabs__btn', t('profile.tabHistory'));
    const purchasesTabBtn = createElement('button', 'profile-tabs__btn', t('profile.tabPurchases'));
    const favTabBtn = createElement('button', 'profile-tabs__btn', t('profile.tabFavorites'));
    tabsContainer.append(activeTabBtn, historyTabBtn, purchasesTabBtn, favTabBtn);

    const listContainer = createElement('div', 'profile-list');

    const renderList = (tab: 'active' | 'history' | 'purchases' | 'favorites'): void => {
      currentTab = tab;
      listContainer.replaceChildren();

      if (tab === 'favorites') {
        listContainer.classList.add('profile-list--wide');
      } else {
        listContainer.classList.remove('profile-list--wide');
      }

      if (tab === 'purchases') {
        if (purchases.length === 0) {
          listContainer.append(createElement('p', 'empty-message', t('profile.noPurchases')));
          return;
        }
        purchases.forEach((purchase) => listContainer.append(createPurchaseCard(purchase)));
        return;
      }

      if (tab === 'favorites') {
        if (favorites.length === 0) {
          listContainer.append(createElement('p', 'empty-message', t('profile.noFavorites')));
          return;
        }
        const grid = createElement('div', 'lots-grid');
        favorites.forEach((lot) =>
          grid.append(createLotCard(lot, user, refreshDataSilently, true, refreshDataSilently))
        );
        listContainer.append(grid);
        return;
      }

      if (bids.length === 0) {
        listContainer.append(createElement('p', 'empty-message', t('profile.noBids')));
        return;
      }

      if (tab === 'active') {
        const activeBids = bids.filter((b) => b.lots?.status === 'active');
        const highestBidsMap = new Map<string, Bid>();
        activeBids.forEach((bid) => {
          if (!bid.lots) return;
          const existing = highestBidsMap.get(bid.lot_id);
          if (!existing || bid.amount > existing.amount) highestBidsMap.set(bid.lot_id, bid);
        });
        const uniqueActiveBids = Array.from(highestBidsMap.values());
        if (uniqueActiveBids.length === 0) {
          listContainer.append(createElement('p', 'empty-message', t('profile.noActiveBids')));
          return;
        }
        uniqueActiveBids.forEach((bid) =>
          listContainer.append(createBidCard(bid, refreshDataSilently))
        );
      } else {
        bids.forEach((bid) => listContainer.append(createBidCard(bid, refreshDataSilently)));
      }
    };

    const refreshDataSilently = async (): Promise<void> => {
      try {
        [bids, purchases, favorites] = await Promise.all([
          getUserBids(user.id),
          getUserPurchases(user.id),
          getFavoriteLots(user.id),
        ]);
        renderList(currentTab);
      } catch (err) {
        console.error('Failed to refresh profile in realtime:', err);
      }
    };

    const resetTabs = () => {
      activeTabBtn.classList.remove('profile-tabs__btn--active');
      historyTabBtn.classList.remove('profile-tabs__btn--active');
      purchasesTabBtn.classList.remove('profile-tabs__btn--active');
      favTabBtn.classList.remove('profile-tabs__btn--active');
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
    favTabBtn.addEventListener('click', () => {
      resetTabs();
      favTabBtn.classList.add('profile-tabs__btn--active');
      renderList('favorites');
    });

    renderList('active');

    container.append(title, email, tabsContainer, listContainer);

    unsubscribeProfileRealtime = subscribeToAuctionUpdates(() => {
      void refreshDataSilently();
    });
  } catch (error) {
    container.replaceChildren();
    container.append(createElement('div', 'error-message', t('profile.error')));
    console.error(error);
  }
}
