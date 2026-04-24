import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TAG_GROUPS, getTagGroups, isTagInSpecificGroup } from '../data/tag-groups';
import type { TagGroupConfig } from '../data/tag-groups';
import Tag from './Tag/Tag';
import { REACT_ECOSYSTEM_TAGS, VUE_ECOSYSTEM_TAGS } from '@/data/tags';
import type { ProfileType } from '../lib/types';

interface TagsProps {
  allTags?: string[];
  profile: ProfileType;
}

export default function Tags({ allTags = [], profile }: TagsProps) {
  const { t, currentLang } = useTranslation();

  // For non-all profiles: simple flat list
  const isGroupedLayout = profile === 'all';

  // Categorize tags into groups (only used for 'all' profile)
  const categorizedTags = React.useMemo(() => {
    if (!isGroupedLayout) return [];

    const groups: Array<{ group: TagGroupConfig; tags: string[] }> = [];

    // Get all tag groups and process them dynamically
    const allTagGroups = getTagGroups();
    
    for (const group of allTagGroups) {
      // Skip UNFILTERED group in normal processing
      if (group === TAG_GROUPS.UNFILTERED) {
        continue;
      }

      const groupTags = allTags.filter(tag => group.tags.includes(tag));

      if (group === TAG_GROUPS.FRAMEWORKS) {
        // Split frameworks into React and Vue ecosystems (reuse shared constants)
        const reactFamily = new Set(REACT_ECOSYSTEM_TAGS);
        const vueFamily = new Set(VUE_ECOSYSTEM_TAGS);

        const reactTags = groupTags.filter(tag => reactFamily.has(tag));
        const vueTags = groupTags.filter(tag => vueFamily.has(tag));

        if (reactTags.length > 0) {
          groups.push({
            group: {
              name: { en: 'React', ru: 'React' },
              tags: reactTags,
              priority: group.priority
            } as TagGroupConfig,
            tags: reactTags
          });
        }

        if (vueTags.length > 0) {
          groups.push({
            group: {
              name: { en: 'Vue', ru: 'Vue' },
              tags: vueTags,
              priority: group.priority
            } as TagGroupConfig,
            tags: vueTags
          });
        }

        continue;
      }

      if (groupTags.length > 0) {
        groups.push({
          group,
          tags: groupTags
        });
      }
    }

    // Add Unfiltered group if has tags (for debugging)
    const unfilteredTags = allTags.filter(tag => !isTagInSpecificGroup(tag));
    if (unfilteredTags.length > 0 && false) {
      groups.push({
        group: TAG_GROUPS.UNFILTERED,
        tags: unfilteredTags
      });
    }

    return groups;
  }, [allTags, isGroupedLayout]);

  const getTranslatedGroupName = (group: TagGroupConfig): string => {
    return group.name[currentLang as keyof typeof group.name] || group.name.en;
  };

  const getCardCols = (index: number): string => {
    // Simple, deterministic layout tuned for groups
    switch (index) {
      case 0: return 'col-span-6 md:col-span-4 print:col-span-4'; // Core
      case 1: return 'col-span-6 md:col-span-5 print:col-span-4'; // React ecosystem
      case 2: return 'col-span-6 md:col-span-3 print:col-span-4'; // Vue ecosystem

      case 3: return 'col-span-6  md:col-span-2 print:col-span-2'; // Rendering
      case 4: return 'col-span-12 md:col-span-4 print:col-span-4'; // Backend
      case 5: return 'col-span-12 md:col-span-6 print:col-span-6'; // Tools

      case 6: return 'col-span-12 md:col-span-5 print:col-span-5'; // UX & Visual
      case 7: return 'col-span-12 md:col-span-7 print:col-span-7'; // Architecture

      case 8: return 'col-span-3 md:col-span-3 print:col-span-3'; // Mobile
      case 9: return 'col-span-5 md:col-span-5 print:col-span-5'; // Principles
      case 10: return 'col-span-4 md:col-span-4 print:col-span-4'; // Process

      default: return 'col-span-6 md:col-span-6 print:col-span-6';
    }
  };

  // Filter out meta-tags like 'Backend', 'Frontend', 'Mobile'
  const filterMetaTags = (tag: string) => !['Backend', 'Frontend', 'Mobile'].includes(tag);

  // === FLAT LAYOUT for react/vue/fullstack ===
  if (!isGroupedLayout) {
    return (
      <section className="cv-section">
        <h2 className="section-title">{t.sections.technologies}</h2>
        <div className="flex flex-wrap gap-2 print:gap-1">
          {allTags.filter(filterMetaTags).map((tag, index) => (
            <Tag key={index} tag={tag} profile={profile} />
          ))}
        </div>
      </section>
    );
  }

  // === GROUPED LAYOUT for 'all' profile ===
  return (
    <section className="cv-section">
      <h2 className="section-title">{t.sections.technologies}</h2>
      <div className="grid grid-cols-12 gap-3 print:gap-2 -mx-4 md:m-0 print:m-0">
        {categorizedTags.map(({ group, tags }, groupIndex) => (
          <div
            key={groupIndex}
            className={[
              'rounded-xl bg-primary-bg/80 backdrop-blur-sm p-4 flex flex-col gap-3 print:p-0 print:gap-1',
              getCardCols(groupIndex)
            ].join(' ')}
          >
            <h3 className="text-base md:text-lg font-semibold text-text-primary tracking-tight" style={{lineHeight: '1'}}>{getTranslatedGroupName(group)}</h3>
            <div className="flex flex-wrap gap-2 print:gap-1">
              {tags.filter(filterMetaTags).map((tag, index) => (
                <Tag key={index} tag={tag} profile={profile} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 