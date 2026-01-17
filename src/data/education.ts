import type { ProfiledBullet, ProfiledTechnologies, TranslatedText, TranslatedArray } from '../lib/types';

export type { TranslatedText, TranslatedArray };

export interface EducationItem {
	icon?: string;
	degree: string | TranslatedText;
	specialization?: string | TranslatedText;
	institution: string | TranslatedText;
	date_start: Date;
	date_end: Date;
	highlights: ProfiledBullet[] | TranslatedArray;
	projects?: ProfiledBullet[] | TranslatedArray;
	technologies: string[] | ProfiledTechnologies;
}

export const education: EducationItem[] = [
	{
		icon: '/CV/icons/iu.jpg',
		degree: {
			en: "Bachelor of Computer Science",
			ru: "Бакалавр компьютерных наук",
		},
		specialization: {
			en: "Software Engineer",
			ru: "Программный инженер"
		},
		institution: {
			en: "[Innopolis University](https://innopolis.university/en/)",
			ru: "[Университет Иннополис](https://innopolis.university/)"
		},
		date_start: new Date(2017, 7, 1), // August 1, 2017
		date_end: new Date(2021, 4, 31), // May 31, 2021
		highlights: [
			// === ALL — полная версия для сайта ===
			{
				base: {
					en: "Advanced Enterprise Programming on JavaScript course",
					ru: "Продвинутый курс по JavaScript (Advanced Enterprise Programming on JavaScript)"
				},
				showIn: ['all'],
			},
			{
				base: {
					en: "Courses in Product Design & Management",
					ru: "Курсы по продуктовому дизайну и менеджменту"
				},
				showIn: ['all'],
			},
			{
				base: {
					en: "Hands-on backend, frontend, and mobile development; data structures and algorithms",
					ru: "Практика backend / frontend / mobile-разработки, структуры данных и алгоритмы"
				},
				showIn: ['all'],
			},
			{
				base: {
					en: "Project: procedurally generated solar system in Unity (algorithms reused in [resume-site](https://lenargum.github.io/CV/) animation)",
					ru: "Проект: процедурно-генерируемая солнечная система в Unity (алгоритмы используются в анимации [сайта-резюме](https://lenargum.github.io/CV/))"
				},
				showIn: ['all'],
			},

			// === REACT / VUE — фокус на JS, дизайн, DSA ===
			{
				base: {
					en: "Advanced JavaScript coursework",
					ru: "Продвинутый курс по JavaScript"
				},
				showIn: ['react', 'vue'],
			},
			{
				base: {
					en: "Product design and management fundamentals",
					ru: "Продуктовый дизайн и менеджмент"
				},
				showIn: ['react', 'vue'],
			},
			{
				base: {
					en: "Data structures and algorithms",
					ru: "Структуры данных и алгоритмы"
				},
				showIn: ['react', 'vue'],
			},
			{
				base: {
					en: "Frontend and UI-focused academic projects",
					ru: "Учебные проекты по frontend и UI/UX"
				},
				showIn: ['react', 'vue'],
			},

			// === FULLSTACK — чуть шире ===
			{
				base: {
					en: "Advanced JavaScript and application architecture",
					ru: "Продвинутый JavaScript и архитектура приложений"
				},
				showIn: ['fullstack'],
			},
			{
				base: {
					en: "Frontend and backend development practice",
					ru: "Практика frontend и backend-разработки"
				},
				showIn: ['fullstack'],
			},
			{
				base: {
					en: "Data structures and algorithms",
					ru: "Структуры данных и алгоритмы"
				},
				showIn: ['fullstack'],
			},
			{
				base: {
					en: "Academic and applied projects",
					ru: "Учебные и прикладные проекты"
				},
				showIn: ['fullstack'],
			},
		],
		technologies: {
			base: [],
			byProfile: {
				react: [],
				vue: [],
				fullstack: [],
				all: [
					"JavaScript",
					"TypeScript",
					"HTML",
					"CSS",
					"SCSS",
					"Git",
					"CI/CD",
					"Docker",
					"Figma",
					"React",
					"Redux",

					"SPA",
					"UI/UX",
					"Accessibility",
					"Responsive & Fluid Layout Systems",
					"Design Systems",

					"Agile",
					"Scrum",
					"Waterfall",
					"Lean",

					"REST API",
					"SQL",
					"PostgreSQL",
					"MySQL",
					"SQLite",
					"NoSQL",
					"Redis",
					"MongoDB",
					"Python Flask",
					"Python FastAPI",
					"Python Django",
					"Java Spring",

					"Android",
					"Flutter",

					"Data Structures & Algorithms",

					"Game Dev",
					"C#",
					"Unity",
				]
			}
		},
	},
];
