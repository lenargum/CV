export interface PersonalInfoLink {
	name: string;
	url: string;
	icon: string;
	displayText: string;
}

export interface PersonalInfo {
	name: string;
	title: string;
	email: string;
	links: PersonalInfoLink[];
}

export const personalInfo: PersonalInfo = {
	name: "Lenar Gumerov",
	title: "Frontend Developer",
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