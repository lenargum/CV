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
import {
  FRONTEND_CORE_TAGS,
  REACT_ECOSYSTEM_TAGS,
  VUE_ECOSYSTEM_TAGS,
  TOOLING_TAGS,
  UI_VISUAL_TAGS,
  RENDERING_TAGS,
  ARCHITECTURE_TAGS,
  PRINCIPLES_TAGS,
  PROCESS_TAGS,
} from '@/data/tags';

export const TAG_GROUPS: Record<string, TagGroupConfig> = {
    CORE: {
      name: {
        en: 'Core',
        ru: 'Основные'
      },
      tags: FRONTEND_CORE_TAGS,
      priority: 1
    },
  
    FRAMEWORKS: {
      name: {
        en: 'Frameworks',
        ru: 'Фреймворки'
      },
      tags: [...REACT_ECOSYSTEM_TAGS, ...VUE_ECOSYSTEM_TAGS],
      priority: 2
    },

    RENDERING: {
      name: {
        en: 'Rendering',
        ru: 'Рендеринг'
      },
      tags: RENDERING_TAGS,
      priority: 3
    },
  
    TOOLS: {
      name: {
        en: 'Tools',
        ru: 'Инструменты'
      },
      tags: TOOLING_TAGS,
      priority: 4
    },
  
    UX_VISUAL: {
      name: {
        en: 'UX & Visual',
        ru: 'UX и Визуал'
      },
      tags: UI_VISUAL_TAGS,
      priority: 5
    },

    

    ARCHITECTURE: {
      name: {
        en: 'Architecture',
        ru: 'Архитектура'
      },
      tags: ARCHITECTURE_TAGS,
      priority: 6
    },

    PRINCIPLES: {
      name: {
        en: 'Principles',
        ru: 'Принципы'
      },
      tags: PRINCIPLES_TAGS,
      priority: 7
    },

    PROCESS: {
      name: {
        en: 'Process',
        ru: 'Процессы'
      },
      tags: PROCESS_TAGS,
      priority: 8
    },
  
    UNFILTERED: {
      name: {
        en: 'Others',
        ru: 'Остальные'
      },
      tags: [],
      priority: 9
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