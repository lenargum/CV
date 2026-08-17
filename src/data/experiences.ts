import type { ProfiledTechnologies, ProfiledText, TranslatedText, TranslatedArray, ExperienceSection, ExperienceCategory } from '../lib/types';

export type { TranslatedText, TranslatedArray };

export const EXPERIENCE_CATEGORIES: Record<ExperienceCategory, TranslatedText> = {
	product:      { en: "Product & features",          ru: "Продукт и фичи" },
	architecture: { en: "Architecture & refactoring",   ru: "Архитектура и рефакторинг" },
	performance:  { en: "Performance",                  ru: "Производительность" },
	process:      { en: "Process & team",               ru: "Процессы и команда" },
	observability:{ en: "Observability",                ru: "Observability" },
};

export interface ExperienceItem {
	title: string | TranslatedText | ProfiledText;
	icon?: string;
	company: string | TranslatedText;
	location: string | TranslatedText;
	date_start: Date;
	date_end: Date | null;
	intro?: TranslatedText | ProfiledText;
	description?: ExperienceSection[];
	technologies?: string[] | ProfiledTechnologies;
}

export const experiences: ExperienceItem[] = [
	{
		title: {
			base: {
				en: "Fullstack Engineer",
				ru: "Fullstack-инженер",
			},
			profiles: {
				react: {
					en: "Frontend Engineer",
					ru: "Frontend-инженер",
				},
			},
		},
		icon: '/CV/icons/meridian.svg',
		company: '[Meridian AI Fund](https://meridian-ai-fund.com/)',
		location: {
			en: "Saint Lucia, Remote",
			ru: "Сент-Люсия, Удалённо"
		},
		date_start: new Date(2026, 6, 1), // July 1, 2026
		date_end: null,                   // Present
		intro: {
			base: {
				en: "AI-fund investment platform — a public product taking real on-chain crypto payments. Owned it across frontend, backend, infrastructure, and analytics.",
				ru: "Инвестиционная платформа AI-фонда — публичный продукт с приёмом реальных крипто-платежей on-chain. Вёл фронтенд, бэкенд, инфраструктуру и аналитику."
			},
			profiles: {
				react: {
					en: "AI-fund investment platform. Built the frontend of a live product — an admin back-office, a country-aware investment flow, auto-updating clients, and full localization.",
					ru: "Инвестиционная платформа AI-фонда. Делал фронтенд живого продукта — админ-панель, инвестиционный флоу с лимитами по странам, само-обновляющиеся клиенты и полную локализацию."
				},
			},
		},
		description: [
			{
				cat: 'product',
				items: [
					// === all — detailed payments & product (watcher first) ===
					{
						base: {
							en: "Built the **crypto payment engine** — a standalone on-chain watcher that polls Solana, Ethereum, and Tron nodes, matches each incoming payment by a unique amount, waits for per-network confirmations, and routes anomalies (under or overpaid, late, unmatched) to manual reconciliation.",
							ru: "Собрал **движок крипто-платежей** — отдельный on-chain watcher, который поллит ноды Solana, Ethereum и Tron, матчит каждый платёж по уникальной сумме, ждёт подтверждений по каждой сети и отправляет аномалии (недоплата, переплата, поздний, неопознанный) на ручную сверку."
						},
						showIn: ['all'],
					},
					{
						base: {
							en: "Built the **back-office** — a payout workflow (on hold, paid, rejected, with an audit trail), payment-anomaly resolution, plus portfolio, news, and per-country limit management.",
							ru: "Сделал **админ-панель** — workflow выплат (на удержании, выплачено, отклонено, с аудитом), разбор аномалий платежей, управление портфелем, новостями и лимитами по странам."
						},
						showIn: ['all'],
					},
					{
						base: {
							en: "**Passwordless auth** — one-time six-digit codes and magic links (hashed codes, TTL, attempt limits), with admin access gated by an email allowlist.",
							ru: "**Беспарольная авторизация** — одноразовые шестизначные коды и magic-ссылки (хэш кода, TTL, лимит попыток), админ-доступ по email-аллоулисту."
						},
						showIn: ['all'],
					},
					// === Fullstack — consolidated payments & product ===
					{
						base: {
							en: "Built the **crypto payment engine** — an on-chain watcher across Solana, Ethereum, and Tron that matches each payment by a unique amount, waits for confirmations, and routes anomalies to manual reconciliation.",
							ru: "Собрал **движок крипто-платежей** — on-chain watcher по Solana, Ethereum и Tron, который матчит каждый платёж по уникальной сумме, ждёт подтверждений и отправляет аномалии на ручную сверку."
						},
						showIn: ['fullstack'],
					},
					{
						base: {
							en: "Built the **back-office and passwordless auth** — payout workflow with an audit trail, payment-anomaly resolution, per-country limits, and one-time-code or magic-link login.",
							ru: "Сделал **админ-панель и беспарольную авторизацию** — workflow выплат с аудитом, разбор аномалий, лимиты по странам и вход по одноразовому коду или magic-ссылке."
						},
						showIn: ['fullstack'],
					},
					// === React — product UI ===
					{
						base: {
							en: "Built the **admin back-office UI** — payout review, payment-anomaly resolution, and portfolio, news, and limit management.",
							ru: "Собрал **UI админ-панели** — ревью выплат, разбор аномалий платежей, управление портфелем, новостями и лимитами."
						},
						showIn: ['react'],
					},
					{
						base: {
							en: "Investment flow with a **country-aware limits slider** (rules from the API), a searchable country list, and safe two-step destructive actions.",
							ru: "Инвестиционный флоу со **слайдером лимитов по странам** (правила приходят из API), поиском по списку стран и безопасным удалением в два шага."
						},
						showIn: ['react'],
					},
					{
						base: {
							en: "Passwordless login UI (six-digit code or magic link) and full English and Russian localization (i18next).",
							ru: "UI беспарольного входа (шестизначный код или magic-ссылка) и полная локализация на английский и русский (i18next)."
						},
						showIn: ['react'],
					},
				],
			},
			{
				cat: 'architecture',
				items: [
					// === all — detailed backend & delivery ===
					{
						base: {
							en: "**Fastify** backend with fail-fast config validation (Zod), rate limiting, and bot detection. Postgres and Prisma with automatic migrations and an isolated test database.",
							ru: "Бэкенд на **Fastify** с fail-fast валидацией конфига (Zod), rate-limit и bot-detection. Postgres и Prisma с авто-миграциями и изолированной тестовой базой."
						},
						showIn: ['all'],
					},
					{
						base: {
							en: "Owned **automated deployments** — Dockerized services shipped to a VPS with no manual steps, Caddy serving hashed assets behind a no-cache HTML shell. Live price quotes on a schedule, with order composition stored as immutable snapshots (keep what happened, compute the rest).",
							ru: "Владел **автоматическим деплоем** — Docker-сервисы уезжают на VPS без ручных шагов, Caddy отдаёт хэшированные ассеты за no-cache HTML-шеллом. Живые котировки по расписанию, состав заказа хранится неизменяемыми снимками (храним что произошло, остальное вычисляем)."
						},
						showIn: ['all'],
					},
					// === Fullstack — consolidated backend & delivery ===
					{
						base: {
							en: "Owned the **backend and delivery** — Fastify (Zod-validated config, rate limiting, bot detection), Postgres and Prisma with automatic migrations, and Dockerized services auto-deployed to a VPS behind Caddy. Live quotes on a schedule with event-sourced order snapshots.",
							ru: "Вёл **бэкенд и доставку** — Fastify (Zod-валидация конфига, rate-limit, bot-detection), Postgres и Prisma с авто-миграциями, Docker-сервисы с авто-деплоем на VPS за Caddy. Живые котировки по расписанию с event-sourced снимками заказов."
						},
						showIn: ['fullstack'],
					},
					// === React — frontend infra ===
					{
						base: {
							en: "Built an **auto-update system** so live clients pick up new releases automatically, without a hard refresh.",
							ru: "Построил **систему авто-обновления** — живые клиенты подхватывают новые релизы автоматически, без хард-релоуда."
						},
						showIn: ['react'],
					},
					{
						base: {
							en: "Hashed asset builds (Vite) behind a no-cache HTML shell, with a lightweight first-party event-tracking client.",
							ru: "Хэшированные сборки ассетов (Vite) за no-cache HTML-шеллом и лёгкий клиент собственного event-трекинга."
						},
						showIn: ['react'],
					},
				],
			},
			{
				cat: 'observability',
				items: [
					// === all — detailed analytics & monitoring ===
					{
						base: {
							en: "Built **first-party, cookieless analytics** to replace a third-party tool — GDPR-clean by design: visitors keyed by a daily salted hash, no raw IP or user-agent stored, location kept only as a country code (MaxMind). A server-side Meta Conversions API mirrors browser events with hashed data and purchase deduplication.",
							ru: "Сделал **собственную cookieless-аналитику** взамен стороннего инструмента — GDPR-чистую by design: посетитель определяется дневным солёным хэшем, сырые IP и user-agent не хранятся, локация — только код страны (MaxMind). Серверный Meta Conversions API дублирует браузерные события с хэшированными данными и дедупом покупок."
						},
						showIn: ['all'],
					},
					{
						base: {
							en: "**Sentry** on backend and watcher, a dead-man-switch healthcheck, Telegram alerts, and transactional email (Resend) in English and Russian.",
							ru: "**Sentry** на бэкенде и watcher'е, dead-man-switch healthcheck, Telegram-алерты и транзакционная почта (Resend) на английском и русском."
						},
						showIn: ['all'],
					},
					// === Fullstack — consolidated analytics & monitoring ===
					{
						base: {
							en: "Built **first-party cookieless analytics** (GDPR-clean, MaxMind geo) with a server-side Meta Conversions API, plus Sentry on backend and watcher and a dead-man-switch healthcheck.",
							ru: "Сделал **собственную cookieless-аналитику** (GDPR-чистую, гео через MaxMind) с серверным Meta Conversions API, плюс Sentry на бэкенде и watcher'е и dead-man-switch healthcheck."
						},
						showIn: ['fullstack'],
					},
				],
			},
			{
				// === Vue — minimal fullstack credit (framework-agnostic) ===
				items: [
					{
						base: {
							en: "Fullstack work on a live AI-fund platform — an **on-chain crypto payment engine**, first-party cookieless analytics, and automated deployments.",
							ru: "Fullstack-работа на живой платформе AI-фонда — **on-chain движок крипто-платежей**, собственная cookieless-аналитика и автоматический деплой."
						},
						showIn: ['vue'],
					},
				],
			},
		],
		technologies: {
			base: [
				"React", "TypeScript", "Fastify", "Prisma",
				"PostgreSQL", "Zod", "Docker", "Caddy", "Sentry", "MaxMind", "CI/CD"
			],
			byProfile: {
				react: [
					"React", "TypeScript", "Vite", "Tailwind",
					"SCSS", "i18next", "CI/CD"
				],
				vue: [
					"TypeScript", "Fastify", "Prisma", "PostgreSQL", "Zod", "Docker", "CI/CD"
				],
				fullstack: [
					"React", "TypeScript", "Fastify", "Prisma",
					"PostgreSQL", "Zod", "Docker", "Sentry", "CI/CD"
				],
			}
		},
	},
	{
		title: {
			en: "Senior Frontend Engineer",
			ru: "Senior Frontend Engineer",
		},
		icon: '/CV/icons/cobalt.png',
		company: '[Cobalt Lab](https://cobaltlab.tech/)',
		location: {
			en: "Cyprus, Remote",
			ru: "Кипр, Удалённо"
		},
		date_start: new Date(2025, 9, 17), // October 17, 2025
		date_end: new Date(2026, 3, 17),   // April 17, 2026
		intro: {
			en: "Real-money iGaming platform. Joined mid-rebuild — a UI redesign running in parallel with an architecture rework, on top of heavy accumulated legacy.",
			ru: "Real-money iGaming платформа. Пришёл в разгар масштабного обновления — редизайн интерфейса параллельно с переработкой архитектуры, поверх тяжёлого накопленного легаси."
		},
		description: [
			{
				cat: 'architecture',
				items: [
					// === Architectural cleanup — Vue/Fullstack/All variant ===
					{
						base: {
							en: "Key refactors — network layer centralization, splitting **2–3k-line god components and stores** (with legacy parity), Vue 3 typing standardization, and security hardening across user flows.",
							ru: "Ключевые рефакторинги — централизация сетевого слоя, разбиение **2–3к-строчных god-компонентов и хранилищ** (с сохранением прежнего поведения), стандартизация типизации Vue 3 и усиление безопасности в пользовательских сценариях."
						},
						showIn: ['vue', 'fullstack', 'all'],
					},
					// === Architectural cleanup — React variant ===
					{
						base: {
							en: "Key refactors — network layer centralization, splitting **2–3k-line god components and stores** (with legacy parity), codebase-wide TypeScript standardization, and security hardening across user flows.",
							ru: "Ключевые рефакторинги — централизация сетевого слоя, разбиение **2–3к-строчных god-компонентов и хранилищ** (с сохранением прежнего поведения), стандартизация TypeScript по кодовой базе и усиление безопасности в пользовательских сценариях."
						},
						showIn: ['react'],
					},
				],
			},
			{
				cat: 'product',
				items: [
					// === Scope with feature list (all profiles) ===
					{
						base: {
							en: "**As one of two frontend engineers**, owned **18+ end-to-end product features** across **50+ epics** — retention events, onboarding, new banner system, referral program, reward claim.",
							ru: "**Один из двух фронтенд-инженеров в команде**, вёл **18+ сквозных продуктовых фич** в рамках **50+ эпиков** — механики удержания, онбординг, новая система баннеров, реферальная программа, получение наград."
						},
					},
				],
			},
			{
				cat: 'process',
				items: [
					// === Production-cycle processes (all profiles) ===
					{
						base: {
							en: "Every feature shipped through a **full production cycle** — responsive, unit-tested, localized, CDN + WebP, PostHog tracking.",
							ru: "Каждая фича — через **полный продовый цикл**: адаптив, юнит-тесты, локализация, CDN + WebP, трекинг в PostHog."
						},
					},
				],
			},
		],
		technologies: {
			base: [
				"Vue", "TypeScript", "Pinia",
				"Vite", "Vitest", "Tailwind",
				"PostHog",
				"Modular Frontend"
			],
			byProfile: {
				react: [
					"TypeScript", "PostHog",
					"Vitest", "Tailwind"
				],
				vue: [
					"Vue", "TypeScript", "Pinia",
					"Vite", "Vitest", "Tailwind"
				],
				fullstack: [
					"Vue", "TypeScript", "PostHog",
					"Vitest", "Tailwind"
				],
			}
		},
	},
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
		date_end: new Date(2025, 9, 16), // October 16, 2025 (day before Cobalt start)
		intro: {
			en: "Independent product work — web apps and Telegram Mini Apps across iGaming, e-commerce, and crypto.",
			ru: "Самостоятельные продуктовые проекты — веб-приложения и Telegram Mini Apps в iGaming, e-commerce и крипте."
		},
		description: [
			{
				items: [
			// === REACT — буллет 1 ===
			{
				base: {
					en: "Built **UI-heavy** web applications and Telegram Mini Apps using React / Next.js.",
					ru: "Разрабатывал **UI-heavy** веб-приложения и Telegram Mini Apps на React / Next.js."
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
			// === VUE — буллет 1 ===
			{
				base: {
					en: "Built SPA and product interfaces using Vue / Nuxt.",
					ru: "Разрабатывал SPA и продуктовые интерфейсы на Vue / Nuxt."
				},
				showIn: ['vue'],
			},
			// === VUE — буллет 3 ===
			{
				base: {
					en: "Delivered landing pages and product pages with animation and responsive layout.",
					ru: "Реализовывал лендинги и продуктовые страницы с анимацией и адаптивной вёрсткой."
				},
				showIn: ['vue'],
			},
			// === FULLSTACK — буллет 2 ===
			{
				base: {
					en: "Developed a crypto dashboard — **real-time via Go + WebSockets**, portfolio metrics, and role-based access.",
					ru: "Создал крипто-дашборд — **real-time на Go + WebSockets**, метрики портфелей и роли пользователей."
				},
				showIn: ['fullstack', 'all'],
			},
			// === FULLSTACK — буллет 5 ===
			{
				base: {
					en: "Worked on a mobile e‑commerce app (Flutter), built solo across the full stack — Go + PostgreSQL backend, React admin (QR codes, CRUD, service flows), OpenAPI-driven contracts, and a Docker container per service including S3 and mail.",
					ru: "Работал над мобильным e‑commerce приложением (Flutter), сделал в соло на всех слоях — бэкенд на Go + PostgreSQL, админка на React (QR-коды, CRUD, сервисные флоу), контракты на OpenAPI и по Docker-контейнеру на каждый сервис, включая S3 и почту."
				},
				showIn: ['fullstack', 'all'],
			},
				],
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
			en: 'Orbit — [Portal](https://t.me/orbit_portal_bot)',
			ru: 'Orbit — [Portal](https://t.me/orbit_portal_bot)',
		},
		location: {
			en: "Dubai, Remote",
			ru: "Дубай, Удалённо"
		},
		date_start: new Date(2024, 8, 15), // September 15, 2024
		date_end: new Date(2025, 2, 31), // March 31, 2025
		intro: {
			en: "Telegram gaming platform that grew to **1M users**.",
			ru: "Игровая платформа в Telegram, выросла до **1M пользователей**."
		},
		description: [
			{
				cat: 'product',
				items: [
					// === Lead + 1M users ===
					{
						base: {
							en: "Led the frontend of a [Telegram gaming platform](https://t.me/orbit_portal_bot) from pre-launch to **1M users**, owning UI and core business logic (rewards, purchases, ads)",
							ru: "Возглавил фронтенд [игровой платформы в Telegram](https://t.me/orbit_portal_bot): от prelaunch до **1M пользователей**, отвечал за UI и ключевую логику (награды, покупки, реклама)"
						},
					},
					// === SDK (только all) ===
					{
						base: {
							en: "Built a drop-in TMA SDK with embeddable UI widgets and cross-game services (auth/profile, balance & inventory sync, leaderboards)",
							ru: "Разработал drop-in SDK для TMA с встраиваемыми UI-виджетами и межигровыми сервисами (аутентификация, профиль, баланс, инвентарь, лидерборды)"
						},
						showIn: ['all'],
					},
					// === Animations and Theming ===
					{
						base: {
							en: "Delivered rich animated interactions and visual theming based on user-selected Telegram styles using Motion.js, custom particle systems, and Spline-based animations",
							ru: "Реализовал насыщенные анимированные взаимодействия и визуальные темы на основе пользовательских стилей Telegram с использованием Motion.js, кастомных систем частиц и анимаций на базе Spline"
						},
					},
					// === Platform components ===
					{
						base: {
							en: "Designed and built platform‑level components and reusable UI for partner Telegram Mini Apps, including shared services (authentication, profiles, balance & inventory sync, leaderboards)",
							ru: "Спроектировал и реализовал платформенные компоненты и reusable UI для партнёрских Telegram Mini Apps, включая общие сервисы (аутентификация, профиль, синхронизация баланса и инвентаря, лидерборды)"
						},
						showIn: ['react', 'vue'],
					},
				],
			},
			{
				cat: 'performance',
				items: [
					// === Performance ===
					{
						base: {
							en: "Optimized for Telegram Mini Apps constraints: **reduced initial JS payload by 55%** (from 1.1 MB to 490 KB gz) via code-splitting, tree-shaking, and asset deduplication",
							ru: "Оптимизировал под ограничения TMA: **сократил initial JS на 55%** (с 1.1 MB до 490 KB gz) благодаря code-splitting, tree-shaking и дедупликации ассетов"
						},
					},
				],
			},
			{
				cat: 'architecture',
				items: [
					// === SDK integration into partner games (fullstack + all) ===
					{
						base: {
							en: "Built a reusable SDK adapter and integration docs so partner **Unity and Unreal games** ran correctly inside Telegram Mini Apps — WebView constraints, auth handoff, and balance and inventory sync. Adopted across **dozens of partner games**.",
							ru: "Сделал переиспользуемый SDK-адаптер и доку по интеграции, чтобы партнёрские игры на **Unity и Unreal** корректно работали внутри Telegram Mini Apps — ограничения WebView, проброс авторизации, синхронизация баланса и инвентаря. Внедрён в **десятки партнёрских игр**."
						},
						showIn: ['fullstack', 'all'],
					},
				],
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
		intro: {
			en: "AI tooling for generating ad creatives.",
			ru: "AI-инструменты для генерации рекламных креативов."
		},
		description: [
			{
				cat: 'product',
				items: [
					// === Editor ===
					{
						base: {
							en: "Built a complex **Canvas-based** image and video editor with multi-layer support, timeline, batch imports, and an animation system",
							ru: "Разработал на **Canvas** сложный редактор изображений и видео: мультислои, таймлайн, пакетная загрузка и система анимаций"
						},
					},
					// === Banner generator ===
					{
						base: {
							en: "Designed and implemented an ad banner generator with a flexible template system and post‑generation editing",
							ru: "Спроектировал и реализовал генератор рекламных баннеров с системой шаблонов и возможностью постредактирования"
						},
					},
					// === UI Redesign ===
					{
						base: {
							en: "Led a full UI redesign from a legacy Android-style interface to a modern **Material 3+** design system",
							ru: "Возглавил полный редизайн интерфейса — от устаревшего Android-стиля до современной дизайн-системы **Material 3+**"
						},
					},
					// === Dashboards ===
					{
						base: {
							en: "Built analytical dashboards with charts and visual summaries across multiple ad networks, **reducing campaign review time from ~10 to ~2 minutes**",
							ru: "Разработал аналитические дашборды с графиками и визуальными сводками по рекламным сетям, **сократив время ревью кампаний с ~10 до ~2 минут**"
						},
					},
				],
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
		intro: {
			en: "Icon and design-asset platform.",
			ru: "Платформа иконок и дизайн-ресурсов."
		},
		description: [
			{
				cat: 'product',
				items: [
					// === SVG Editor + cross-project UI kit ===
					{
						base: {
							en: "Built the [Iconizer SVG editor](https://icons8.com/iconizer) on Paper.js (grouped downloads, editable previews, syntax-highlighted embed code) and a **cross-project atomic UI component library** shipped across Icons8 products",
							ru: "Разработал [SVG-редактор Iconizer](https://icons8.com/iconizer) на Paper.js (групповые скачивания, редактируемые превью, подсветка кода) и **кросс-проектную атомарную UI-библиотеку компонентов** для продуктов Icons8"
						},
					},
					// === Ad UX ===
					{
						base: {
							en: "Improved in-product ad UX, **increasing CTR by 18%** and achieving **72% viewability**",
							ru: "Улучшил UX рекламных блоков: **CTR +18%**, **viewability 72%**"
						},
					},
				],
			},
			{
				cat: 'performance',
				items: [
					// === Performance ===
					{
						base: {
							en: "Optimized performance using lazy loading, SSR, and image compression — **LCP −42%**, **CLS 0.03**, **image payload −55%**",
							ru: "Оптимизировал производительность с помощью lazy loading, SSR и сжатия изображений — **LCP −42%**, **CLS 0.03**, **вес изображений −55%**"
						},
					},
				],
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
		intro: {
			en: "Document-heavy enterprise system.",
			ru: "Корпоративная система документооборота."
		},
		description: [
			{
				items: [
					// === SPA modules ===
					{
						base: {
							en: "Developed isolated SPA modules integrated into a legacy monolithic system, including PHP‑based integrations",
							ru: "Разрабатывал изолированные SPA-модули, интегрируемые в легаси-монолит, включая PHP‑интеграции"
						},
					},
					// === Editable table ===
					{
						base: {
							en: "Implemented a complex editable table with nested forms and full mobile responsiveness",
							ru: "Реализовал сложную редактируемую таблицу с вложенными формами и полной адаптацией под мобильные устройства"
						},
					},
				],
			},
		],
		technologies: {
			base: [
				"Vue", "SCSS",
				"Modular Frontend"
			],
			byProfile: {
				react: [
					"Javascript", "SCSS",
					"Modular Frontend"
				],
			}
		},
	},
];
