import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import type { ComposedEducation, ProfileType } from '../lib/types';
import Tag from './Tag/Tag';
import { withBasePath } from '../lib/utils';

export interface EducationProps {
  education: ComposedEducation[];
  profile: ProfileType;
  nested?: boolean;
}

export default function Education({ education, profile, nested = false }: EducationProps) {
  const { t } = useTranslation();

  // Format date range using date objects - only show years for education
  const getFormattedDateRange = (startDate: Date, endDate: Date): string => {
    // For education, we only need years
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    // Return simple year range
    return `${startYear} — ${endYear}`;
  };

  const Wrapper = nested ? 'div' : 'section';
  const wrapperClass = nested ? '' : 'cv-section';
  const HeadingTag = nested ? 'h3' : 'h2';
  const headingClass = nested ? 'subsection-title' : 'section-title';

  return (
    <Wrapper className={wrapperClass}>
      <HeadingTag className={headingClass}>{t.sections.education}</HeadingTag>
      <div className="cv-stack">
        {education.map((edu, index) => (
          <article key={index} className="cv-exp cv-exp--edu print:break-inside-avoid">
            <div className="cv-exp__head">
              <img src={withBasePath(edu.icon || '')} alt={edu.institution} className="cv-exp__icon" />
              <div className="cv-exp__heading">
                <div className="cv-exp__company">
                  {edu.degree}
                  {edu.specialization && <span className="font-normal opacity-75">, {edu.specialization}</span>}
                </div>
                {/* Institution + years on a single flex row — degree text is
                    long ("Bachelor of Computer Science, Software Engineer"),
                    so a separate top-right meta column would float weirdly
                    once degree wraps. Inline keeps them visually paired. */}
                <div className="cv-edu__inst-row">
                  <div className="cv-exp__title">
                    <MarkdownText as="span">{edu.institution}</MarkdownText>
                  </div>
                  <div className="cv-edu__years">{getFormattedDateRange(edu.dateStart, edu.dateEnd)}</div>
                </div>
              </div>
            </div>
            {edu.highlights.length > 0 && (
              <ul className="cv-exp__bullets">
                {edu.highlights.map((highlight, idx) => (
                  <li key={idx}>
                    <MarkdownText>{highlight}</MarkdownText>
                  </li>
                ))}
              </ul>
            )}
            {edu.technologies && edu.technologies.length > 0 && (
              <div className="cv-exp__tags">
                {edu.technologies.map((tech, idx) => (
                  <Tag key={idx} tag={tech} profile={profile} />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Wrapper>
  );
}
