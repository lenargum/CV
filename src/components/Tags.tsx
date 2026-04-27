import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TAG_GROUPS, getTagGroups, isTagInSpecificGroup } from '../data/tag-groups';
import type { TagGroupConfig } from '../data/tag-groups';
import Tag from './Tag/Tag';
import { HIDE_FROM_KEY_SKILLS } from '../data/tags';
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

      // Frameworks (React + Vue ecosystems) live in ONE group; per-tag colors
      // come from Tag.tsx (cyan for React-eco, emerald for Vue-eco) so the
      // ecosystem distinction is still readable inside the merged card.
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

  // Filter out meta-tags AND tags explicitly hidden from key skills
  const filterMetaTags = (tag: string) =>
    !['Backend', 'Frontend', 'Mobile'].includes(tag) &&
    !HIDE_FROM_KEY_SKILLS.has(tag);

  // === FLAT LAYOUT for react/vue/fullstack ===
  if (!isGroupedLayout) {
    return (
      <section className="cv-section">
        <h2 className="section-title">{t.sections.technologies}</h2>
        <div className="cv-tag-row">
          {allTags.filter(filterMetaTags).map((tag, index) => (
            <Tag key={index} tag={tag} profile={profile} />
          ))}
        </div>
      </section>
    );
  }

  // === GROUPED LAYOUT for 'all' profile — 2-col grid of inset skill-group cards ===
  return (
    <section className="cv-section">
      <h2 className="section-title">{t.sections.technologies}</h2>
      <div className="cv-skills">
        {categorizedTags.map(({ group, tags }, groupIndex) => (
          <div key={groupIndex} className="cv-skillgroup">
            <div className="cv-skillgroup__name">{getTranslatedGroupName(group)}</div>
            <div className="cv-tag-row">
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