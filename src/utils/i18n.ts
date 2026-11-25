export type Language = 'en' | 'ru' | 'be';

const STORAGE_KEY = 'art-gallery-lang';
const LANGUAGES: Language[] = ['en', 'ru', 'be'];

const translations = {
  en: {
    // Header & Navigation
    'nav.about': 'About Us',
    'nav.gallery': 'Gallery',
    'nav.auction': 'Auction Hall',
    'nav.profile': 'Profile',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'header.collector': 'Collector',
    'theme.light': '☀ Light',
    'theme.dark': '☾ Dark',

    // About Page
    'about.badge': 'Contemporary Art Online Auction',
    'about.title': 'Curated Masterpieces. Transparent Live Bidding.',
    'about.desc':
      'Art Gallery & Auction is a fullstack web platform where collectors can explore iconic artworks, filter lots by style and price, save favorites, and compete in real-time bidding.',
    'about.ctaGallery': 'Explore Gallery →',
    'about.ctaAuction': 'Enter Auction Hall',
    'about.teamTitle': 'Meet the Team',

    // Gallery Page
    'gallery.title': 'Art Gallery',
    'gallery.subtitle': 'Permanent & current exhibition collection. Explore artworks in detail.',
    'gallery.ctaAuction': 'Enter Auction Hall →',
    'gallery.searchPlaceholder': 'Search by artwork title or artist...',
    'gallery.allStyles': 'All Styles',
    'gallery.loading': 'Loading exhibition...',
    'gallery.empty': 'No artworks match your filter criteria.',
    'gallery.error': 'Failed to load gallery artworks. Please try again later.',
    'gallery.viewDetails': 'View Details',

    // Auction Hall & Lot Card
    'auction.title': 'Auction Hall',
    'auction.searchPlaceholder': 'Search lots by title or artist...',
    'auction.allStatuses': 'All Statuses',
    'auction.statusActive': 'Active',
    'auction.statusSold': 'Sold',
    'lot.currentPrice': 'Current Price',
    'lot.placeBid': 'Place a Bid',
    'lot.sold': 'Sold',
    'lot.closed': 'Closed',
    'lot.leading': 'You are leading',
    'lot.viewDetails': 'View Details',

    // Artwork Modal
    'modal.inAuction': 'In Auction',
    'modal.sold': 'Sold',
    'modal.closed': 'Closed',
    'modal.by': 'by',
    'modal.year': 'Year',
    'modal.style': 'Style',
    'modal.noDesc': 'No detailed curatorial description provided for this artwork.',
    'modal.startPrice': 'Start Price',
    'modal.minStep': 'Min Step',
    'modal.goToAuction': 'Go to Auction Hall',

    // Auth Modal
    'auth.loginTitle': 'Sign In',
    'auth.loginSubtitle': 'Sign in to place bids and manage your favorite artworks',
    'auth.registerTitle': 'Create Account',
    'auth.registerSubtitle': 'Register to participate in live contemporary art auctions',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signUp': 'Sign Up',
    'auth.noAccount': "Don't have an account? ",
    'auth.hasAccount': 'Already have an account? ',
  },
  ru: {
    // Header & Navigation
    'nav.about': 'О проекте',
    'nav.gallery': 'Галерея',
    'nav.auction': 'Аукцион',
    'nav.profile': 'Профиль',
    'auth.signIn': 'Войти',
    'auth.signOut': 'Выйти',
    'header.collector': 'Коллекционер',
    'theme.light': '☀ Светлая',
    'theme.dark': '☾ Тёмная',

    // About Page
    'about.badge': 'Онлайн-аукцион современного искусства',
    'about.title': 'Избранные шедевры. Прозрачные живые торги.',
    'about.desc':
      'Art Gallery & Auction — веб-платформа, где коллекционеры могут изучать авторские работы, фильтровать лоты по стилю и цене, сохранять избранное и участвовать в торгах в реальном времени.',
    'about.ctaGallery': 'Открыть галерею →',
    'about.ctaAuction': 'В аукционный зал',
    'about.teamTitle': 'Команда проекта',

    // Gallery Page
    'gallery.title': 'Художественная галерея',
    'gallery.subtitle': 'Постоянная и текущая экспозиция. Изучите работы в деталях.',
    'gallery.ctaAuction': 'В аукционный зал →',
    'gallery.searchPlaceholder': 'Поиск по названию или автору...',
    'gallery.allStyles': 'Все стили',
    'gallery.loading': 'Загрузка экспозиции...',
    'gallery.empty': 'По вашему запросу работ не найдено.',
    'gallery.error': 'Не удалось загрузить работы. Попробуйте позже.',
    'gallery.viewDetails': 'Подробнее',

    // Auction Hall & Lot Card
    'auction.title': 'Аукционный зал',
    'auction.searchPlaceholder': 'Поиск лотов по названию или автору...',
    'auction.allStatuses': 'Все статусы',
    'auction.statusActive': 'Активные',
    'auction.statusSold': 'Проданные',
    'lot.currentPrice': 'Текущая цена',
    'lot.placeBid': 'Сделать ставку',
    'lot.sold': 'Продано',
    'lot.closed': 'Закрыт',
    'lot.leading': 'Ваша ставка лидирует',
    'lot.viewDetails': 'Подробнее',

    // Artwork Modal
    'modal.inAuction': 'На аукционе',
    'modal.sold': 'Продано',
    'modal.closed': 'Закрыт',
    'modal.by': 'Автор:',
    'modal.year': 'Год',
    'modal.style': 'Стиль',
    'modal.noDesc': 'Описание для этой работы пока не добавлено.',
    'modal.startPrice': 'Стартовая цена',
    'modal.minStep': 'Мин. шаг',
    'modal.goToAuction': 'Перейти в аукцион',

    // Auth Modal
    'auth.loginTitle': 'Вход в аккаунт',
    'auth.loginSubtitle': 'Войдите, чтобы делать ставки и сохранять работы в избранное',
    'auth.registerTitle': 'Регистрация',
    'auth.registerSubtitle': 'Создайте аккаунт для участия в онлайн-аукционах искусства',
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.signUp': 'Зарегистрироваться',
    'auth.noAccount': 'Нет аккаунта? ',
    'auth.hasAccount': 'Уже есть аккаунт? ',
  },
  be: {
    // Header & Navigation
    'nav.about': 'Пра праект',
    'nav.gallery': 'Галерэя',
    'nav.auction': 'Аўкцыён',
    'nav.profile': 'Профіль',
    'auth.signIn': 'Увайсці',
    'auth.signOut': 'Выйсці',
    'header.collector': 'Калекцыянер',
    'theme.light': '☀ Светлая',
    'theme.dark': '☾ Цёмная',

    // About Page
    'about.badge': 'Анлайн-аўкцыён сучаснага мастацтва',
    'about.title': 'Выбраныя шэдэўры. Празрыстыя жывыя таргі.',
    'about.desc':
      'Art Gallery & Auction — вэб-платформа, дзе калекцыянеры могуць вывучаць аўтарскія творы, фільтраваць лоты па стылі і цане, захоўваць абранае і ўдзельнічаць у таргах у рэальным часе.',
    'about.ctaGallery': 'Адкрыць галерэю →',
    'about.ctaAuction': 'У аўкцыённую залу',
    'about.teamTitle': 'Каманда праекта',

    // Gallery Page
    'gallery.title': 'Мастацкая галерэя',
    'gallery.subtitle': 'Пастаянная і бягучая экспазіцыя. Вывучыце творы ў дэталях.',
    'gallery.ctaAuction': 'У аўкцыённую залу →',
    'gallery.searchPlaceholder': 'Пошук па назве або аўтару...',
    'gallery.allStyles': 'Усе стылі',
    'gallery.loading': 'Загрузка экспазіцыі...',
    'gallery.empty': 'Па вашым запыце твораў не знойдзена.',
    'gallery.error': 'Не ўдалося загрузіць творы. Паспрабуйце пазней.',
    'gallery.viewDetails': 'Падрабязней',

    // Auction Hall & Lot Card
    'auction.title': 'Аўкцыённая зала',
    'auction.searchPlaceholder': 'Пошук лотаў па назве або аўтару...',
    'auction.allStatuses': 'Усе статусы',
    'auction.statusActive': 'Актыўныя',
    'auction.statusSold': 'Прададзеныя',
    'lot.currentPrice': 'Бягучая цана',
    'lot.placeBid': 'Зрабіць стаўку',
    'lot.sold': 'Прададзена',
    'lot.closed': 'Закрыты',
    'lot.leading': 'Ваша стаўка лідзіруе',
    'lot.viewDetails': 'Падрабязней',

    // Artwork Modal
    'modal.inAuction': 'На аўкцыёне',
    'modal.sold': 'Прададзена',
    'modal.closed': 'Закрыты',
    'modal.by': 'Аўтар:',
    'modal.year': 'Год',
    'modal.style': 'Стыль',
    'modal.noDesc': 'Апісанне для гэтага твора пакуль не дададзена.',
    'modal.startPrice': 'Стартавая цана',
    'modal.minStep': 'Мін. крок',
    'modal.goToAuction': 'Перайсці ў аўкцыён',

    // Auth Modal
    'auth.loginTitle': 'Уваход у акаўнт',
    'auth.loginSubtitle': 'Увайдзіце, каб рабіць стаўкі і захоўваць творы ў абранае',
    'auth.registerTitle': 'Рэгістрацыя',
    'auth.registerSubtitle': 'Стварыце акаўнт для ўдзелу ў анлайн-аўкцыёнах мастацтва',
    'auth.email': 'Электронная пошта',
    'auth.password': 'Пароль',
    'auth.signUp': 'Зарэгістравацца',
    'auth.noAccount': 'Няма акаўнта? ',
    'auth.hasAccount': 'Ужо ёсць акаўнт? ',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

type LanguageListener = (lang: Language) => void;
const listeners = new Set<LanguageListener>();

export function getSavedLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'ru' || saved === 'be' ? saved : 'en';
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach((listener) => listener(lang));
}

export function toggleLanguage(): Language {
  const current = getSavedLanguage();
  const nextIndex = (LANGUAGES.indexOf(current) + 1) % LANGUAGES.length;
  const next = LANGUAGES[nextIndex];
  setLanguage(next);
  return next;
}

export function onLanguageChange(listener: LanguageListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function t(key: TranslationKey): string {
  const lang = getSavedLanguage();
  return translations[lang][key] ?? translations.en[key] ?? key;
}
