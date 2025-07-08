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

export interface EducationItem {
	icon?: string;
	degree: string | TranslatedText;
	specialization?: string | TranslatedText;
	institution: string | TranslatedText;
	date_start: Date;
	date_end: Date;
	highlights: string[] | TranslatedArray;
	projects?: string[] | TranslatedArray;
	technologies: string[];
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
		highlights: {
			en: [
				"Advanced Enterprise Programming on JavaScript course",
				"Courses in Product Design & Management (Agile, Scrum, Waterfall, Lean)",
				"Practiced backend/frontend/mobile development, studied data structures and algorithms",
				"Built procedurally generated solar system in Unity (algorithms used in [resume-site](https://lenargum.github.io/CV/) animation)"
			],
			ru: [
				"Продвинутый курс по JS (Advanced Enterprise Programming on JavaScript)",
				"Курсы по продуктовому дизайну и менеджменту (Agile, Scrum, Waterfall, Lean)",
				"Практиковал backend/frontend/mobile-разработку, изучал структуры данных и алгоритмы",
				"Создал процедурно-генерируемую солнечную систему в Unity (алгоритмы используются в анимации на [сайте-резюме](https://lenargum.github.io/CV/))"
			],
		},
		technologies: [
			"Frontend",
			"JavaScript",
			"TypeScript",
			"HTML",
			"CSS",
			"SCSS",
			"React",
			"Redux",
			"Figma",
			"Git",
			
			"UI/UX",
			"SPA",
			"Design Systems",
			"Accessibility",
			"Responsive & Fluid Layout Systems",

			"Agile",
			"Scrum",
			"Waterfall",
			"Lean",
			"Cowboy",

			"Backend",
			"CI/CD",
			"Docker",
			"Python Flask",
			"Python FastAPI",
			"Python Django",
			"Java Spring",

			"Mobile",
			"Android development",
			"Flutter",

			"Data Structures & Algorithms",

			"C#",
			"Unity",
		],
	},
]; 