import { useTranslation } from '../i18n/useTranslation';

interface TagsProps {
  allTags?: string[];
}

export default function Tags({ allTags = [] }: TagsProps) {
  const { t } = useTranslation();

  return (
    <section className="cv-section">
      <h2 className="section-title">{t.sections.technologies}</h2>
      <div className="space-y-8">
        {allTags.length > 0 && (
          <div className="subsection">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <span
                  key={index}
                  className="tech-tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 