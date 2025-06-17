import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import { type EducationItem, type TranslatedText, type TranslatedArray } from '../data/education';
import Tag from './Tag/Tag';

export interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  const { t, currentLang } = useTranslation();

  const getTranslatedValue = (value: string | TranslatedText): string => {
    if (typeof value === 'string') return value;
    return value[currentLang as keyof TranslatedText] || value.en;
  };

  const getTranslatedArray = (value: string[] | TranslatedArray): string[] => {
    if (Array.isArray(value)) return value;
    return value[currentLang as keyof TranslatedArray] || value.en;
  };

  // Format date range using date objects - only show years for education
  const getFormattedDateRange = (startDate: Date, endDate: Date): string => {
    // For education, we only need years
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    // Return simple year range
    return `${startYear} — ${endYear}`;
  };

  return (
    <section className="cv-section">
      <h2 className="section-title mb-6">{t.sections.education}</h2>
      <div>
        {education.map((edu, index) => (
          <div key={index}>
            <div className="flex flex-row items-start md:items-center gap-x-3 mb-4">
              <img src={edu.icon} alt={getTranslatedValue(edu.institution)} className="md:w-20 md:h-20 w-10 h-10 rounded-xl flex-shrink-0 mt-2 md:mt-0" />
              <div className="flex flex-col">
                <h3 className="mb-1">
                  {getTranslatedValue(edu.degree)}
                  {edu.specialization && <span className="font-normal">, {getTranslatedValue(edu.specialization)}</span>}
                </h3>
                <MarkdownText as="span" className="font-normal">{getTranslatedValue(edu.institution)}</MarkdownText>
                <span className="text-text-secondary">{getFormattedDateRange(edu.date_start, edu.date_end)}</span>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {getTranslatedArray(edu.highlights).map((highlight, idx) => (
                <li key={idx}>
                  <MarkdownText>{highlight}</MarkdownText>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-3">
              {edu.technologies.map((tech, idx) => (
                <Tag key={idx} tag={tech} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 