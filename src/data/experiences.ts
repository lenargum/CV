import type { ProfiledBullet, ProfiledTechnologies, ProfiledText, TranslatedText, TranslatedArray } from '../lib/types';

export type { TranslatedText, TranslatedArray };

export interface ExperienceItem {
	title: string | TranslatedText | ProfiledText;
	icon?: string;
	company: string | TranslatedText;
	location: string | TranslatedText;
	date_start: Date;
	date_end: Date | null;
	description?: ProfiledBullet[] | TranslatedArray;
	technologies?: string[] | ProfiledTechnologies;
}

export const experiences: ExperienceItem[] = [
	{
		title: {
			base: {
				en: "Fullstack Engineer (Frontend-focused)",
				ru: "Fullstack Engineer (Frontend-focused)",
			},
			profiles: {
				react: {
					en: "Senior Frontend Engineer (React, TypeScript)",
					ru: "Senior Frontend Engineer (React, TypeScript)",
				},
				vue: {
					en: "Senior Frontend Engineer (Vue, Nuxt)",
					ru: "Senior Frontend Engineer (Vue, Nuxt)",
				},
				fullstack: {
					en: "Fullstack Engineer (React + Go)",
					ru: "Fullstack Engineer (React + Go)",
				},
			}
		},
		icon: '/CV/icons/freelance_white.png',
		company: {
			en: 'Freelance',
			ru: 'Фриланс',
		},
		location: {
			en: "Remote",
			ru: "Удалённо"
		},
		date_start: new Date(2025, 0, 1), // January 1, 2025
		date_end: null,
		description: [
			// === CANON (all) — буллет 1 ===
			{
				base: {
					en: "Built product-level web applications and Mini Apps: iGaming, e‑commerce, crypto dashboards, and internal tools.",
					ru: "Разрабатывал продуктовые веб-приложения и Mini Apps: iGaming, e‑commerce, крипто‑дашборды и internal‑инструменты."
				},
				showIn: ['all'],
			},
			// === CANON (all) — буллет 2 ===
			{
				base: {
					en: "Developed **UI-heavy** interfaces with animations, complex state management, and responsive layout systems.",
					ru: "Создавал **UI-heavy** интерфейсы с анимациями, сложными состояниями и адаптивными layout‑системами."
				},
				showIn: ['all'],
			},
			// === CANON (all) — буллет 3 ===
			{
				base: {
					en: "Delivered fullstack solutions: frontend, backend, CI/CD, and deployment.",
					ru: "Реализовывал fullstack-решения: frontend + backend + CI/CD + деплой."
				},
				showIn: ['all'],
			},
			// === CANON (all) — буллет 4 ===
			{
				base: {
					en: "Designed application architecture, role-based access systems, real-time updates, and integrations.",
					ru: "Проектировал архитектуру, систему ролей и прав доступа, real-time обновления и интеграции."
				},
				showIn: ['all'],
			},
			// === CANON (all) — буллет 5 ===
			{
				base: {
					en: "Owned quality, performance, and bringing projects to a production-ready state.",
					ru: "Отвечал за качество, производительность и доведение проектов до рабочей прод-стадии."
				},
				showIn: ['all'],
			},

			// === REACT — буллет 1 ===
			{
				base: {
					en: "Built **UI-heavy** web applications and Telegram Mini Apps using React / Next.js.",
					ru: "Разрабатывал **UI-heavy** веб-приложения и Telegram Mini Apps на React / Next.js."
				},
				showIn: ['react'],
			},
			// === REACT — буллет 2 ===
			{
				base: {
					en: "Implemented complex animations, interactive states, and responsive layouts.",
					ru: "Реализовывал сложные анимации, интерактивные состояния и адаптивные интерфейсы."
				},
				showIn: ['react'],
			},
			// === REACT — буллет 3 ===
			{
				base: {
					en: "Developed e‑commerce frontends (catalogs, carts, payment flows) with CI/CD.",
					ru: "Делал e‑commerce фронтенд (каталоги, корзины, платежные флоу) с CI/CD."
				},
				showIn: ['react'],
			},
			// === REACT — буллет 4 ===
			{
				base: {
					en: "Optimized performance, UX, and initial load.",
					ru: "Оптимизировал производительность, UX и initial load."
				},
				showIn: ['react'],
			},

			// === VUE — буллет 1 ===
			{
				base: {
					en: "Built SPA and product interfaces using Vue / Nuxt.",
					ru: "Разрабатывал SPA и продуктовые интерфейсы на Vue / Nuxt."
				},
				showIn: ['vue'],
			},
			// === VUE — буллет 2 ===
			{
				base: {
					en: "Developed responsive UI systems and animated interfaces.",
					ru: "Создавал адаптивные UI-системы и анимированные интерфейсы."
				},
				showIn: ['vue'],
			},
			// === VUE — буллет 3 ===
			{
				base: {
					en: "Delivered landing pages and product pages with strong UX focus.",
					ru: "Реализовывал лендинги и продуктовые страницы с упором на визуал и UX."
				},
				showIn: ['vue'],
			},
			// === VUE — буллет 4 ===
			{
				base: {
					en: "Optimized client-side performance and stability.",
					ru: "Оптимизировал клиентскую производительность и стабильность."
				},
				showIn: ['vue'],
			},
			// === FULLSTACK — буллет 1 ===
			{
				base: {
					en: "Built production fullstack products, covering frontend, backend services, and infrastructure.",
					ru: "Разрабатывал production fullstack-продукты: frontend, backend-сервисы и инфраструктуру."
				},
				showIn: ['fullstack'],
			},
			// === FULLSTACK — буллет 2 ===
			{
				base: {
					en: "Developed a crypto dashboard with **real-time updates**, portfolio metrics, and role-based access.",
					ru: "Создал крипто-дашборд с **real-time обновлениями**, метриками портфелей и ролями пользователей."
				},
				showIn: ['fullstack'],
			},
			// === FULLSTACK — буллет 3 ===
			{
				base: {
					en: "Implemented backend services in Go with WebSockets and REST APIs.",
					ru: "Реализовывал backend-сервисы на Go с WebSocket-ами и REST API."
				},
				showIn: ['fullstack'],
			},
			// === FULLSTACK — буллет 4 ===
			{
				base: {
					en: "Set up CI/CD pipelines, deployment, and environments.",
					ru: "Настраивал CI/CD, деплой и окружения."
				},
				showIn: ['fullstack'],
			},
			// === FULLSTACK — буллет 5 ===
			{
				base: {
					en: "Worked on a mobile e‑commerce app (Flutter) with 1C integrations.",
					ru: "Работал с мобильным e‑commerce приложением (Flutter) и интеграцией с 1С."
				},
				showIn: ['fullstack'],
			},
		],
		technologies: {
			base: [
				"React", "Next.js", "TypeScript", "Tailwind",
				"shadcn/ui", "Aceternity UI", "Motion.js",
				"Go", "PostgreSQL", "Redis", "TimescaleDB",
				"WebSockets", "Docker", "CI/CD", "Flutter"
			],
			byProfile: {
				react: [
					"React", "Next.js", "TypeScript", "Tailwind",
					"shadcn/ui", "Aceternity UI", "Motion.js", "CI/CD"
				],
				vue: [
					"Vue", "Nuxt", "TypeScript", "Pinia", "Tailwind", "Motion.js"
				],
				fullstack: [
					"React", "Next.js", "Go", "PostgreSQL", "Redis", "Docker", "CI/CD", "WebSockets"
				],
			}
		},
	},
	{
		title: {
			en: "Senior Frontend Engineer",
			ru: "Senior Frontend Engineer",
		},
		icon: '/CV/icons/portal.jpg',
		company: {
			en: 'Orbit — Telegram Mini Apps gaming platform "[Portal](https://t.me/orbit_portal_bot)"',
			ru: 'Orbit — игровая платформа в Telegram Mini Apps "[Portal](https://t.me/orbit_portal_bot)"',
		},
		location: {
			en: "Dubai, Remote",
			ru: "Дубай, Удалённо"
		},
		date_start: new Date(2024, 8, 15), // September 15, 2024
		date_end: new Date(2025, 2, 31), // March 31, 2025
		description: [
			// === CANON — буллет 1: Lead + 1M users ===
			{
				base: {
					en: "Led the frontend of a [Telegram gaming platform](https://t.me/orbit_portal_bot) from pre-launch to **1M users**, owning UI and core business logic (rewards, purchases, ads)",
					ru: "Возглавил фронтенд [игровой платформы в Telegram](https://t.me/orbit_portal_bot): от prelaunch до **1M пользователей**; отвечал за UI и ключевую логику (награды, покупки, реклама)"
				},
				// показывать везде
			},
			// === CANON — буллет 2: SDK (только all) ===
			{
				base: {
					en: "Built a drop-in TMA SDK with embeddable UI widgets and cross-game services (auth/profile, balance & inventory sync, leaderboards)",
					ru: "Разработал drop-in SDK для TMA с встраиваемыми UI-виджетами и межигровыми сервисами (аутентификация, профиль, баланс, инвентарь, лидерборды)"
				},
				showIn: ['all'],
			},
			// === CANON — буллет 3: Animations and Theming ===
			{
				base: {
					en: "Delivered rich animated interactions and visual theming based on user-selected Telegram styles using Motion.js, custom particle systems, and Spline-based animations",
					ru: "Реализовал насыщенные анимированные взаимодействия и визуальные темы на основе пользовательских стилей Telegram с использованием Motion.js, кастомных систем частиц и анимаций на базе Spline"
				},
				// показывать везде
			},
			// === CANON — буллет 4: Performance ===
			{
				base: {
					en: "Optimized for Telegram Mini Apps constraints: **reduced initial JS payload by 55%** (1.1 MB → 490 KB gz) via code-splitting, tree-shaking, and asset deduplication",
					ru: "Оптимизировал под ограничения TMA: **сократил initial JS на 55%** (с 1.1 MB до 490 KB gz) благодаря code-splitting, tree-shaking и дедупликации ассетов"
				},
				// показывать везде
			},
			// === CANON — буллет 5: Platform components ===
			{
				base: {
					en: "Designed and built platform‑level components and reusable UI for partner Telegram Mini Apps, including shared services (authentication, profiles, balance & inventory sync, leaderboards)",
					ru: "Спроектировал и реализовал платформенные компоненты и reusable UI для партнёрских Telegram Mini Apps, включая общие сервисы (аутентификация, профиль, синхронизация баланса и инвентаря, лидерборды)"
				},
				showIn: ['react', 'vue'],
			},
			// === FULLSTACK — буллет: Architecture (только fullstack) ===
			{
				base: {
					en: "Collaborated on platform architecture and cross-service integrations for partner games",
					ru: "Участвовал в проектировании платформенной архитектуры и интеграций с партнёрскими сервисами"
				},
				showIn: ['fullstack'],
			},
		],
		technologies: {
			base: [
				"React", "TypeScript", "Redux", "Zustand",
				"Telegram Mini Apps (TMA)", "Motion.js", "Tailwind",
				"Web Performance Optimization",
				"Feature-Sliced Design", "Clean Architecture"
			],
			byProfile: {
				react: [
					"React", "TypeScript", "Redux", "Zustand",
					"Motion.js", "Tailwind",
					"Web Performance Optimization"
				],
				vue: [
					"TypeScript", "Motion.js", "Tailwind", "Web Performance Optimization"
				],
				fullstack: [
					"React", "TypeScript", "Zustand", "Motion.js", "Tailwind"
				],
			}
		},
	},
	{
		title: {
			en: "Senior Frontend Engineer",
			ru: "Senior Frontend Engineer",
		},
		icon: '/CV/icons/smartua.svg',
		company: "Incymo — [SmartUA](https://incymo.ai/smartua/)",
		location: {
			en: "Tbilisi, Remote",
			ru: "Тбилиси, Удалённо"
		},
		date_start: new Date(2023, 5, 1), // June 1, 2023
		date_end: new Date(2024, 8, 15), // September 15, 2024
		description: [
			// === CANON — буллет 1: Editor ===
			{
				base: {
					en: "Developed a complex image and video editor with multi-layer support, batch imports, timeline, and animation system",
					ru: "Разработал сложный редактор изображений и видео с поддержкой мультислоёв, пакетной загрузки и системой таймлайна и анимаций"
				},
				// показывать везде
			},
			// === CANON — буллет 2: Banner generator ===
			{
				base: {
					en: "Designed and implemented an ad banner generator with a flexible template system and post‑generation editing",
					ru: "Спроектировал и реализовал генератор рекламных баннеров с системой шаблонов и возможностью постредактирования"
				},
				// показывать везде
			},
			// === CANON — буллет 3: UI Redesign ===
			{
				base: {
					en: "Led a full UI redesign from a legacy Android-style interface to a modern **Material 3+** design system",
					ru: "Возглавил полный редизайн интерфейса — от устаревшего Android-стиля до современной дизайн-системы **Material 3+**"
				},
				// показывать везде
			},
			// === CANON — буллет 4: Dashboards ===
			{
				base: {
					en: "Built analytical dashboards with charts and visual summaries across multiple ad networks, **reducing campaign review time from ~10 to ~2 minutes**",
					ru: "Разработал аналитические дашборды с графиками и визуальными сводками по рекламным сетям, **сократив время ревью кампаний с ~10 до ~2 минут**"
				},
				// показывать везде
			},
			// === FULLSTACK — буллет: Backend integration ===
			{
				base: {
					en: "Collaborated with backend and analytics to integrate ad network data into product dashboards",
					ru: "Работал в связке с backend и аналитикой, интегрируя данные рекламных сетей в продуктовые дашборды"
				},
				showIn: ['fullstack'],
			},
		],
		technologies: {
			base: [
				"Vue", "TypeScript", "Pinia", "Vuetify",
				"Chart.js", "Tailwind", "Design Systems",
				"Motion & Interaction Design", "Feature-Sliced Design", "Clean Architecture"
			],
			byProfile: {
				react: [
					"TypeScript", "Tailwind", "Design Systems"
				],
				vue: [
					"Vue", "TypeScript", "Pinia", "Vuetify", "Tailwind", "Design Systems"
				],
				fullstack: [
					"Vue", "TypeScript", "Pinia", "Vuetify",
					"Tailwind", "Design Systems", "Clean Architecture"
				],
			}
		},
	},
	{
		title: {
			en: "Frontend Engineer",
			ru: "Frontend Engineer",
		},
		icon: '/CV/icons/icons8.svg',
		company: "Icons8 LLC — [Icons](https://icons8.com/icons)",
		location: {
			en: "Innopolis, Remote",
			ru: "Иннополис, Удалённо"
		},
		date_start: new Date(2021, 9, 1), // October 1, 2021
		date_end: new Date(2023, 5, 30), // June 30, 2023
		description: [
			// === CANON — буллет 1: SVG Editor ===
			{
				base: {
					en: "Built the [Iconizer SVG editor](https://icons8.com/iconizer) on Paper.js with support for grouped downloads, editable previews, syntax-highlighted embed code, and role-based access",
					ru: "Разработал [SVG-редактор Iconizer](https://icons8.com/iconizer) на Paper.js с поддержкой групповых скачиваний, редактируемых превью, подсветки кода и ролевого доступа"
				},
				// показывать везде
			},
			// === CANON — буллет 2: UI Kit ===
			{
				base: {
					en: "Maintained and extended a shared internal UI kit used across multiple products, including accessibility improvements",
					ru: "Поддерживал и развивал внутренний UI-kit, используемый в нескольких продуктах, включая улучшения доступности"
				},
				// показывать везде
			},
			// === CANON — буллет 3: Ad UX ===
			{
				base: {
					en: "Improved in-product ad UX, **increasing CTR by 18%** and achieving **72% viewability**",
					ru: "Улучшил UX рекламных блоков: **CTR +18%**, **viewability 72%**"
				},
				// показывать везде
			},
			// === CANON — буллет 4: Performance ===
			{
				base: {
					en: "Optimized performance using lazy loading, SSR, and image compression — **reducing LCP by 42%**, CLS to 0.03, and image payload by 55%",
					ru: "Оптимизировал производительность с помощью lazy loading, SSR и сжатия изображений — **LCP −42%**, CLS 0.03, вес изображений −55%"
				},
				// показывать везде
			},
		],
		technologies: {
			base: [
				"Vue", "Nuxt", "Vuex", "Paper.js", "SVG",
				"SSR", "Web Performance Optimization",
				"Feature-Sliced Design", "Clean Architecture"
			],
			byProfile: {
				react: [
					"Paper.js", "SVG",
					"Web Performance Optimization"
				],
				vue: [
					"Vue", "Nuxt", "Vuex", "Paper.js", "SVG",
					"Web Performance Optimization"
				],
				fullstack: [
					"Vue", "Nuxt", "Paper.js", "SVG",
					"Web Performance Optimization"
				],
			}
		},
	},
	{
		title: {
			en: "Frontend Engineer",
			ru: "Frontend Engineer",
		},
		icon: '/CV/icons/mkskom.svg',
		company: "[MKSKOM LLC](https://mkskom.ru/)",
		location: {
			en: "Moscow, Remote",
			ru: "Москва, Удалённо"
		},
		date_start: new Date(2021, 1, 1), // February 1, 2021
		date_end: new Date(2021, 7, 31), // August 31, 2021
		description: [
			// === CANON — буллет 1: SPA modules ===
			{
				base: {
					en: "Developed isolated SPA modules integrated into a legacy monolithic system, including PHP‑based integrations",
					ru: "Разрабатывал изолированные SPA-модули, интегрируемые в легаси-монолит, включая PHP‑интеграции"
				},
				// показывать везде
			},
			// === CANON — буллет 2: UI Kit ===
			{
				base: {
					en: "Built an internal UI kit for document-heavy workflows",
					ru: "Создал внутренний UI-kit для задач документооборота"
				},
				// показывать везде
			},
			// === CANON — буллет 3: Editable table ===
			{
				base: {
					en: "Implemented a complex editable table with nested forms and full mobile responsiveness",
					ru: "Реализовал сложную редактируемую таблицу с вложенными формами и полной адаптацией под мобильные устройства"
				},
				// показывать везде
			},
			// === CANON — буллет 4: UX ===
			{
				base: {
					en: "Improved UX to reduce repetitive manual steps in bureaucratic interfaces",
					ru: "Улучшал UX для сокращения ручных и повторяющихся операций в бюрократических интерфейсах"
				},
				// показывать везде
			},
		],
		technologies: {
			base: [
				"Vue", "SCSS",
				"Modular Frontend"
			]
		},
	},
];
