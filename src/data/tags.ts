import { experiences } from './experiences';

export const manualTags = [
  // Core technologies
  "TypeScript", "JavaScript", "HTML", "CSS", "SCSS", "Tailwind", "Figma", "Git", "CI/CD", "Docker",
  
  // Frameworks
  "React", "Redux", "Zustand", "Next", "Vue", "VueX", "Pinia", "Nuxt", "Vuetify",
  
  // Tools
  "Google Tag Manager", "Yandex Metrica", "Paper.js", "Motion.js", "Telegram Mini Apps",
  
  // Concepts
  "UI/UX", "SPA", "Design Systems", "Accessibility", "Performance Optimization", 
  "Component Architecture", "SSR", "SSG", "Microfrontends", "Motion & Interaction Design",
  "Responsive & Fluid Layout Systems", "Themability & Runtime Theming", 
  "Reusable UI components", "Agile", "Scrum", "Waterfall", "Lean",
];

// Priority technologies to appear first
const priorityTechnologies = [
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
  
  "React",
  "Redux",
  "Zustand",
  "Next",
  "Vue",
  "VueX", 
  "Pinia",
  "Nuxt",
  "Vuetify",
  
  
  "Motion.js",
  "Paper.js",
  "SVG",
  "SPA",
  "SSR",
  "SSG",
  "Google Tag Manager",
  "Yandex Metrica",
  "Telegram Mini Apps",

  "UI/UX",
  "Design Systems",
  "Accessibility",
  "Performance Optimization",
  "Component Architecture",
  "Microfrontends",
  "Motion & Interaction Design",
  "Responsive & Fluid Layout Systems",
  "Themability & Runtime Theming",
  "Reusable UI components",
  "Agile",
  "Scrum",
  "Waterfall",
  "Lean"
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