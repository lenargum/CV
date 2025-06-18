import { experiences } from './experiences';

export const manualTags = [
  // Core technologies
  "TypeScript", "JavaScript", "HTML", "CSS", "SCSS", "Tailwind", "Figma", "Git", "CI/CD", "Docker",

  // Frameworks
  "React", "Redux", "Zustand", "Next", "Vue", "VueX", "Pinia", "Nuxt", "Vuetify",

  // Tools
  "Google Tag Manager", "Yandex Metrica", "Paper.js", "Motion.js", "Chart.js", "Telegram Mini Apps",

  // Concepts
  "UI/UX",
  "Motion & Interaction Design",
  "Responsive & Fluid Layout Systems",
  "Themability & Runtime Theming",
  "Accessibility",

  "SPA",
  "SSR",
  "SSG",
  "CSR",
  "Microfrontends",

  "Design Systems",
  "Reusable UI components",
  "Component Architecture",
  "Feature-Sliced Design",
  "Atomic Design",
  "Clean Architecture",
  "MVC",
  "MVVM",

  "Performance Optimization",
  "State Management",
  "CQRS",
  "Flux",

  "SOLID",
  "DRY",
  "KISS",

  "Agile",
  "Scrum",
  "Lean",
  "Waterfall"
];

const priorityTechnologies = [
  // Core Tech
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "SCSS",
  "Tailwind",
  "Figma",
  "Git",
  "CI/CD",
  "Docker",

  // Frameworks & State
  "React",
  "Redux",
  "Zustand",
  "Next",
  "Vue",
  "VueX",
  "Pinia",
  "Nuxt",
  "Vuetify",

  // Visualization & Tools
  "Motion.js",
  "Paper.js",
  "Chart.js",
  "SVG",
  "Google Tag Manager",
  "Yandex Metrica",
  "Telegram Mini Apps",

  // Rendering Types
  "SPA",
  "SSR",
  "SSG",
  "CSR",

  // UI / Visual Concepts
  "UI/UX",
  "Motion & Interaction Design",
  "Responsive & Fluid Layout Systems",
  "Themability & Runtime Theming",
  "Accessibility",
  "Reusable UI components",
  "Design Systems",

  // Architecture & Patterns
  "Component Architecture",
  "Feature-Sliced Design",
  "Atomic Design",
  "Clean Architecture",
  "MVC",
  "MVVM",
  "State Management",
  "Microfrontends",
  "Flux",
  "CQRS",

  // Principles
  "Performance Optimization",
  "SOLID",
  "DRY",
  "KISS",

  // Processes
  "Agile",
  "Scrum",
  "Lean",
  "Waterfall"
];

// Function to extract and sort tags from experiences
export const generateTags = () => {
  return [...new Set([
    ...manualTags,
    ...experiences.flatMap((exp) => exp.technologies || []),

  ])].sort((a, b) => {
    const aPriority = priorityTechnologies.indexOf(a);
    const bPriority = priorityTechnologies.indexOf(b);

    // If both are priority technologies, sort by their order in the priority array
    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    // If only a is a priority technology, it comes first
    if (aPriority !== -1) return -1;
    // If only b is a priority technology, it comes first
    if (bPriority !== -1) return 1;
    // Otherwise, sort alphabetically
    return a.localeCompare(b);
  });
}; 