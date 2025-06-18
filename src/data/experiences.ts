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
	description: string[] | TranslatedArray;
	technologies?: string[];
}

export const experiences: ExperienceItem[] = [
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
				"Took major part in building a full-fledged [gaming platform inside Telegram](https://t.me/orbit_portal_bot), with integrated rewards, purchases, and ad systems — delivering most of the visual implementation and contributing to major parts of the logic beyond the core SDK integration",
				"Designed a flexible SDK overlay system for embedding UI elements into partner apps",
				"Ensured smooth performance under constrained Mini Apps environment by optimizing payloads and bundle sizes",
				"Delivered rich animated interactions using Motion.js, custom particle systems, and Spline-based lootbox animations",
				"Implemented full visual theming integration based on user-selected Telegram styles, ensuring seamless UX alignment"
			],
			"ru": [
				"Принимал ключевое участие в создании [игровой платформы в Telegram](https://t.me/orbit_portal_bot) с интеграцией наград, покупок и рекламы — отвечал за визуальную реализацию и значительную часть логики поверх SDK",
				"Проектировал гибкую SDK-обёртку для внедрения UI-компонентов в сторонние приложения",
				"Оптимизировал производительность в условиях Telegram Mini Apps за счёт уменьшения бандлов",
				"Реализовал насыщенные анимации с помощью Motion.js, кастомных частиц и анимаций с Spline",
				"Интегрировал визуальные темы на основе пользовательских настроек Telegram для целостного UX"
			]
		},
		technologies: [
			"React",
			"TypeScript",
			"Redux",
			"Zustand",
			"SPA",
			"Telegram Mini Apps",
			"Motion.js",
			"Tailwind",
			"Figma",
			"Cursor",
			"HTML",
			"CSS",
			"JavaScript",
			"SCSS",
			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Themability & Runtime Theming",
			"Responsive & Fluid Layout Systems",
			"Component Architecture",
			"Reusable UI components",
			"Agile",
			"Waterfall"
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
				"Created analytical dashboards aggregating advertising network stats into charts and visual summaries",
				"Led complete UI redesign from legacy Android-style interface to modern Material 3+ design system",
				"Delivered production-ready UI/UX and components under pressure while ensuring visual consistency and maintainability"
			],
			"ru": [
				"Разработал сложный редактор изображений и видео с поддержкой мультислоёв, пакетной загрузки текста/изображений/видео, системой таймлайна и анимаций",
				"Спроектировал и реализовал генератор рекламных баннеров с системой шаблонов и возможностью постредактирования",
				"Создал аналитические дашборды, агрегирующие статистику рекламных сетей в виде графиков и визуальных сводок",
				"Провёл полный редизайн интерфейса — от устаревшего Android-стиля до современной дизайн-системы Material 3+",
				"Поставлял продакшн-готовые UI/UX и компоненты в условиях сжатых сроков, сохраняя визуальную целостность и поддерживаемость"
			]
		},
		technologies: [
			"Vue",
			"TypeScript",
			"Pinia",
			"Tailwind",
			"Vuetify",
			"Chart.js",
			"SPA",
			"Google Tag Manager",
			"Yandex Metrica",
			"Docker",
			"Figma",
			"HTML",
			"CSS",
			"JavaScript",
			"SCSS",
			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Responsive & Fluid Layout Systems",
			"Component Architecture",
			"Reusable UI components",
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
				"Improved site performance by implementing lazy loading (images & components), server-side rendering, and image compression",
				"Maintained and enhanced the internal UI-kit shared across multiple projects, contributing accessibility fixes",
				"Configured and integrated ad blocks that enhanced UX while complying with multiple ad network guidelines",
				"Collaborated in a structured Scrum process with grooming, estimation (Scrum poker), and milestone-based planning aligned with backend and design pipelines"
			],
			"ru": [
				"Разработал [SVG-редактор Iconizer](https://icons8.com/iconizer) на Paper.js, с поддержкой [групповых скачиваний, редактируемых превью, подсветки кода, ролевого доступа](https://icons8.com/icon/83221/sun)",
				"Улучшил производительность сайта с помощью lazy loading, SSR и сжатия изображений",
				"Поддерживал и улучшал внутренний UI-kit, используемый в нескольких проектах",
				"Настроил рекламные блоки, улучшив UX и соблюдая требования рекламных сетей",
				"Работал по строгому Scrum-процессу с грумингами, покером и синхронизацией с командами бэкенда и дизайна"
			]
		},
		technologies: [
			"Vue",
			"JavaScript",
			"VueX",
			"Nuxt",
			"SSR",
			"SSG",
			"SVG",
			"Paper.js",
			"SCSS",
			"Google Tag Manager",
			"Docker",
			"Figma",
			"HTML",
			"CSS",
			"Design Systems",
			"Performance Optimization",
			"Motion & Interaction Design",
			"Responsive & Fluid Layout Systems",
			"Component Architecture",
			"Reusable UI components",
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
			"Design Systems",
			"Responsive & Fluid Layout Systems",
			"Component Architecture",
			"Reusable UI components",
		],
	},
]; 