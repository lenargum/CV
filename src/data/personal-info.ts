import type { ProfiledText, TranslatedText, ProfileType } from '../lib/types';
import { summary } from './summary';

const extractMetaDescription = (text: string) => text.split('\n')[0].trim();
const buildMetaDescription = (entry: TranslatedText) => ({
	en: extractMetaDescription(entry.en),
	ru: extractMetaDescription(entry.ru),
});
const getSummaryTextForProfile = (profile: ProfileType) =>
	summary.content.profiles?.[profile] ?? summary.content.base;

export interface PersonalInfoLink {
	name: string;
	url: string;
	icon: string;
	displayText: string;
}

export interface PersonalInfo {
	name: string;
	title: string | ProfiledText;
	email: string;
	description: ProfiledText;
	links: PersonalInfoLink[];
}

export const personalInfo: PersonalInfo = {
	name: "Lenar Gumerov",
	// === Title & Subtitle by profile ===
	title: {
		base: { en: "Software Engineer (Frontend-focused)", ru: "Software Engineer (Frontend-focused)" },
		profiles: {
			react:     { en: "Senior Frontend Engineer", ru: "Senior Frontend Engineer" },
			vue:       { en: "Senior Frontend Engineer", ru: "Senior Frontend Engineer" },
			fullstack: { en: "Fullstack Engineer (Frontend-focused)", ru: "Fullstack Engineer (Frontend-focused)" },
		},
	},
	description: {
		base: buildMetaDescription(summary.content.base),
		profiles: {
			fullstack: buildMetaDescription(getSummaryTextForProfile("fullstack")),
			all: buildMetaDescription(getSummaryTextForProfile("all")),
		},
	},
	email: "lenargamgam@gmail.com",
	links: [
		{
			name: "Telegram",
			url: "https://t.me/lenargum",
			icon: "telegram",
			displayText: "@lenargum",
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/in/lenar-gumerov-13593b190/",
			icon: "linkedin",
			displayText: "Lenar Gumerov",
		},
		{
			name: "GitHub",
			url: "https://github.com/lenargum",
			icon: "github",
			displayText: "lenargum",
		},
		{
			name: "Instagram",
			url: "https://www.instagram.com/lenargum",
			icon: "instagram",
			displayText: "lenargum",
		},
	],
};
