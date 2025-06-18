import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TAG_GROUPS, getTagGroups, isTagInSpecificGroup } from '../data/tag-groups';
import type { TagGroupConfig } from '../data/tag-groups';
import Tag from './Tag/Tag';

interface TagsProps {
  allTags?: string[];
}

export default function Tags({ allTags = [] }: TagsProps) {
  const { t, currentLang } = useTranslation();

  // Categorize tags into groups
  const categorizedTags = React.useMemo(() => {
    const groups: Array<{ group: TagGroupConfig; tags: string[] }> = [];

    // Get all tag groups and process them dynamically
    const allTagGroups = getTagGroups();
    
    for (const group of allTagGroups) {
      // Skip UNFILTERED group in normal processing
      if (group === TAG_GROUPS.UNFILTERED) {
        continue;
      }

      const groupTags = allTags.filter(tag => group.tags.includes(tag));
      
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
  }, [allTags]);

  const getTranslatedGroupName = (group: TagGroupConfig): string => {
    return group.name[currentLang as keyof typeof group.name] || group.name.en;
  };

  return (
    <section className="cv-section">
      <h2 className="section-title mb-6">{t.sections.technologies}</h2>
      <div className="space-y-4">
        {categorizedTags.map(({ group, tags }, groupIndex) => (
          <div key={groupIndex} className="subsection mt-0 flex flex-wrap gap-2 items-baseline">
            <h3 className="text-lg font-medium text-text-primary">{getTranslatedGroupName(group)}:</h3>
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
} 