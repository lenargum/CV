import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import type { ComposedEducation, ProfileType } from '../lib/types';
import Tag from './Tag/Tag';
import { withBasePath } from '../lib/utils';

export interface EducationProps {
  education: ComposedEducation[];
  profile: ProfileType;
}

export default function Education({ education, profile }: EducationProps) {
  const { t } = useTranslation();

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
      <h2 className="section-title">{t.sections.education}</h2>
      <div>
        {education.map((edu, index) => (
          <div key={index}>
            <div className="flex flex-row items-start md:items-center gap-x-3 md:mb-4">
              <img src={withBasePath(edu.icon || '')} alt={edu.institution} className="md:w-20 md:h-20 w-10 h-10 rounded-xl flex-shrink-0 mt-2 md:mt-0" />
              <div className="flex flex-col">
                <h3 className="md:mb-1">
                  {edu.degree}
                  {edu.specialization && <span className="font-normal">, {edu.specialization}</span>}
                </h3>
                <div className="flex flex-col print:flex-row print:items-baseline print:gap-x-2">
                  <MarkdownText as="span" className="font-normal">{edu.institution}</MarkdownText>
                  <span className="text-text-tertiary text-sm">{getFormattedDateRange(edu.dateStart, edu.dateEnd)}</span>
                </div>
              </div>
            </div>
            <ul className="list-disc">
              {edu.highlights.map((highlight, idx) => (
                <li key={idx}>
                  <MarkdownText>{highlight}</MarkdownText>
                </li>
              ))}
            </ul>
            {edu.technologies && edu.technologies.length > 0 && <div className="flex flex-wrap gap-2 mt-3">
              {edu.technologies.map((tech, idx) => (
                <Tag key={idx} tag={tech} profile={profile} />
              ))}
            </div>}
          </div>
        ))}
      </div>
    </section>
  );
}
