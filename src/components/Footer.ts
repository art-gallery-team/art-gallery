import './Footer.css';
import { createElement } from '../utils/dom';
import { t } from '../utils/i18n';

export function createFooter(onNavigate: (path: string) => void): HTMLElement {
  const footer = createElement('footer', 'app-footer');
  const container = createElement('div', 'app-footer__container');

  const brandCol = createElement('div', 'app-footer__col app-footer__col--brand');
  const logo = createElement('h2', 'app-footer__logo', 'Art Gallery & Auction');
  const mission = createElement('p', 'app-footer__text', t('footer.mission'));
  const location = createElement('p', 'app-footer__location', t('footer.location'));
  brandCol.append(logo, mission, location);

  const navCol = createElement('div', 'app-footer__col');
  const navTitle = createElement('h3', 'app-footer__title', t('footer.navTitle'));
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
    createLink(t('nav.auction'), '/auction'),
    createLink(t('footer.galleryPreview'), '/gallery'),
    createLink(t('footer.pastAuctions')),
    createLink(t('nav.about'), '/')
  );
  navCol.append(navTitle, navList);

  const servicesCol = createElement('div', 'app-footer__col');
  const servicesTitle = createElement('h3', 'app-footer__title', t('footer.servicesTitle'));
  const servicesList = createElement('ul', 'app-footer__list');
  servicesList.append(
    createLink(t('footer.howToBid')),
    createLink(t('footer.authentication')),
    createLink(t('footer.consign')),
    createLink(t('footer.premiumFees'))
  );
  servicesCol.append(servicesTitle, servicesList);

  const contactCol = createElement('div', 'app-footer__col');
  const contactTitle = createElement('h3', 'app-footer__title', t('footer.contactTitle'));
  const contactList = createElement('ul', 'app-footer__list');
  contactList.append(
    createElement('li', 'app-footer__item', 'concierge@artgallery.art'),
    createElement('li', 'app-footer__item', '+375 (29) 123-45-67'),
    createElement('li', 'app-footer__item', t('footer.hours'))
  );
  contactCol.append(contactTitle, contactList);

  container.append(brandCol, navCol, servicesCol, contactCol);

  const subFooter = createElement('div', 'app-footer__sub');
  const copyright = createElement('span', 'app-footer__copy', t('footer.copy'));

  const legalLinks = createElement('div', 'app-footer__legal');
  const terms = createElement('a', 'app-footer__link', t('footer.terms'));
  terms.href = '#';
  const privacy = createElement('a', 'app-footer__link', t('footer.privacy'));
  privacy.href = '#';
  legalLinks.append(terms, privacy);

  subFooter.append(copyright, legalLinks);
  footer.append(container, subFooter);

  return footer;
}
