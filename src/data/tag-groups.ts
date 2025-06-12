/**
 * Tag group configuration for the Technologies section
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
    OTHERS: {
        name: {
            en: 'Main',
            ru: 'Основные'
        },
        tags: [], // Will be populated with remaining tags
        priority: 1
    },

    REACT: {
        name: {
            en: 'React',
            ru: 'React'
        },
        tags: [
            'React',
            'Redux',
            'Zustand',
            'Next',
            'Motion.js'
        ],
        priority: 2
    },

    VUE: {
        name: {
            en: 'Vue',
            ru: 'Vue'
        },
        tags: [
            'Vue',
            'VueX',
            'Pinia',
            'Nuxt',
            'Vuetify'
        ],
        priority: 3
    }
};

/**
 * Get all defined tag groups sorted by priority
 */
export function getTagGroups(): TagGroupConfig[] {
    return Object.values(TAG_GROUPS).sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a tag belongs to any specific group (excluding OTHERS)
 */
export function isTagInSpecificGroup(tag: string): boolean {
    return Object.entries(TAG_GROUPS)
        .filter(([key]) => key !== 'OTHERS')
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