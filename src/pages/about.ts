import './about.css';
import { t } from '../utils/i18n';

export function renderAboutPage(container: HTMLElement, onNavigate: (path: string) => void): void {
  container.replaceChildren();

  const page = document.createElement('section');
  page.className = 'about-page';

  // Hero block
  const hero = document.createElement('div');
  hero.className = 'about-hero';

  const badge = document.createElement('span');
  badge.className = 'about-hero__badge';
  badge.textContent = t('about.badge');

  const title = document.createElement('h1');
  title.className = 'about-hero__title';
  title.textContent = t('about.title');

  const description = document.createElement('p');
  description.className = 'about-hero__desc';
  description.textContent = t('about.desc');

  const actions = document.createElement('div');
  actions.className = 'about-hero__actions';

  const galleryBtn = document.createElement('button');
  galleryBtn.type = 'button';
  galleryBtn.className = 'about-hero__cta';
  galleryBtn.textContent = t('about.ctaGallery');
  galleryBtn.addEventListener('click', () => onNavigate('/gallery'));

  const auctionBtn = document.createElement('button');
  auctionBtn.type = 'button';
  auctionBtn.className = 'about-hero__cta about-hero__cta--secondary';
  auctionBtn.textContent = t('about.ctaAuction');
  auctionBtn.addEventListener('click', () => onNavigate('/auction'));

  actions.append(galleryBtn, auctionBtn);
  hero.append(badge, title, description, actions);

  // Team block
  const teamSection = document.createElement('div');
  teamSection.className = 'about-team';

  const teamTitle = document.createElement('h2');
  teamTitle.className = 'about-team__title';
  teamTitle.textContent = t('about.teamTitle');

  const teamGrid = document.createElement('div');
  teamGrid.className = 'about-team__grid';

  const members = [
    {
      name: t('about.marina.name'),
      github: 'dromari',
      url: 'https://github.com/dromari',
      role: t('about.marina.role'),
      contribution: t('about.marina.contrib'),
    },
    {
      name: t('about.aliaksei.name'),
      github: 'direktor3092',
      url: 'https://github.com/direktor3092',
      role: t('about.aliaksei.role'),
      contribution: t('about.aliaksei.contrib'),
    },
  ];

  members.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'team-card';

    const header = document.createElement('div');
    header.className = 'team-card__header';

    const memberName = document.createElement('h3');
    memberName.className = 'team-card__name';
    memberName.textContent = member.name;

    const githubLink = document.createElement('a');
    githubLink.className = 'team-card__github';
    githubLink.href = member.url;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.textContent = `@${member.github}`;

    header.append(memberName, githubLink);

    const role = document.createElement('p');
    role.className = 'team-card__role';
    role.textContent = member.role;

    const contribution = document.createElement('p');
    contribution.className = 'team-card__contrib';
    contribution.textContent = member.contribution;

    card.append(header, role, contribution);
    teamGrid.append(card);
  });

  teamSection.append(teamTitle, teamGrid);
  page.append(hero, teamSection);
  container.append(page);
}
