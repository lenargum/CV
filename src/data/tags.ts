import { experiences } from './experiences';
import type { ProfileType } from '../lib/types';

// Core concepts
export const CORE_TAGS = [
  "Frontend",
  "Backend",
  "Mobile",
  "Data Structures & Algorithms",
  "Game Development"
];

// Frontend Core technologies
export const FRONTEND_CORE_TAGS = [
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "SCSS",
  "Git",
  "CI/CD",
];

// Ecosystems
export const REACT_ECOSYSTEM_TAGS = ["React", "Redux", "Zustand", "Next.js", "shadcn/ui", "Aceternity UI"];
export const VUE_ECOSYSTEM_TAGS = ["Vue", "Vuex", "Pinia", "Nuxt", "Vuetify"];

// Backend
export const BACKEND_TAGS = [
  "Go",
  "PostgreSQL",
  "Redis",
  "MongoDB",
  "Docker",
  "REST API",
  "Microservices",
  "Message Queues",
  "SQL",
  "NoSQL",
];

// Tools & visualization
export const TOOLING_TAGS = [
  "Tailwind",
  "Figma",
  "Telegram Mini Apps (TMA)",
  "Google Tag Manager",
  "Yandex Metrica",

  "Motion.js",
  "Paper.js",
  "Chart.js",
  "SVG",
  "Cursor",
  "Claude",
  "ChatGPT",
];

// Rendering types
export const RENDERING_TAGS = ["SPA", "SSR", "SSG", "CSR"];

// UI / Visual concepts
export const UI_VISUAL_TAGS = [
  "UI/UX",
  "Motion & Interaction Design",
  "Responsive & Fluid Layout Systems",
  "Themability & Runtime Theming",
  "Accessibility",
];

// Architecture & patterns
export const ARCHITECTURE_TAGS = [
  "Design Systems",
  "Feature-Sliced Design",
  "Atomic Design",
  "Clean Architecture",
  "MVC",
  "MVVM",
  "State Management",
  "Flux",
  "Microfrontends",
  "Modular Frontend",
];

export const MOBILE_TAGS = [
  "Flutter",
  "Android",
  "iOS"
];

// Principles
export const PRINCIPLES_TAGS = [
  "Web Performance Optimization",
  "SOLID",
  "DRY",
  "KISS",
  "YAGNI",
];

// Processes
export const PROCESS_TAGS = [
  "Agile",
  "Scrum",
  "Lean",
  "Waterfall"
];

// Manual tags composed from building blocks
export const manualTags = [
  ...CORE_TAGS,
  ...FRONTEND_CORE_TAGS,
  ...REACT_ECOSYSTEM_TAGS,
  ...VUE_ECOSYSTEM_TAGS,
  ...BACKEND_TAGS,
  ...TOOLING_TAGS,
  ...UI_VISUAL_TAGS,
  ...RENDERING_TAGS,
  ...ARCHITECTURE_TAGS,
  ...MOBILE_TAGS,
  ...PRINCIPLES_TAGS,
  ...PROCESS_TAGS,
];


export const TAGS_PRIORITY = [
  ...REACT_ECOSYSTEM_TAGS,
  ...VUE_ECOSYSTEM_TAGS,
  ...BACKEND_TAGS,
  ...TOOLING_TAGS,
  ...UI_VISUAL_TAGS,
  ...RENDERING_TAGS,
  ...ARCHITECTURE_TAGS,
  ...MOBILE_TAGS,
  ...PRINCIPLES_TAGS,
  ...PROCESS_TAGS,
  ...CORE_TAGS,
  ...FRONTEND_CORE_TAGS,
];

// Helper to extract all technologies from experience (handles both formats)
function extractTechnologies(tech: string[] | { base: string[]; byProfile?: Record<string, string[]> } | undefined): string[] {
  if (!tech) return [];
  if (Array.isArray(tech)) return tech;
  // ProfiledTechnologies: collect from base and all profiles
  const all = [...tech.base];
  if (tech.byProfile) {
    Object.values(tech.byProfile).forEach(profileTechs => {
      profileTechs.forEach(t => {
        if (!all.includes(t)) all.push(t);
      });
    });
  }
  return all;
}

// Function to extract and sort tags from experiences
export const generateTags = (): string[] => {
  return [...new Set([
    ...manualTags,
    ...experiences.flatMap((exp) => extractTechnologies(exp.technologies)),
  ])];
};

// === Profile-specific tag configuration ===

/** 
 * Explicit tag lists per profile for "Key Skills" section
 * These are the main skills shown prominently at the top
 */
const KEY_SKILLS_BY_PROFILE: Record<ProfileType, string[]> = {
  react: [
    "React", "TypeScript", "Next.js", "Redux", "Zustand",
    "Tailwind", "Web Performance Optimization", "CI/CD",
    "Telegram Mini Apps (TMA)", "Motion.js", "shadcn/ui",
    "Git", "REST API"
  ],
  vue: [
    "Vue", "TypeScript", "Nuxt", "Pinia",
    "Tailwind", "Vuetify",
    "Web Performance Optimization", "Git", "REST API"
  ],
  fullstack: [
    "React", "TypeScript", "Next.js", "Zustand", "Tailwind",
    "Go", "REST API", "WebSockets", "Microservices",
    "PostgreSQL", "Redis", "MongoDB", "TimescaleDB",
    "Docker", "CI/CD", "Git"
  ],
  all: [], // empty means use generateTags()
};

/** Tags to hide per profile (for filtering generateTags result) */
const PROFILE_HIDE_TAGS: Partial<Record<ProfileType, string[]>> = {
  react: [...VUE_ECOSYSTEM_TAGS],
  vue: [...REACT_ECOSYSTEM_TAGS],
  // fullstack and all show everything
};

/** Tags to highlight (prioritize) per profile */
const PROFILE_HIGHLIGHT_TAGS: Partial<Record<ProfileType, string[]>> = {
  react: [...REACT_ECOSYSTEM_TAGS, "Telegram Mini Apps (TMA)", "Motion.js"],
  vue: [...VUE_ECOSYSTEM_TAGS, "Chart.js", "Paper.js"],
  fullstack: ["Go", "PostgreSQL", "Redis", "Docker", "CI/CD", ...REACT_ECOSYSTEM_TAGS],
  all: [], // no special highlighting
};

/**
 * Get tags filtered and sorted for a specific profile
 */
export function getTagsForProfile(profile: ProfileType): string[] {
  // If profile has explicit key skills list, use it
  const keySkills = KEY_SKILLS_BY_PROFILE[profile];
  if (keySkills && keySkills.length > 0) {
    return keySkills;
  }

  // Otherwise, filter from all tags (for 'all' profile)
  const allTags = generateTags();
  const hideTags = PROFILE_HIDE_TAGS[profile] || [];
  const highlightTags = PROFILE_HIGHLIGHT_TAGS[profile] || [];

  // Filter out hidden tags
  const filteredTags = allTags.filter(tag => !hideTags.includes(tag));

  // Sort: highlighted tags first (in their highlight order), then the rest
  return filteredTags.sort((a, b) => {
    const aHighlight = highlightTags.indexOf(a);
    const bHighlight = highlightTags.indexOf(b);

    // Both highlighted — sort by highlight order
    if (aHighlight !== -1 && bHighlight !== -1) {
      return aHighlight - bHighlight;
    }
    // Only a is highlighted
    if (aHighlight !== -1) return -1;
    // Only b is highlighted  
    if (bHighlight !== -1) return 1;

    // Neither highlighted — use default priority
    return 0;
  });
}
