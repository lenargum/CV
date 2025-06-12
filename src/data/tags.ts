import { experiences } from './experiences';

export const manualTags = ["Next", "Git", "CI/CD", "Design", "UI/UX"];

// Priority technologies to appear first
const priorityTechnologies = [
  "HTML",
  "CSS",
  
  "JavaScript",
  "TypeScript",
  "React",
  "Redux",
  "Zustand",
  "Next",
  "Vue",
  "VueX",
  "Pinia",
  "Nuxt",
  "SCSS",
  "Tailwind",
  "Design",
  "UI/UX",
  "Figma",
  "Git",
  "CI/CD",
  "Docker",
  "SPA",
  "Cursor",
  "Motion.js",
  "SVG",
  "Paper.js",
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