import './about.css';

export function renderAboutPage(container: HTMLElement, onNavigate: (path: string) => void): void {
  container.replaceChildren();

  const page = document.createElement('section');
  page.className = 'about-page';

  // Hero block
  const hero = document.createElement('div');
  hero.className = 'about-hero';

  const badge = document.createElement('span');
  badge.className = 'about-hero__badge';
  badge.textContent = 'Contemporary Art Online Auction';

  const title = document.createElement('h1');
  title.className = 'about-hero__title';
  title.textContent = 'Curated Masterpieces. Transparent Live Bidding.';

  const description = document.createElement('p');
  description.className = 'about-hero__desc';
  description.textContent =
    'Art Gallery & Auction is a fullstack web platform where collectors can explore iconic artworks, filter lots by style and price, save favorites, and compete in real-time bidding.';

  const actions = document.createElement('div');
  actions.className = 'about-hero__actions';

  const galleryBtn = document.createElement('button');
  galleryBtn.type = 'button';
  galleryBtn.className = 'about-hero__cta';
  galleryBtn.textContent = 'Explore Gallery →';
  galleryBtn.addEventListener('click', () => onNavigate('/gallery'));

  const auctionBtn = document.createElement('button');
  auctionBtn.type = 'button';
  auctionBtn.className = 'about-hero__cta about-hero__cta--secondary';
  auctionBtn.textContent = 'Enter Auction Hall';
  auctionBtn.addEventListener('click', () => onNavigate('/auction'));

  actions.append(galleryBtn, auctionBtn);
  hero.append(badge, title, description, actions);

  // Team block
  const teamSection = document.createElement('div');
  teamSection.className = 'about-team';

  const teamTitle = document.createElement('h2');
  teamTitle.className = 'about-team__title';
  teamTitle.textContent = 'Meet the Team';

  const teamGrid = document.createElement('div');
  teamGrid.className = 'about-team__grid';

  const members = [
    {
      name: 'Marina',
      github: 'dromari',
      url: 'https://github.com/dromari',
      role: 'Fullstack & Backend Integration',
      contribution:
        'Designed PostgreSQL schema, Row Level Security (RLS) policies, and seed data in Supabase. Implemented authentication flow, form validation with unit tests, routing, and the About Us page.',
    },
    {
      name: 'Aliaksei',
      github: 'direktor3092',
      url: 'https://github.com/direktor3092',
      role: 'Frontend & Auction Logic',
      contribution:
        'Built core auction business logic (bid validation, status calculation, checkout totals with promo codes, filtering, and currency formatting) with Vitest unit tests and the Auction Hall UI.',
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
