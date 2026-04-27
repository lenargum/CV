// CV data — sourced from CV/src/data/*.ts (the "all" profile bullets).
// Markdown links [text](url) are flattened to "text" + a separate href map.
// Keeps **bold** so MarkdownLite can render emphasis.

const stripLinks = (s) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

window.cvData = {
  personalInfo: {
    name: "Lenar Gumerov",
    title: { en: "Software Engineer (Frontend-focused)", ru: "Software Engineer (Frontend-focused)" },
    email: "lenargamgam@gmail.com",
    links: [
      { name: "Telegram",  url: "https://t.me/lenargum",                                    icon: "telegram",  displayText: "@lenargum" },
      { name: "LinkedIn",  url: "https://www.linkedin.com/in/lenar-gumerov-13593b190/",     icon: "linkedin",  displayText: "Lenar Gumerov" },
      { name: "GitHub",    url: "https://github.com/lenargum",                              icon: "github",    displayText: "lenargum" },
      { name: "Instagram", url: "https://www.instagram.com/lenargum",                       icon: "instagram", displayText: "lenargum" },
    ],
  },
  // The "base" summary — what the site shows on /
  summary: {
    en: "Frontend Engineer with 5+ years of experience in UI-heavy products: editors, dashboards, e-commerce, and Telegram Mini Apps.\nFocused on complex interfaces, animations, architecture, design systems, and performance optimization.\nWork end-to-end and take ownership of product outcomes, not just tasks.",
    ru: "Frontend Engineer с 5+ годами опыта в UI-heavy продуктах: редакторы, дашборды, e-commerce и Telegram Mini Apps.\nСпециализация — сложные интерфейсы, анимации, архитектура, дизайн-системы и оптимизация производительности.\nРаботаю с продуктами end-to-end, отвечаю за результат, а не за набор тасков.",
  },
  // Tag groups for the Key Skills section, exactly as defined in CV/src/data/tag-groups.ts.
  // Tags are selected from the "all" profile (manual + extracted).
  skillGroups: [
    { name: { en: "Core",         ru: "Основные" },   tags: ["TypeScript","JavaScript","HTML","CSS","SCSS","Git","CI/CD"] },
    { name: { en: "Frameworks",   ru: "Фреймворки" }, tags: ["React","Redux","Zustand","Next.js","shadcn/ui","Aceternity UI","Vue","Vuex","Pinia","Nuxt","Vuetify"] },
    { name: { en: "Rendering",    ru: "Рендеринг" },  tags: ["SPA","SSR","SSG","CSR"] },
    { name: { en: "Backend",      ru: "Бэкенд" },     tags: ["Go","PostgreSQL","Redis","MongoDB","Docker","REST API","Microservices","WebSockets","TimescaleDB"] },
    { name: { en: "Tools",        ru: "Инструменты" },tags: ["Vite","Vitest","Tailwind","Figma","Telegram Mini Apps (TMA)","PostHog","Motion.js","Paper.js","Chart.js","SVG"] },
    { name: { en: "UX & Visual",  ru: "UX и Визуал" },tags: ["UI/UX","Motion & Interaction Design","Responsive & Fluid Layout Systems","Accessibility"] },
    { name: { en: "Architecture", ru: "Архитектура" },tags: ["Design Systems","Feature-Sliced Design","Atomic Design","Clean Architecture","State Management","Modular Frontend"] },
    { name: { en: "Mobile",       ru: "Мобильные" },  tags: ["Flutter","Android","iOS"] },
    { name: { en: "Principles",   ru: "Принципы" },   tags: ["Web Performance Optimization","SOLID","DRY","KISS","YAGNI"] },
    { name: { en: "Process",      ru: "Процессы" },   tags: ["Agile","Scrum","Lean","Waterfall"] },
  ],
  experiences: [
    {
      icon: "../../assets/icons/cobalt.png",
      company: "Cobalt Lab",
      title: { en: "Senior Frontend Engineer", ru: "Senior Frontend Engineer" },
      location: { en: "Cyprus, Remote", ru: "Кипр, Удалённо" },
      dateStart: new Date(2026, 1, 16),
      dateEnd:   new Date(2026, 3, 17),
      bullets: {
        en: [
          "Joined a real-money iGaming platform mid-redesign with heavy accumulated legacy. Over 2 months: production release plus systematic refactoring delivered alongside feature work.",
          "Key refactors — network layer centralization, splitting 2–3k-line god components and stores (with legacy parity), Vue 3 typing standardization, and security hardening across user flows.",
          "Owned 6+ end-to-end product features across 17 epics — retention events, onboarding, new banner system, referral program, reward claim.",
          "Every feature shipped through a full production cycle — responsive on desktop/tablet/mobile, unit-tested, localized via admin panel, CDN-delivered with WebP + compression, event tracking via PostHog.",
        ],
        ru: [
          "Пришёл на real-money iGaming платформу на этапе редизайна, с тяжёлым накопленным легаси. За 2 месяца: релиз в прод и системный рефакторинг параллельно фичам.",
          "Ключевые рефакторинги — централизация network-слоя, разбиение 2–3к-строчных god-компонентов и сторов (с сохранением legacy-поведения), стандартизация типизации Vue 3 и усиление security в пользовательских флоу.",
          "Самостоятельно вёл 6+ end-to-end продуктовых фич в рамках 17 эпиков — retention-эвенты, онбординг, новая система баннеров, реферальная программа, клейм наград.",
          "Каждая фича уходила в прод по полному циклу — адаптив на десктопе/планшете/мобиле, юнит-тесты, локализация через админку, доставка через CDN с WebP + compression, event-трекинг через PostHog.",
        ],
      },
      tags: ["Vue","TypeScript","Pinia","Vite","Vitest","Tailwind","PostHog"],
    },
    {
      icon: "../../assets/icons/freelance_white.png",
      company: { en: "Freelance", ru: "Фриланс" },
      title:   { en: "Fullstack Engineer (Frontend-focused)", ru: "Fullstack Engineer (Frontend-focused)" },
      location:{ en: "Remote", ru: "Удалённо" },
      dateStart: new Date(2025, 0, 1),
      dateEnd:   new Date(2026, 1, 15),
      bullets: {
        en: [
          "Built product-level web applications and Mini Apps: iGaming, e-commerce, crypto dashboards, and internal tools.",
          "Developed **UI-heavy** interfaces with animations, complex state management, and responsive layout systems.",
          "Delivered fullstack solutions: frontend, backend, CI/CD, and deployment.",
          "Designed application architecture, role-based access systems, real-time updates, and integrations.",
          "Owned quality, performance, and bringing projects to a production-ready state.",
        ],
        ru: [
          "Разрабатывал продуктовые веб-приложения и Mini Apps: iGaming, e-commerce, крипто-дашборды и internal-инструменты.",
          "Создавал **UI-heavy** интерфейсы с анимациями, сложными состояниями и адаптивными layout-системами.",
          "Реализовывал fullstack-решения: frontend + backend + CI/CD + деплой.",
          "Проектировал архитектуру, систему ролей и прав доступа, real-time обновления и интеграции.",
          "Отвечал за качество, производительность и доведение проектов до рабочей прод-стадии.",
        ],
      },
      tags: ["React","Next.js","TypeScript","Tailwind","shadcn/ui","Aceternity UI","Motion.js","Go","PostgreSQL","Redis","TimescaleDB","WebSockets","Docker","CI/CD","Flutter"],
    },
    {
      icon: "../../assets/icons/portal.jpg",
      company: { en: stripLinks('Orbit — Telegram Mini Apps gaming platform "[Portal](https://t.me/orbit_portal_bot)"'),
                 ru: stripLinks('Orbit — игровая платформа в Telegram Mini Apps "[Portal](https://t.me/orbit_portal_bot)"') },
      title:   { en: "Senior Frontend Engineer", ru: "Senior Frontend Engineer" },
      location:{ en: "Dubai, Remote", ru: "Дубай, Удалённо" },
      dateStart: new Date(2024, 8, 15),
      dateEnd:   new Date(2025, 2, 31),
      bullets: {
        en: [
          "Led the frontend of a Telegram gaming platform from pre-launch to **1M users**, owning UI and core business logic (rewards, purchases, ads).",
          "Built a drop-in TMA SDK with embeddable UI widgets and cross-game services (auth/profile, balance & inventory sync, leaderboards).",
          "Delivered rich animated interactions and visual theming based on user-selected Telegram styles using Motion.js, custom particle systems, and Spline-based animations.",
          "Optimized for Telegram Mini Apps constraints: **reduced initial JS payload by 55%** (1.1 MB → 490 KB gz) via code-splitting, tree-shaking, and asset deduplication.",
        ],
        ru: [
          "Возглавил фронтенд игровой платформы в Telegram: от prelaunch до **1M пользователей**; отвечал за UI и ключевую логику (награды, покупки, реклама).",
          "Разработал drop-in SDK для TMA с встраиваемыми UI-виджетами и межигровыми сервисами (аутентификация, профиль, баланс, инвентарь, лидерборды).",
          "Реализовал насыщенные анимированные взаимодействия и визуальные темы на основе пользовательских стилей Telegram с использованием Motion.js, кастомных систем частиц и анимаций на базе Spline.",
          "Оптимизировал под ограничения TMA: **сократил initial JS на 55%** (с 1.1 MB до 490 KB gz) благодаря code-splitting, tree-shaking и дедупликации ассетов.",
        ],
      },
      tags: ["React","TypeScript","Redux","Zustand","Telegram Mini Apps (TMA)","Motion.js","Tailwind","Web Performance Optimization","Feature-Sliced Design","Clean Architecture"],
    },
    {
      icon: "../../assets/icons/smartua.svg",
      company: stripLinks("Incymo — [SmartUA](https://incymo.ai/smartua/)"),
      title:   { en: "Senior Frontend Engineer", ru: "Senior Frontend Engineer" },
      location:{ en: "Tbilisi, Remote", ru: "Тбилиси, Удалённо" },
      dateStart: new Date(2023, 5, 1),
      dateEnd:   new Date(2024, 8, 15),
      bullets: {
        en: [
          "Developed a complex image and video editor with multi-layer support, batch imports, timeline, and animation system.",
          "Designed and implemented an ad banner generator with a flexible template system and post-generation editing.",
          "Led a full UI redesign from a legacy Android-style interface to a modern **Material 3+** design system.",
          "Built analytical dashboards with charts and visual summaries across multiple ad networks, **reducing campaign review time from ~10 to ~2 minutes**.",
        ],
        ru: [
          "Разработал сложный редактор изображений и видео с поддержкой мультислоёв, пакетной загрузки и системой таймлайна и анимаций.",
          "Спроектировал и реализовал генератор рекламных баннеров с системой шаблонов и возможностью постредактирования.",
          "Возглавил полный редизайн интерфейса — от устаревшего Android-стиля до современной дизайн-системы **Material 3+**.",
          "Разработал аналитические дашборды с графиками и визуальными сводками по рекламным сетям, **сократив время ревью кампаний с ~10 до ~2 минут**.",
        ],
      },
      tags: ["Vue","TypeScript","Pinia","Vuetify","Chart.js","Tailwind","Design Systems","Motion & Interaction Design","Feature-Sliced Design","Clean Architecture"],
    },
    {
      icon: "../../assets/icons/icons8.svg",
      company: stripLinks("Icons8 LLC — [Icons](https://icons8.com/icons)"),
      title:   { en: "Frontend Engineer", ru: "Frontend Engineer" },
      location:{ en: "Innopolis, Remote", ru: "Иннополис, Удалённо" },
      dateStart: new Date(2021, 9, 1),
      dateEnd:   new Date(2023, 5, 30),
      bullets: {
        en: [
          "Built the Iconizer SVG editor on Paper.js with support for grouped downloads, editable previews, syntax-highlighted embed code, and role-based access.",
          "Maintained and extended a shared internal UI kit used across multiple products, including accessibility improvements.",
          "Improved in-product ad UX, **increasing CTR by 18%** and achieving **72% viewability**.",
          "Optimized performance using lazy loading, SSR, and image compression — **LCP −42%**, **CLS 0.03**, **image payload −55%**.",
        ],
        ru: [
          "Разработал SVG-редактор Iconizer на Paper.js с поддержкой групповых скачиваний, редактируемых превью, подсветки кода и ролевого доступа.",
          "Поддерживал и развивал внутренний UI-kit, используемый в нескольких продуктах, включая улучшения доступности.",
          "Улучшил UX рекламных блоков: **CTR +18%**, **viewability 72%**.",
          "Оптимизировал производительность с помощью lazy loading, SSR и сжатия изображений — **LCP −42%**, **CLS 0.03**, **вес изображений −55%**.",
        ],
      },
      tags: ["Vue","Nuxt","Vuex","Paper.js","SVG","SSR","Web Performance Optimization","Feature-Sliced Design","Clean Architecture"],
    },
    {
      icon: "../../assets/icons/mkskom.svg",
      company: stripLinks("[MKSKOM LLC](https://mkskom.ru/)"),
      title:   { en: "Frontend Engineer", ru: "Frontend Engineer" },
      location:{ en: "Moscow, Remote", ru: "Москва, Удалённо" },
      dateStart: new Date(2021, 1, 1),
      dateEnd:   new Date(2021, 7, 31),
      bullets: {
        en: [
          "Developed isolated SPA modules integrated into a legacy monolithic system, including PHP-based integrations.",
          "Built an internal UI kit for document-heavy workflows.",
          "Implemented a complex editable table with nested forms and full mobile responsiveness.",
          "Improved UX to reduce repetitive manual steps in bureaucratic interfaces.",
        ],
        ru: [
          "Разрабатывал изолированные SPA-модули, интегрируемые в легаси-монолит, включая PHP-интеграции.",
          "Создал внутренний UI-kit для задач документооборота.",
          "Реализовал сложную редактируемую таблицу с вложенными формами и полной адаптацией под мобильные устройства.",
          "Улучшал UX для сокращения ручных и повторяющихся операций в бюрократических интерфейсах.",
        ],
      },
      tags: ["Vue","SCSS","Modular Frontend"],
    },
  ],
  education: [
    {
      icon: "../../assets/icons/iu.jpg",
      degree: { en: "Bachelor of Computer Science", ru: "Бакалавр компьютерных наук" },
      specialization: { en: "Software Engineer", ru: "Программный инженер" },
      institution: { en: "Innopolis University", ru: "Университет Иннополис" },
      dateStart: new Date(2017, 7, 1),
      dateEnd:   new Date(2021, 4, 31),
      highlights: {
        en: [
          "Advanced Enterprise Programming on JavaScript course",
          "Courses in Product Design & Management",
          "Hands-on backend, frontend, and mobile development; data structures and algorithms",
          "Project: procedurally generated solar system in Unity (algorithms reused in resume-site animation)",
        ],
        ru: [
          "Продвинутый курс по JavaScript (Advanced Enterprise Programming on JavaScript)",
          "Курсы по продуктовому дизайну и менеджменту",
          "Практика backend / frontend / mobile-разработки, структуры данных и алгоритмы",
          "Проект: процедурно-генерируемая солнечная система в Unity (алгоритмы используются в анимации сайта-резюме)",
        ],
      },
    },
  ],
  awards: {
    en: [
      { details: "**Winner**, Digital Breakthrough 2020 (Northwest IT Hub) hackathon", sub: "48 hours, among 280 teams" },
      { details: "**Winner**, OpenSpaceHack 2020 hackathon",                            sub: "48 hours, among 37 teams" },
      { details: "**4th Place**, InnoCTF 2018 (Cybersecurity)",                         sub: "10 hours, among ~30 teams" },
    ],
    ru: [
      { details: "**Победитель**, Хакатон «Цифровой прорыв 2020» (Северо-Западный хаб)", sub: "48 часов, среди 280 команд" },
      { details: "**Победитель**, Хакатон OpenSpaceHack 2020",                            sub: "48 часов, среди 37 команд" },
      { details: "**4-е место**, InnoCTF 2018 (Кибербезопасность)",                       sub: "10 часов, среди ~30 команд" },
    ],
  },
  teaching: {
    en: [
      { details: "Taught high school students Android dev on Java, robotics on Python" },
      { details: "Taught kids programming on Python via Minecraft" },
    ],
    ru: [
      { details: "Обучал старшеклассников Android-разработке на Java, робототехнике на Python" },
      { details: "Обучал детей программированию на Python в Minecraft" },
    ],
  },
  i18n: {
    en: { summary:"About me", skills:"Key Skills", experience:"Experience", extra:"Extra", education:"Education", awards:"Awards", teaching:"Teaching", present:"Present", from:"From", downloadPdf:"Download PDF", viewPdf:"View PDF", closePdf:"Close" },
    ru: { summary:"Обо мне", skills:"Ключевые навыки", experience:"Опыт работы", extra:"Дополнительно", education:"Образование", awards:"Награды", teaching:"Преподавание", present:"По настоящее время", from:"С", downloadPdf:"Скачать PDF", viewPdf:"Открыть PDF", closePdf:"Закрыть" },
  },
};
