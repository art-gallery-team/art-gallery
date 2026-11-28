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
    'gallery.searchPlaceholder': 'Search by title or artist...',
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
    'auction.loading': 'Loading masterpieces...',
    'auction.sortDefault': 'Default (Active first)',
    'auction.sortPriceDesc': 'Price: High to Low',
    'auction.sortPriceAsc': 'Price: Low to High',
    'auction.empty': 'No lots found matching your criteria.',
    'auction.error': 'Failed to load lots. Please try again later.',

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
    'auth.passwordPlaceholder': 'At least 6 characters',
    'auth.creatingAccount': 'Creating account...',
    'auth.signingIn': 'Signing in...',
    'auth.failed': 'Authentication failed. Please try again.',

    // Bid
    'bid.title': 'Bid for',
    'bid.current': 'Current',
    'bid.minStep': 'Min step',
    'bid.cancel': 'Cancel',
    'bid.confirm': 'Confirm Bid',
    'bid.processing': 'Processing...',
    'bid.unknownError': 'Unknown error',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.hammerPrice': 'Hammer Price',
    'checkout.buyersPremium': "Buyer's Premium (10%)",
    'checkout.havePromo': 'Have a promo code?',
    'checkout.promoPlaceholder': 'Enter code (e.g., VIPART)',
    'checkout.total': 'Total',
    'checkout.waived': 'Waived (VIP)',
    'checkout.confirm': 'Confirm Purchase',

    //Toast
    'toast.favAdded': 'Added to favorites!',
    'toast.favRemoved': 'Removed from favorites',
    'toast.favError': 'Failed to update favorites',
    'toast.bidSuccess': 'Bid placed successfully!',

    // About
    'about.marina.name': 'Marina',
    'about.marina.role': 'Fullstack & Backend Integration',
    'about.marina.contrib':
      'Designed PostgreSQL schema, RLS policies, and seed data in Supabase. Implemented authentication, Favorites API, Supabase Realtime live updates, data mappers with unit tests, routing, responsive header with burger menu, About Us and public Gallery pages, artwork modal with image slider, light/dark theme switcher, and EN/RU/BE localization.',

    'about.aliaksei.name': 'Aliaksei',
    'about.aliaksei.role': 'Frontend & Auction Logic',
    'about.aliaksei.contrib':
      'Configured project setup & CI/CD (Vite, TypeScript, ESLint, Husky, GitHub Actions). Built core auction business logic with Vitest TDD (bid validation, checkout with promo codes, filtering, currency formatting). Developed custom APIs (lots, bids, purchases) and a custom debounce utility. Implemented the Auction Hall UI with search/sorting, bidding & checkout modals, the Personal Cabinet, Favorites UI integration, and Realtime-driven UI updates. Created the ZOLATA brand identity, global footer, and toast notification system.',

    // Profile
    'profile.loading': 'Loading your profile...',
    'profile.title': 'Personal Cabinet',
    'profile.loggedInAs': 'Logged in as',
    'profile.tabActive': 'Active Bids',
    'profile.tabHistory': 'Bidding History',
    'profile.tabPurchases': 'My Purchases',
    'profile.tabFavorites': 'Favorites',
    'profile.noPurchases': 'No purchases yet.',
    'profile.noFavorites': 'No favorites yet.',
    'profile.noBids': 'You have no bids yet.',
    'profile.noActiveBids': 'No active bids.',
    'profile.error': 'Failed to load profile data.',

    // Footer
    'footer.mission':
      'Curated contemporary and fine art auctions. Authentic works with verified provenance.',
    'footer.location': 'Minsk, Belarus',
    'footer.navTitle': 'Auction & Gallery',
    'footer.galleryPreview': 'Gallery Preview',
    'footer.pastAuctions': 'Past Auctions',
    'footer.servicesTitle': 'Client Services',
    'footer.howToBid': 'How to Bid',
    'footer.authentication': 'Authentication & Provenance',
    'footer.consign': 'Consign an Artwork',
    'footer.premiumFees': 'Buyer’s Premium & Fees',
    'footer.contactTitle': 'Contact',
    'footer.hours': 'Mon–Fri: 10:00 – 18:00',
    'footer.copy': '© 2026 Art Gallery & Auction. All rights reserved.',
    'footer.terms': 'Terms of Sale',
    'footer.privacy': 'Privacy Policy',

    //bidCard
    'bidCard.myBid': 'My Bid',
    'bidCard.leading': 'Leading',
    'bidCard.outbid': 'Outbid',
    'bidCard.checkout': 'Checkout',
    'bidCard.placed': 'Placed',
    'bidCard.won': 'Won',
    'toast.purchaseSuccess': 'Lot purchased successfully!',
    'toast.purchaseError': 'Failed to complete purchase. Try again.',

    //purchaseCard
    'purchaseCard.unknownLot': 'Unknown Lot',
    'purchaseCard.paid': 'Paid',
    'purchaseCard.promo': 'Promo',
    'purchaseCard.purchased': 'Purchased',
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
    'auction.loading': 'Загрузка шедевров...',
    'auction.sortDefault': 'По умолчанию (сначала активные)',
    'auction.sortPriceDesc': 'Цена: по убыванию',
    'auction.sortPriceAsc': 'Цена: по возрастанию',
    'auction.empty': 'Лоты по вашему запросу не найдены.',
    'auction.error': 'Не удалось загрузить лоты. Попробуйте позже.',

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
    'auth.passwordPlaceholder': 'Минимум 6 символов',
    'auth.creatingAccount': 'Создание аккаунта...',
    'auth.signingIn': 'Вход...',
    'auth.failed': 'Ошибка авторизации. Попробуйте снова.',

    // Bid
    'bid.title': 'Ставка на',
    'bid.current': 'Текущая',
    'bid.minStep': 'Мин. шаг',
    'bid.cancel': 'Отмена',
    'bid.confirm': 'Подтвердить ставку',
    'bid.processing': 'Обработка...',
    'bid.unknownError': 'Неизвестная ошибка',

    // Checkout
    'checkout.title': 'Оформление покупки',
    'checkout.hammerPrice': 'Цена лота',
    'checkout.buyersPremium': 'Комиссия покупателя (10%)',
    'checkout.havePromo': 'Есть промокод?',
    'checkout.promoPlaceholder': 'Введите код (например, VIPART)',
    'checkout.total': 'Итого',
    'checkout.waived': 'Отменена (VIP)',
    'checkout.confirm': 'Подтвердить покупку',

    //Toast
    'toast.favAdded': 'Добавлено в избранное!',
    'toast.favRemoved': 'Удалено из избранного',
    'toast.favError': 'Не удалось обновить избранное',
    'toast.bidSuccess': 'Ставка успешно сделана!',

    // About
    'about.marina.name': 'Марина',
    'about.marina.role': 'Fullstack и интеграция с бэкендом',
    'about.marina.contrib':
      'Спроектировала схему PostgreSQL, политики безопасности RLS и сиды в Supabase. Реализовала авторизацию, Favorites API, обновления в реальном времени (Supabase Realtime), мапперы данных с юнит-тестами, роутинг, адаптивный хедер с бургер-меню, страницы «О проекте» и публичной галереи, модальное окно лота со слайдером, смену светлой/тёмной темы и мультиязычность (EN/RU/BE).',
    'about.aliaksei.name': 'Алексей',
    'about.aliaksei.role': 'Frontend и логика аукциона',
    'about.aliaksei.contrib':
      'Настроил сборку и CI/CD (Vite, TypeScript, ESLint, Husky, GitHub Actions). Разработал бизнес-логику аукциона по TDD с юнит-тестами Vitest (валидация ставок, расчет чека с промокодами, фильтрация). Написал API для работы с лотами, ставками и покупками, а также кастомную утилиту debounce. Реализовал каталог Аукционного зала с поиском и сортировкой, модалки ставок и оформления покупки (Checkout), Личный кабинет, интеграцию интерфейса Избранного и обновление UI на основе Realtime. Создал фирменный стиль ZOLATA (логотип, фавикон), глобальный футер и систему уведомлений (тосты).',

    // Profile
    'profile.loading': 'Загрузка профиля...',
    'profile.title': 'Личный кабинет',
    'profile.loggedInAs': 'Вы вошли как',
    'profile.tabActive': 'Активные ставки',
    'profile.tabHistory': 'История ставок',
    'profile.tabPurchases': 'Мои покупки',
    'profile.tabFavorites': 'Избранное',
    'profile.noPurchases': 'Покупок пока нет.',
    'profile.noFavorites': 'В избранном пока пусто.',
    'profile.noBids': 'У вас пока нет ставок.',
    'profile.noActiveBids': 'Активных ставок нет.',
    'profile.error': 'Не удалось загрузить данные профиля.',

    // Footer
    'footer.mission':
      'Кураторские аукционы современного и изобразительного искусства. Подлинные работы с проверенным провенансом.',
    'footer.location': 'Минск, Беларусь',
    'footer.navTitle': 'Аукцион и галерея',
    'footer.galleryPreview': 'Обзор галереи',
    'footer.pastAuctions': 'Прошедшие аукционы',
    'footer.servicesTitle': 'Клиентский сервис',
    'footer.howToBid': 'Как делать ставки',
    'footer.authentication': 'Экспертиза и провенанс',
    'footer.consign': 'Выставить работу на торги',
    'footer.premiumFees': 'Комиссия покупателя и сборы',
    'footer.contactTitle': 'Контакты',
    'footer.hours': 'Пн–Пт: 10:00 – 18:00',
    'footer.copy': '© 2026 Art Gallery & Auction. Все права защищены.',
    'footer.terms': 'Условия продажи',
    'footer.privacy': 'Политика конфиденциальности',

    //bidCard
    'bidCard.myBid': 'Моя ставка',
    'bidCard.leading': 'Лидирует',
    'bidCard.outbid': 'Перебита',
    'bidCard.checkout': 'Оформить покупку',
    'bidCard.placed': 'Сделана',
    'bidCard.won': 'Выиграна',
    'toast.purchaseSuccess': 'Лот успешно куплен!',
    'toast.purchaseError': 'Не удалось завершить покупку. Попробуйте снова.',

    //purchaseCard
    'purchaseCard.unknownLot': 'Неизвестный лот',
    'purchaseCard.paid': 'Оплачено',
    'purchaseCard.promo': 'Промокод',
    'purchaseCard.purchased': 'Куплено',
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
    'gallery.subtitle': 'Пастаянная і актуальная экспазіцыя. Вывучыце творы ў дэталях.',
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
    'lot.currentPrice': 'Актуальная цана',
    'lot.placeBid': 'Зрабіць стаўку',
    'lot.sold': 'Прададзена',
    'lot.closed': 'Закрыты',
    'lot.leading': 'Ваша стаўка лідзіруе',
    'lot.viewDetails': 'Падрабязней',
    'auction.loading': 'Загрузка шэдэўраў...',
    'auction.sortDefault': 'Па змаўчанні (спачатку актыўныя)',
    'auction.sortPriceDesc': 'Цана: па змяншэнні',
    'auction.sortPriceAsc': 'Цана: па ўзрастанні',
    'auction.empty': 'Лоты па вашым запыце не знойдзены.',
    'auction.error': 'Не ўдалося загрузіць лоты. Паспрабуйце пазней.',

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
    'auth.passwordPlaceholder': 'Мінімум 6 сімвалаў',
    'auth.creatingAccount': 'Стварэнне акаўнта...',
    'auth.signingIn': 'Уваход...',
    'auth.failed': 'Памылка аўтарызацыі. Паспрабуйце зноў.',

    // Bid
    'bid.title': 'Стаўка на',
    'bid.current': 'Актуальная',
    'bid.minStep': 'Мін. крок',
    'bid.cancel': 'Адмена',
    'bid.confirm': 'Пацвердзіць стаўку',
    'bid.processing': 'Апрацоўка...',
    'bid.unknownError': 'Невядомая памылка',

    // Checkout
    'checkout.title': 'Афармленне пакупкі',
    'checkout.hammerPrice': 'Цана лота',
    'checkout.buyersPremium': 'Камісія пакупніка (10%)',
    'checkout.havePromo': 'Ёсць промакод?',
    'checkout.promoPlaceholder': 'Увядзіце код (напрыклад, VIPART)',
    'checkout.total': 'Разам',
    'checkout.waived': 'Адменена (VIP)',
    'checkout.confirm': 'Пацвердзіць куплю',

    //Toast
    'toast.favAdded': 'Дададзена ў абранае!',
    'toast.favRemoved': 'Выдалена з абранага',
    'toast.favError': 'Не ўдалося абнавіць абранае',
    'toast.bidSuccess': 'Стаўка паспяхова зроблена!',

    // About
    'about.marina.name': 'Марына',
    'about.marina.role': 'Fullstack і інтэграцыя з бэкендам',
    'about.marina.contrib':
      'Спраектавала схему PostgreSQL, палітыкі бяспекі RLS і сіды ў Supabase. Рэалізавала аўтарызацыю, Favorites API, абнаўленні ў рэальным часе (Supabase Realtime), маперы даных з юніт-тэстамі, роўтынг, адаптыўны хэдэр з бургер-меню, старонкі «Пра праект» і публічнай галерэі, мадальнае акно лота са слайдэрам, змену светлай/цёмнай тэмы і шматмоўнасць (EN/RU/BE).',
    'about.aliaksei.name': 'Аляксей',
    'about.aliaksei.role': 'Frontend і логіка аўкцыёну',
    'about.aliaksei.contrib':
      'Наладзіў зборку і CI/CD (Vite, TypeScript, ESLint, Husky, GitHub Actions). Распрацаваў бізнес-логіку аўкцыёну па TDD з юніт-тэстамі Vitest (валідацыя ставак, разлік чэка з промакодамі, фільтрацыя). Напісаў API для працы з лотамі, стаўкамі і куплямі, а таксама кастомную ўтыліту debounce. Рэалізаваў каталог Аўкцыённай залы з пошукам і сартаваннем, мадалкі ставак і афармлення куплі (Checkout), Асабісты кабінет, інтэграцыю інтэрфейсу Абранага і абнаўленне UI на аснове Realtime. Стварыў фірмовы стыль ZOLATA (лагатып, фавікон), глабальны футар і сістэму апавяшчэнняў (тосты).',

    // Profile
    'profile.loading': 'Загрузка профілю...',
    'profile.title': 'Асабісты кабінет',
    'profile.loggedInAs': 'Вы ўвайшлі як',
    'profile.tabActive': 'Актыўныя стаўкі',
    'profile.tabHistory': 'Гісторыя ставак',
    'profile.tabPurchases': 'Мае пакупкі',
    'profile.tabFavorites': 'Абранае',
    'profile.noPurchases': 'Пакупак пакуль няма.',
    'profile.noFavorites': 'У абраным пакуль пуста.',
    'profile.noBids': 'У вас пакуль няма ставак.',
    'profile.noActiveBids': 'Актыўных ставак няма.',
    'profile.error': 'Не ўдалося загрузіць даныя профілю.',

    // Footer
    'footer.mission':
      'Куратарскія аўкцыёны сучаснага і выяўленчага мастацтва. Сапраўдныя творы з правераным правенансам.',
    'footer.location': 'Мінск, Беларусь',
    'footer.navTitle': 'Аўкцыён і галерэя',
    'footer.galleryPreview': 'Агляд галерэі',
    'footer.pastAuctions': 'Мінулыя аўкцыёны',
    'footer.servicesTitle': 'Кліенцкі сэрвіс',
    'footer.howToBid': 'Як рабіць стаўкі',
    'footer.authentication': 'Экспертыза і правенанс',
    'footer.consign': 'Выставіць твор на таргі',
    'footer.premiumFees': 'Камісія пакупніка і зборы',
    'footer.contactTitle': 'Кантакты',
    'footer.hours': 'Пн–Пт: 10:00 – 18:00',
    'footer.copy': '© 2026 Art Gallery & Auction. Усе правы абаронены.',
    'footer.terms': 'Умовы продажу',
    'footer.privacy': 'Палітыка прыватнасці',

    //bidCard
    'bidCard.myBid': 'Мая стаўка',
    'bidCard.leading': 'Лідзіруе',
    'bidCard.outbid': 'Перабіта',
    'bidCard.checkout': 'Аформіць куплю',
    'bidCard.placed': 'Зроблена',
    'bidCard.won': 'Выйграна',
    'toast.purchaseSuccess': 'Лот паспяхова набыты!',
    'toast.purchaseError': 'Не ўдалося завяршыць куплю. Паспрабуйце зноў.',

    //purchaseCard
    'purchaseCard.unknownLot': 'Невядомы лот',
    'purchaseCard.paid': 'Аплачана',
    'purchaseCard.promo': 'Промакод',
    'purchaseCard.purchased': 'Набыта',
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
