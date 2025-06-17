import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TAG_GROUPS, isTagInSpecificGroup } from '../data/tag-groups';
import type { TagGroupConfig } from '../data/tag-groups';
import Tag from './Tag/Tag';

interface TagsProps {
  allTags?: string[];
}

export default function Tags({ allTags = [] }: TagsProps) {
  const { t, currentLang } = useTranslation();

  // Categorize tags into groups
  const categorizedTags = React.useMemo(() => {
    const coreTags = allTags.filter(tag => TAG_GROUPS.CORE.tags.includes(tag));
    const frameworkTags = allTags.filter(tag => TAG_GROUPS.FRAMEWORKS.tags.includes(tag));
    const toolTags = allTags.filter(tag => TAG_GROUPS.TOOLS.tags.includes(tag));
    const conceptTags = allTags.filter(tag => TAG_GROUPS.CONCEPTS.tags.includes(tag));
    const unfilteredTags = allTags.filter(tag => !isTagInSpecificGroup(tag));

    const groups: Array<{ group: TagGroupConfig; tags: string[] }> = [];

    // Add Core group if has tags
    if (coreTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.CORE,
        tags: coreTags
      });
    }

    // Add Frameworks group if has tags
    if (frameworkTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.FRAMEWORKS,
        tags: frameworkTags
      });
    }

    // Add Tools group if has tags
    if (toolTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.TOOLS,
        tags: toolTags
      });
    }

    // Add Concepts group if has tags
    if (conceptTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.CONCEPTS,
        tags: conceptTags
      });
    }

    // Add Unfiltered group if has tags (for debugging)
    if (unfilteredTags.length > 0 && false) {
      groups.push({
        group: TAG_GROUPS.UNFILTERED,
        tags: unfilteredTags
      });
    }

    // Sort by priority
    return groups.sort((a, b) => a.group.priority - b.group.priority);
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