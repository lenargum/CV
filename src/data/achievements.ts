export interface TranslatedText {
	en: string;
	ru: string;
	[key: string]: string;
}

export interface Achievement {
	details: string | TranslatedText;
	subDetails?: string | TranslatedText;
}

export const achievements: Achievement[] = [
	{
		details: {
			en: "**[Winner](https://drive.google.com/file/d/10u1auqW_GVIgAfGYHz08xgryAYLmBhtv/view?usp=sharing)**, Digital Breakthrough 2020 (Northwest IT Hub) hackathon",
			ru: "**[Победитель](https://drive.google.com/file/d/10u1auqW_GVIgAfGYHz08xgryAYLmBhtv/view?usp=sharing)**, Хакатон «Цифровой прорыв 2020» (Северо-Западный хаб)",
		},
		subDetails: {
			en: "48 hours, among 280 teams",
			ru: "48 часов, среди 280 команд",
		},
	},
	{
		details: {
			en: "**[Winner](https://drive.google.com/file/d/19JPJGf-PkWFJpKMI-nS9KoPa_w5A8K9C/view?usp=sharing)**, OpenSpaceHack 2020 hackathon",
			ru: "**[Победитель](https://drive.google.com/file/d/19JPJGf-PkWFJpKMI-nS9KoPa_w5A8K9C/view?usp=sharing)**, Хакатон OpenSpaceHack 2020",
		},
		subDetails: {
			en: "48 hours, among 37 teams",
			ru: "48 часов, среди 37 команд",
		},
	},
	{
		details: {
			en: "**4th Place**, InnoCTF 2018 (Cybersecurity)",
			ru: "**4-е место**, InnoCTF 2018 (Кибербезопасность)",
		},
		subDetails: {
			en: "10 hours, among ~30 teams",
			ru: "10 часов, среди ~30 команд",
		},
	},
	{
		details: {
			en: "Taught high school students Android dev on Java, [robotics on Python](https://www.instagram.com/p/BmgLLKwn_uf/)",
			ru: "Обучал старшеклассников Android-разработке на Java, [робототехнике на Python](https://www.instagram.com/p/BmgLLKwn_uf/)"
		},
	},
	{
		details: {
			en: "Taught kids programming on Python via Minecraft",
			ru: "Обучал детей программированию на Python в Minecraft"
		},
	}
]; 