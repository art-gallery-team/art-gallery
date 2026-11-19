import './style.css';
import { renderAuctionHall } from './pages/auction';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  renderAuctionHall(app);
} else {
  console.error('App container not found');
}
