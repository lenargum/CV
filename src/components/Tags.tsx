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

  // Name-based mapping (uses group.name.en as a stable key — i18n-independent).
  // Layout intent (md, 12-col grid, by row):
  //   Row 0: Core(4) + Domains(4) + React(4)
  //   Row 1: Vue(3) + Rendering(2) + Backend(7)
  //   Row 2: Tools(6) + UX & Visual(6)
  //   Row 3: Architecture(8) + Mobile(4)
  //   Row 4: Principles(8) + Process(4)
  const COL_SPANS: Record<string, string> = {
    'Core':         'col-span-6 md:col-span-4 print:col-span-4',
    'Domains':      'col-span-6 md:col-span-4 print:col-span-4',
    'React':        'col-span-6 md:col-span-4 print:col-span-4',
    'Vue':          'col-span-6 md:col-span-3 print:col-span-3',
    'Rendering':    'col-span-4 md:col-span-2 print:col-span-2',
    'Backend':      'col-span-8 md:col-span-7 print:col-span-7',
    'Tools':        'col-span-12 md:col-span-6 print:col-span-6',
    'UX & Visual':  'col-span-12 md:col-span-6 print:col-span-6',
    'Architecture': 'col-span-12 md:col-span-8 print:col-span-8',
    'Mobile':       'col-span-4 md:col-span-4 print:col-span-4',
    'Principles':   'col-span-4 md:col-span-8 print:col-span-8',
    'Process':      'col-span-4 md:col-span-4 print:col-span-4',
  };
  const FALLBACK_SPAN = 'col-span-6 md:col-span-6 print:col-span-6';

  const getCardCols = (group: TagGroupConfig): string =>
    COL_SPANS[group.name.en] ?? FALLBACK_SPAN;

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
              getCardCols(group)
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