// === Profile Types ===

export type ProfileType = 'react' | 'vue' | 'fullstack' | 'all';
export type LangType = 'en' | 'ru';

export const PROFILES: ProfileType[] = ['react', 'vue', 'fullstack', 'all'];
export const LANGS: LangType[] = ['en', 'ru'];

// === Translated Text Types ===

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

// === Profiled Data Types ===

/**
 * Text with profile-specific overrides
 * Base is used when no override exists for profile
 */
export interface ProfiledText {
	base: TranslatedText;
	/** Override text for specific profiles (optional — falls back to base) */
	profiles?: Partial<Record<ProfileType, TranslatedText>>;
}

/**
 * Single bullet point with profile support
 */
export interface ProfiledBullet {
	/** Base text (used if no override for profile) */
	base: TranslatedText;
	/** Which profiles to show this bullet in. If omitted — show in all */
	showIn?: ProfileType[];
	/** Override text for specific profiles (shown instead of base) */
	overrides?: Partial<Record<ProfileType, TranslatedText>>;
}

// === Experience Sections ===

export type ExperienceCategory = 'product' | 'architecture' | 'performance' | 'process';

/** A group of bullets within an experience. Omit `cat` for an unlabeled (flat) group. */
export interface ExperienceSection {
	cat?: ExperienceCategory;
	items: ProfiledBullet[];
}

/**
 * Tags/technologies with profile-specific filtering
 */
export interface ProfiledTags {
	/** All tags (canonical list) */
	base: string[];
	/** Per-profile: which tags to highlight/hide */
	profiles?: Partial<Record<ProfileType, {
		highlight?: string[];
		hide?: string[];
	}>>;
}

/**
 * Technologies list with profile-specific show/hide
 * Used in experiences and education
 */
export interface ProfiledTechnologies {
	/** Base list of technologies (shown in 'all' profile) */
	base: string[];
	/** Override entire list for specific profile */
	byProfile?: Partial<Record<ProfileType, string[]>>;
}

// === Composed (View Model) Types ===

export interface ComposedPersonalInfo {
	name: string;
	title: string;
	email: string;
	links: {
		name: string;
		url: string;
		icon: string;
		displayText: string;
	}[];
	description: string;
}

export interface ComposedSection {
	/** Resolved category label in current language; undefined → render without heading */
	label?: string;
	items: string[];
}

export interface ComposedExperience {
	title: string;
	icon?: string;
	company: string;
	location: string;
	dateStart: Date;
	dateEnd: Date | null;
	intro?: string;
	sections: ComposedSection[];
	/** Flat union of all section items — kept for pdf/og/copy back-compat */
	description: string[];
	technologies: string[];
}

export interface ComposedEducation {
	icon?: string;
	degree: string;
	specialization?: string;
	institution: string;
	dateStart: Date;
	dateEnd: Date;
	highlights: string[];
	projects?: string[];
	technologies: string[];
}

export interface ComposedAchievement {
	details: string;
	subDetails?: string;
}

export interface ComposedCV {
	profile: ProfileType;
	lang: LangType;
	personalInfo: ComposedPersonalInfo;
	summary: string;
	experiences: ComposedExperience[];
	education: ComposedEducation[];
	awards: ComposedAchievement[];
	teaching: ComposedAchievement[];
	tags: string[];
}

// === Helper type guards ===

export function isTranslatedText(value: unknown): value is TranslatedText {
	return typeof value === 'object' && value !== null && 'en' in value && 'ru' in value;
}

export function isTranslatedArray(value: unknown): value is TranslatedArray {
	return typeof value === 'object' && value !== null && 
		'en' in value && 'ru' in value &&
		Array.isArray((value as TranslatedArray).en) && 
		Array.isArray((value as TranslatedArray).ru);
}

export function isProfiledText(value: unknown): value is ProfiledText {
	return typeof value === 'object' && value !== null && 'base' in value;
}

export function isProfiledBulletArray(value: unknown): value is ProfiledBullet[] {
	return Array.isArray(value) && value.length > 0 && 'base' in value[0];
}

export function isExperienceSectionArray(value: unknown): value is ExperienceSection[] {
	return Array.isArray(value) && value.length > 0 &&
		typeof value[0] === 'object' && value[0] !== null && 'items' in value[0];
}

export function isProfiledTechnologies(value: unknown): value is ProfiledTechnologies {
	return typeof value === 'object' && value !== null && 'base' in value && Array.isArray((value as ProfiledTechnologies).base);
}
