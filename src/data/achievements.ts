import type { ProfiledBullet, TranslatedText } from '../lib/types';

export type { TranslatedText };

export interface Achievement {
	details: string | TranslatedText | ProfiledBullet;
	subDetails?: string | TranslatedText | ProfiledBullet;
}

export interface ProfiledAchievement {
	details: ProfiledBullet;
	subDetails?: ProfiledBullet;
}

export const awards: ProfiledAchievement[] = [
	// === Хакатон Цифровой прорыв — везде ===
	{
		details: {
			base: {
				en: "**[Winner](https://drive.google.com/file/d/10u1auqW_GVIgAfGYHz08xgryAYLmBhtv/view?usp=sharing)**, Digital Breakthrough 2020 (Northwest IT Hub) hackathon",
				ru: "**[Победитель](https://drive.google.com/file/d/10u1auqW_GVIgAfGYHz08xgryAYLmBhtv/view?usp=sharing)**, Хакатон «Цифровой прорыв 2020» (Северо-Западный хаб)",
			},
			showIn: ['all'],
			overrides: {
				react: {
					en: "**Winner**, Digital Breakthrough 2020 Hackathon (Northwest IT Hub), 280 teams",
					ru: "**Победитель** хакатона «Цифровой прорыв 2020» (Северо-Западный хаб), 280 команд",
				},
				vue: {
					en: "**Winner**, Digital Breakthrough 2020 Hackathon (Northwest IT Hub), 280 teams",
					ru: "**Победитель** хакатона «Цифровой прорыв 2020» (Северо-Западный хаб), 280 команд",
				},
				fullstack: {
					en: "**Winner**, Digital Breakthrough 2020 Hackathon (Northwest IT Hub), 280 teams",
					ru: "**Победитель** хакатона «Цифровой прорыв 2020» (Северо-Западный хаб), 280 команд",
				},
			},
		},
		subDetails: {
			base: {
				en: "48 hours, among 280 teams",
				ru: "48 часов, среди 280 команд",
			},
			showIn: ['all'], // subDetails только для all, в профилях цифры в основном тексте
		},
	},
	// === OpenSpaceHack — везде ===
	{
		details: {
			base: {
				en: "**[Winner](https://drive.google.com/file/d/19JPJGf-PkWFJpKMI-nS9KoPa_w5A8K9C/view?usp=sharing)**, OpenSpaceHack 2020 hackathon",
				ru: "**[Победитель](https://drive.google.com/file/d/19JPJGf-PkWFJpKMI-nS9KoPa_w5A8K9C/view?usp=sharing)**, Хакатон OpenSpaceHack 2020",
			},
			showIn: ['all'],
			overrides: {
				react: {
					en: "**Winner**, OpenSpaceHack 2020",
					ru: "**Победитель** OpenSpaceHack 2020",
				},
				vue: {
					en: "**Winner**, OpenSpaceHack 2020",
					ru: "**Победитель** OpenSpaceHack 2020",
				},
				fullstack: {
					en: "**Winner**, OpenSpaceHack 2020",
					ru: "**Победитель** OpenSpaceHack 2020",
				},
			},
		},
		subDetails: {
			base: {
				en: "48 hours, among 37 teams",
				ru: "48 часов, среди 37 команд",
			},
			showIn: ['all'],
		},
	},
	// === InnoCTF — только all ===
	{
		details: {
			base: {
				en: "**4th Place**, InnoCTF 2018 (Cybersecurity)",
				ru: "**4-е место**, InnoCTF 2018 (Кибербезопасность)",
			},
			showIn: ['all'],
		},
		subDetails: {
			base: {
				en: "10 hours, among ~30 teams",
				ru: "10 часов, среди ~30 команд",
			},
			showIn: ['all'],
		},
	}
];

export const teaching: ProfiledAchievement[] = [
	// === Полная версия для all ===
	{
		details: {
			base: {
				en: "Taught high school students Android dev on Java, [robotics on Python](https://www.instagram.com/p/BmgLLKwn_uf/)",
				ru: "Обучал старшеклассников Android-разработке на Java, [робототехнике на Python](https://www.instagram.com/p/BmgLLKwn_uf/)"
			},
			showIn: ['all'],
		},
	},
	{
		details: {
			base: {
				en: "Taught kids programming on Python via Minecraft",
				ru: "Обучал детей программированию на Python в Minecraft"
			},
			showIn: ['all'],
		},
	},
	// === Краткая версия для профилей (опционально, одной строкой) ===
	{
		details: {
			base: {
				en: "Experience teaching programming (Android, Python, robotics)",
				ru: "Опыт преподавания программирования (Android, Python, робототехника)"
			},
			showIn: ['react', 'vue', 'fullstack'],
		},
	},
];