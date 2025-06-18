/**
 * Tag group configuration for the Key Skills section
 * Edit these constants to modify tag categorization
 */

export interface TagGroupConfig {
    name: { en: string; ru: string };
    tags: string[];
    priority: number;
}

/**
 * Editable tag group constants
 * Add/remove/modify groups as needed
 */
export const TAG_GROUPS: Record<string, TagGroupConfig> = {
    CORE: {
      name: {
        en: 'Core',
        ru: 'Основные'
      },
      tags: [
        'TypeScript',
        'JavaScript',
        'HTML',
        'CSS',
        'SCSS',
        'Tailwind',
        'Figma',
        'Git',
        'CI/CD',
        'Docker'
      ],
      priority: 1
    },
  
    FRAMEWORKS: {
      name: {
        en: 'Frameworks',
        ru: 'Фреймворки'
      },
      tags: [
        'React',
        'Redux',
        'Zustand',
        'Next',
        'Vue',
        'VueX',
        'Pinia',
        'Nuxt',
        'Vuetify'
      ],
      priority: 2
    },
  
    TOOLS: {
      name: {
        en: 'Tools',
        ru: 'Инструменты'
      },
      tags: [
        'Motion.js',
        'Paper.js',
        'Chart.js',
        'SVG',
        'Google Tag Manager',
        'Yandex Metrica',
        'Telegram Mini Apps'
      ],
      priority: 3
    },
  
    CONCEPTS: {
      name: {
        en: 'Concepts',
        ru: 'Концепции'
      },
      tags: [
        // UX & visual
        'UI/UX',
        'Motion & Interaction Design',
        'Responsive & Fluid Layout Systems',
        'Themability & Runtime Theming',
        'Accessibility',
  
        // Rendering
        'SPA',
        'SSR',
        'SSG',
        'CSR',
  
        // Architecture
        'Design Systems',
        'Reusable UI components',
        'Component Architecture',
        'Feature-Sliced Design',
        'Atomic Design',
        'Clean Architecture',
        'MVC',
        'MVVM',
        'State Management',
        'Microfrontends',
        'Flux',
        'CQRS',
  
        // Principles
        'Performance Optimization',
        'SOLID',
        'DRY',
        'KISS',
  
        // Process
        'Agile',
        'Scrum',
        'Lean',
        'Waterfall'
      ],
      priority: 4
    },
  
    UNFILTERED: {
      name: {
        en: 'Others',
        ru: 'Остальные'
      },
      tags: [],
      priority: 5
    }
  };
  

/**
 * Get all defined tag groups sorted by priority
 */
export function getTagGroups(): TagGroupConfig[] {
    return Object.values(TAG_GROUPS).sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a tag belongs to any specific group (excluding UNFILTERED)
 */
export function isTagInSpecificGroup(tag: string): boolean {
    return Object.entries(TAG_GROUPS)
        .filter(([key]) => key !== 'UNFILTERED')
        .some(([, group]) => group.tags.includes(tag));
}

/**
 * Get the group that contains a specific tag
 */
export function getTagGroup(tag: string): TagGroupConfig | null {
    const entry = Object.entries(TAG_GROUPS).find(([, group]) =>
        group.tags.includes(tag)
    );
    return entry ? entry[1] : null;
} 