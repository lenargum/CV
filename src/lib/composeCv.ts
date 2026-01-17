import type {
	ProfileType,
	LangType,
	TranslatedText,
	TranslatedArray,
	ProfiledText,
	ProfiledBullet,
	ProfiledTechnologies,
	ComposedCV,
	ComposedPersonalInfo,
	ComposedExperience,
	ComposedEducation,
	ComposedAchievement,
} from './types';
import {
	isTranslatedText,
	isTranslatedArray,
	isProfiledText,
	isProfiledBulletArray,
	isProfiledTechnologies,
} from './types';

import { personalInfo } from '../data/personal-info';
import { summary } from '../data/summary';
import { experiences } from '../data/experiences';
import { education } from '../data/education';
import { awards, teaching } from '../data/achievements';
import { generateTags, getTagsForProfile } from '../data/tags';

// === Text Extraction Helpers ===

/**
 * Extract text from TranslatedText by language
 */
export function getText(value: string | TranslatedText, lang: LangType): string {
	if (typeof value === 'string') return value;
	return value[lang] || value.en;
}

/**
 * Extract text from ProfiledText by profile and language
 * Falls back to base if no profile override exists
 */
export function getProfiledText(value: string | TranslatedText | ProfiledText, profile: ProfileType, lang: LangType): string {
	// Plain string
	if (typeof value === 'string') return value;
	
	// ProfiledText (has base)
	if (isProfiledText(value)) {
		const override = value.profiles?.[profile];
		if (override) {
			return override[lang] || override.en;
		}
		return value.base[lang] || value.base.en;
	}
	
	// TranslatedText (no base, just en/ru)
	return value[lang] || value.en;
}

/**
 * Extract array of strings from TranslatedArray or ProfiledBullet[] 
 * Filters by profile when using ProfiledBullet[]
 */
export function getBullets(
	value: string[] | TranslatedArray | ProfiledBullet[] | undefined,
	profile: ProfileType,
	lang: LangType
): string[] {
	if (!value) return [];
	
	// Plain string array
	if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
		return value as string[];
	}
	
	// ProfiledBullet[] (new format)
	if (isProfiledBulletArray(value)) {
		return (value as ProfiledBullet[])
			.filter(bullet => {
				// If showIn is not specified, show in all profiles
				if (!bullet.showIn || bullet.showIn.length === 0) return true;
				return bullet.showIn.includes(profile);
			})
			.map(bullet => {
				// Check for profile-specific override
				const override = bullet.overrides?.[profile];
				if (override) {
					return override[lang] || override.en;
				}
				return bullet.base[lang] || bullet.base.en;
			});
	}
	
	// TranslatedArray (old format)
	if (isTranslatedArray(value)) {
		return value[lang] || value.en;
	}
	
	return [];
}

/**
 * Extract technologies list for a specific profile
 * Supports both plain string[] and ProfiledTechnologies
 */
export function getTechnologies(
	value: string[] | ProfiledTechnologies | undefined,
	profile: ProfileType
): string[] {
	if (!value) return [];
	
	// Plain string array — return as-is for 'all', filter for other profiles
	if (Array.isArray(value)) {
		return value;
	}
	
	// ProfiledTechnologies
	if (isProfiledTechnologies(value)) {
		// If profile has specific list, use it
		const profileList = value.byProfile?.[profile];
		if (profileList) {
			return profileList;
		}
		// Otherwise use base (same as 'all')
		return value.base;
	}
	
	return [];
}

// === Main Composer ===

export function composeCv(profile: ProfileType, lang: LangType): ComposedCV {
	// === Personal Info ===
	const composedPersonalInfo: ComposedPersonalInfo = {
		name: personalInfo.name,
		title: getProfiledText(personalInfo.title, profile, lang),
		email: personalInfo.email,
		description: getProfiledText(personalInfo.description, profile, lang),
		links: personalInfo.links,
	};

	// === Summary ===
	const composedSummary = getProfiledText(summary.content, profile, lang);

	// === Experiences ===
	const composedExperiences: ComposedExperience[] = experiences.map(exp => ({
		title: getProfiledText(exp.title, profile, lang),
		icon: exp.icon,
		company: getText(exp.company, lang),
		location: getText(exp.location, lang),
		dateStart: exp.date_start,
		dateEnd: exp.date_end,
		description: getBullets(exp.description, profile, lang),
		technologies: getTechnologies(exp.technologies, profile),
	}));

	// === Education ===
	const composedEducation: ComposedEducation[] = education.map(edu => ({
		icon: edu.icon,
		degree: getText(edu.degree, lang),
		specialization: edu.specialization ? getText(edu.specialization, lang) : undefined,
		institution: getText(edu.institution, lang),
		dateStart: edu.date_start,
		dateEnd: edu.date_end,
		highlights: getBullets(edu.highlights, profile, lang),
		projects: edu.projects ? getBullets(edu.projects, profile, lang) : undefined,
		technologies: getTechnologies(edu.technologies, profile),
	}));

	// === Awards ===
	const composedAwards: ComposedAchievement[] = awards
		.filter(award => {
			// Filter by showIn if it's a ProfiledBullet
			const details = award.details;
			if (!details.showIn || details.showIn.length === 0) return true;
			return details.showIn.includes(profile) || details.overrides?.[profile];
		})
		.map(award => {
			const details = award.details;
			const subDetails = award.subDetails;
			
			// Get details text (with override support)
			const override = details.overrides?.[profile];
			const detailsText = override 
				? (override[lang] || override.en)
				: (details.base[lang] || details.base.en);
			
			// Get subDetails text (only if visible for this profile)
			let subDetailsText: string | undefined;
			if (subDetails) {
				const showSub = !subDetails.showIn || subDetails.showIn.length === 0 || subDetails.showIn.includes(profile);
				if (showSub) {
					const subOverride = subDetails.overrides?.[profile];
					subDetailsText = subOverride
						? (subOverride[lang] || subOverride.en)
						: (subDetails.base[lang] || subDetails.base.en);
				}
			}
			
			return { details: detailsText, subDetails: subDetailsText };
		});

	// === Teaching ===
	const composedTeaching: ComposedAchievement[] = teaching
		.filter(t => {
			const details = t.details;
			if (!details.showIn || details.showIn.length === 0) return true;
			return details.showIn.includes(profile) || details.overrides?.[profile];
		})
		.map(t => {
			const details = t.details;
			const subDetails = t.subDetails;
			
			const override = details.overrides?.[profile];
			const detailsText = override 
				? (override[lang] || override.en)
				: (details.base[lang] || details.base.en);
			
			let subDetailsText: string | undefined;
			if (subDetails) {
				const showSub = !subDetails.showIn || subDetails.showIn.length === 0 || subDetails.showIn.includes(profile);
				if (showSub) {
					const subOverride = subDetails.overrides?.[profile];
					subDetailsText = subOverride
						? (subOverride[lang] || subOverride.en)
						: (subDetails.base[lang] || subDetails.base.en);
				}
			}
			
			return { details: detailsText, subDetails: subDetailsText };
		});

	// === Tags ===
	const composedTags = getTagsForProfile(profile);

	return {
		profile,
		lang,
		personalInfo: composedPersonalInfo,
		summary: composedSummary,
		experiences: composedExperiences,
		education: composedEducation,
		awards: composedAwards,
		teaching: composedTeaching,
		tags: composedTags,
	};
}
