import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TAG_GROUPS, isTagInSpecificGroup } from '../data/tag-groups';
import type { TagGroupConfig } from '../data/tag-groups';

interface TagsProps {
  allTags?: string[];
}

export default function Tags({ allTags = [] }: TagsProps) {
  const { t, currentLang } = useTranslation();

  // Categorize tags into groups
  const categorizedTags = React.useMemo(() => {
    const reactTags = allTags.filter(tag => TAG_GROUPS.REACT.tags.includes(tag));
    const vueTags = allTags.filter(tag => TAG_GROUPS.VUE.tags.includes(tag));
    const otherTags = allTags.filter(tag => !isTagInSpecificGroup(tag));

    const groups: Array<{ group: TagGroupConfig; tags: string[] }> = [];

    // Add React group if has tags
    if (reactTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.REACT,
        tags: reactTags
      });
    }

    // Add Vue group if has tags
    if (vueTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.VUE,
        tags: vueTags
      });
    }

    // Add Others group if has tags
    if (otherTags.length > 0) {
      groups.push({
        group: TAG_GROUPS.OTHERS,
        tags: otherTags
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categorizedTags.map(({ group, tags }, groupIndex) => {
          // Determine column span: Others gets 2 columns, React and Vue get 1 each
          const isOthers = group.priority === 1;
          const colSpan = isOthers ? 'md:col-span-2' : 'md:col-span-1';
          
          return (
            <div key={groupIndex} className={`subsection ${colSpan} mt-0`}>
              <h3 className="text-lg font-medium text-text-primary mb-3">
                {getTranslatedGroupName(group)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="tech-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
} 