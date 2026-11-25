import './Footer.css';
import { createElement } from '../utils/dom';

export function createFooter(onNavigate: (path: string) => void): HTMLElement {
  const footer = createElement('footer', 'app-footer');
  const container = createElement('div', 'app-footer__container');

  const brandCol = createElement('div', 'app-footer__col app-footer__col--brand');
  const logo = createElement('h2', 'app-footer__logo', 'Art Gallery & Auction');
  const mission = createElement(
    'p',
    'app-footer__text',
    'Curated contemporary and fine art auctions. Authentic works with verified provenance.'
  );
  const location = createElement('p', 'app-footer__location', 'Minsk, Belarus');
  brandCol.append(logo, mission, location);

  const navCol = createElement('div', 'app-footer__col');
  const navTitle = createElement('h3', 'app-footer__title', 'Auction & Gallery');
  const navList = createElement('ul', 'app-footer__list');

  const createLink = (text: string, path?: string) => {
    const li = createElement('li', 'app-footer__item');
    const link = createElement('a', 'app-footer__link', text);
    link.href = '#';
    if (path) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate(path);
      });
    }
    li.append(link);
    return li;
  };

  navList.append(
    createLink('Auction Hall', '/auction'),
    createLink('Gallery Preview', '/gallery'),
    createLink('Past Auctions'),
    createLink('About Us', '/')
  );
  navCol.append(navTitle, navList);

  const servicesCol = createElement('div', 'app-footer__col');
  const servicesTitle = createElement('h3', 'app-footer__title', 'Client Services');
  const servicesList = createElement('ul', 'app-footer__list');
  servicesList.append(
    createLink('How to Bid'),
    createLink('Authentication & Provenance'),
    createLink('Consign an Artwork'),
    createLink('Buyer’s Premium & Fees')
  );
  servicesCol.append(servicesTitle, servicesList);

  const contactCol = createElement('div', 'app-footer__col');
  const contactTitle = createElement('h3', 'app-footer__title', 'Contact');
  const contactList = createElement('ul', 'app-footer__list');
  contactList.append(
    createElement('li', 'app-footer__item', 'concierge@artgallery.art'),
    createElement('li', 'app-footer__item', '+375 (29) 123-45-67'),
    createElement('li', 'app-footer__item', 'Mon–Fri: 10:00 – 18:00')
  );
  contactCol.append(contactTitle, contactList);

  container.append(brandCol, navCol, servicesCol, contactCol);

  const subFooter = createElement('div', 'app-footer__sub');
  const copyright = createElement(
    'span',
    'app-footer__copy',
    '© 2026 Art Gallery & Auction. All rights reserved.'
  );

  const legalLinks = createElement('div', 'app-footer__legal');
  const terms = createElement('a', 'app-footer__link', 'Terms of Sale');
  terms.href = '#';
  const privacy = createElement('a', 'app-footer__link', 'Privacy Policy');
  privacy.href = '#';
  legalLinks.append(terms, privacy);

  subFooter.append(copyright, legalLinks);
  footer.append(container, subFooter);

  return footer;
}
