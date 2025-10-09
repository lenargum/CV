export interface TranslatedText {
	en: string;
	ru: string;
	[key: string]: string;
}

export interface TranslatedArray {
	en: string[];
	ru: string[];
	[key: string]: string[];
}

export interface ExperienceItem {
	title: string | TranslatedText;
	icon?: string;
	company: string | TranslatedText;
	location: string | TranslatedText;
	date_start: Date;
	date_end: Date | null;
	description?: string[] | TranslatedArray;
	technologies?: string[];
}

export const experiences: ExperienceItem[] = [
	{
		title: {
			en: "Fullstack Developer",
			ru: "Fullstack-разработчик",
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
		date_start: new Date(2025, 1, 0), // January 1, 2025
		date_end: null,
		technologies: [
			"React",
			"TypeScript",
			"Zustand",
			"Next",
			
			"Telegram Mini Apps",
			"Shadcn",
  			"Aceternity UI",
			"Motion.js",
			"Tailwind",
			"Figma",
			"ChatGPT",
			"Cursor",
			"Claude",
			"HTML",
			"CSS",
			"JavaScript",
			"Go",
			"PostgreSQL",
			"Redis",
			"Docker"
		],
	},
	{
		title: {
			en: "Middle+ Frontend Developer",
			ru: "Middle+ Frontend-разработчик",
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
		description: {
			"en": [
				"Led the frontend of a [Telegram gaming platform](https://t.me/orbit_portal_bot) from prelaunch to 1M users, delivering the UI and major app logic (rewards, purchases, ads)",
				"Built a drop-in TMA SDK providing embeddable UI widgets and cross-game services (auth/profile, balance & inventory sync, leaderboards) for partner games",
				"Optimized for Telegram Mini Apps constraints: cut initial JS payload by ~55% (≈1.1 MB → 490 KB gz) via code-splitting, tree-shaking, and asset deduping",
				"Delivered rich animated interactions using Motion.js, custom particle systems, and Spline-based lootbox animations",
				"Implemented full visual theming integration based on user-selected Telegram styles, ensuring seamless UX alignment"
			],
			"ru": [
				"Возглавил фронтенд [игровой платформы в Telegram](https://t.me/orbit_portal_bot): от prelaunch до 1M пользователей; отвечал за UI и ключевую логику (награды, покупки, реклама)",
				"Разработал drop-in SDK для TMA с встраиваемыми UI-виджетами и межигровыми сервисами (аутентификация/профиль, синхронизация баланса и инвентаря, лидерборды) для партнёрских игр",
				"Оптимизировал под ограничения TMA: сократил initial JS ~на 55% (≈1.1 MB → 490 KB gz) благодаря code-splitting, tree-shaking и дедупликации ассетов",
				"Реализовал насыщенные анимации с помощью Motion.js, кастомных частиц и анимаций с Spline",
				"Интегрировал визуальные темы на основе пользовательских настроек Telegram для целостного UX",
			]
		},
		technologies: [
			"React",
			"TypeScript",
			"Redux",
			"Zustand",
			
			"Telegram Mini Apps",
			"Motion.js",
			"Tailwind",
			"Figma",
			"Cursor",
			"HTML",
			"CSS",
			"JavaScript",
			"SCSS",

			"SPA",
			"CSR",

			"SOLID",
			"KISS",
			"DRY",
			"YAGNI",

			"Atomic Design",
			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Themability & Runtime Theming",
			"Responsive & Fluid Layout Systems",

			"Feature-Sliced Design",
			"Clean Architecture",
			"Flux",

			"Agile",
			"Cowboy",
		],
	},
	{
		title: {
			en: "Middle+ Frontend Developer",
			ru: "Middle+ Frontend-разработчик",
		},
		icon: '/CV/icons/smartua.svg',
		company: "Incymo — [SmartUA](https://incymo.ai/smartua/)",
		location: {
			en: "Tbilisi, Remote",
			ru: "Тбилиси, Удалённо"
		},
		date_start: new Date(2023, 5, 1), // June 1, 2023
		date_end: new Date(2024, 8, 15), // September 15, 2024
		description: {
			"en": [
				"Developed a complex image/video editor with multi-layer support, batch text/image/video imports, timeline and animation system",
				"Designed and built a comprehensive ad banner generator with rich template system and post-generation editing capabilities",
				"Built analytical dashboards with charts and visual summaries for banner performance across various ad networks; cut campaign progress review time from ~10 to ~2 minutes",
				"Led complete UI redesign from legacy Android-style interface to modern Material 3+ design system",
			],
			"ru": [
				"Разработал сложный редактор изображений и видео с поддержкой мультислоёв, пакетной загрузки текста/изображений/видео, системой таймлайна и анимаций",
				"Спроектировал и реализовал генератор рекламных баннеров с системой шаблонов и возможностью постредактирования",
				"Разработал аналитические дашборды с графиками и визуальными сводками по баннерам из различных рекламных сетей; сократил время ревью прогресса кампаний с ~10 до ~2 минут",
				"Провёл полный редизайн интерфейса — от устаревшего Android-стиля до современной дизайн-системы Material 3+",
			]
		},
		technologies: [
			"Vue",
			"TypeScript",
			"Pinia",
			"Tailwind",
			"Vuetify",
			"Chart.js",
			
			"Google Tag Manager",
			"Yandex Metrica",
			"Docker",
			"Figma",
			"HTML",
			"CSS",
			"JavaScript",
			"SCSS",

			"SPA",
			"CSR",

			"SOLID",
			"KISS",
			"DRY",
			"YAGNI",

			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Responsive & Fluid Layout Systems",

			"Feature-Sliced Design",
			"Clean Architecture",
			"Atomic Design",
			"Flux",

			"Agile",
			"Waterfall"
		],
	},
	{
		title: {
			en: "Junior+ Frontend Developer",
			ru: "Junior+ Frontend-разработчик",
		},
		icon: '/CV/icons/icons8.svg',
		company: "Icons8 LLC — [Icons](https://icons8.com/icons/set/cat)",
		location: {
			en: "Innopolis, Remote",
			ru: "Иннополис, Удалённо"
		},
		date_start: new Date(2021, 9, 1), // October 1, 2021
		date_end: new Date(2023, 5, 30), // June 30, 2023
		description: {
			"en": [
				"Built the [Iconizer SVG editor](https://icons8.com/iconizer) on Paper.js, with support for [grouped downloads, editable previews, syntax-highlighted embed code, and role-based access](https://icons8.com/icon/83221/sun)",
				"Improved site performance with lazy loading, SSR, and image compression — LCP reduced by 42%, CLS 0.03, image payload reduced by 55%",
				"Maintained and enhanced the internal UI-kit shared across multiple projects, contributing accessibility fixes",
				"Configured ad blocks in the UI: improved UX, +18% CTR, 72% viewability",
			],
			"ru": [
				"Разработал [SVG-редактор Iconizer](https://icons8.com/iconizer) на Paper.js, с поддержкой [групповых скачиваний, редактируемых превью, подсветки кода, ролевого доступа](https://icons8.com/icon/83221/sun)",
				"Улучшил производительность за счёт lazy loading, SSR и сжатия изображений — LCP снизился на 42%, CLS 0.03, вес изображений уменьшен на 55%",
				"Поддерживал и улучшал внутренний UI-kit, используемый в нескольких проектах",
				"Настроил рекламные блоки в UI: улучшил UX, CTR +18%, viewability 72%",
			]
		},
		technologies: [
			"Vue",
			"VueX",
			"Nuxt",
			
			"SVG",
			"Paper.js",
			"SCSS",
			"Google Tag Manager",
			"Docker",
			"Figma",

			"HTML",
			"CSS",
			"JavaScript",
			
			"SSG",
			"SSR",
			"Microfrontends",

			"SOLID",
			"DRY",
			"KISS",

			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Responsive & Fluid Layout Systems",

			"Feature-Sliced Design",
			"Clean Architecture",
			"Atomic Design",
			"Flux",

			"Agile",
			"Scrum"
		],
	},
	{
		title: {
			en: "Junior Frontend Developer",
			ru: "Junior Frontend-разработчик",
		},
		icon: '/CV/icons/mkskom.svg',
		company: "[MKSKOM LLC](https://mkskom.ru/)",
		location: {
			en: "Moscow, Remote",
			ru: "Москва, Удалённо"
		},
		date_start: new Date(2021, 1, 1), // February 1, 2021
		date_end: new Date(2021, 7, 31), // August 31, 2021
		description: {
			"en": [
				"Built isolated SPA modules branching from a monolithic system, often integrating with legacy PHP and various frameworks",
				"Developed an internal UI-kit tailored for document workflows in a government-adjacent platform",
				"Created a highly dynamic editable table component with inline forms, nested interactions, and full mobile responsiveness",
				"Focused on UX for reducing repetitive bureaucratic steps through structured and smart interface automation"
			],
			"ru": [
				"Разрабатывал отдельные SPA-модули, подключающиеся к монолиту, включая интеграции с PHP и сторонними фреймворками",
				"Создал внутренний UI-kit под задачи документооборота",
				"Сделал сложную редактируемую таблицу с вложенными формами и адаптацией под мобильные устройства",
				"Оптимизировал UX для снижения ручного труда в бюрократических интерфейсах"
			],
		},
		technologies: [
			"Vue",
			"JavaScript",
			"SCSS",
			"SPA",
			"Figma",
			"HTML",
			"CSS",
			"CSR",
			"Design Systems",
			"Responsive & Fluid Layout Systems",

			"Modular Frontend",
			"Clean Architecture",
			"Atomic Design",
			"MVC",

			"DRY",
			"KISS",
			"SOLID",

			"Waterfall"
		],
	},
]; 