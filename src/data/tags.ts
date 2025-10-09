import { experiences } from './experiences';

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
export const REACT_ECOSYSTEM_TAGS = ["React", "Redux", "Zustand", "Next"];
export const VUE_ECOSYSTEM_TAGS = ["Vue", "Vuex", "Pinia", "Nuxt", "Vuetify"];

// Tools & visualization
export const TOOLING_TAGS = [
  "Tailwind",
  "Figma",
  "Docker",
  "Telegram Mini Apps",
  "Google Tag Manager",
  "Yandex Metrica",
  "shadcn/ui",
  "Motion.js",
  "Aceternity UI",
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

// Principles
export const PRINCIPLES_TAGS = [
  "Performance Optimization",
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
  ...TOOLING_TAGS,
  ...UI_VISUAL_TAGS,
  ...RENDERING_TAGS,
  ...ARCHITECTURE_TAGS,
  ...PRINCIPLES_TAGS,
  ...PROCESS_TAGS,
];

// Priority list determines ordering weight during sorting
export const PRIORITY_TECHNOLOGIES = [
  ...CORE_TAGS,
  ...FRONTEND_CORE_TAGS,
  ...REACT_ECOSYSTEM_TAGS,
  ...VUE_ECOSYSTEM_TAGS,
  ...RENDERING_TAGS,
  ...TOOLING_TAGS,
  ...UI_VISUAL_TAGS,
  ...ARCHITECTURE_TAGS,
  ...PRINCIPLES_TAGS,
  ...PROCESS_TAGS,
];

// Function to extract and sort tags from experiences
export const generateTags = () => {
  return [...new Set([
    ...manualTags,
    ...experiences.flatMap((exp) => exp.technologies || []),
  ])].sort((a, b) => {
    const aPriority = PRIORITY_TECHNOLOGIES.indexOf(a);
    const bPriority = PRIORITY_TECHNOLOGIES.indexOf(b);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return a.localeCompare(b);
  });
};

