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
              <img
                src={withBasePath(edu.icon || '')}
                alt={edu.institution}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="cv-exp__icon"
              />
              {/* Mirror the Experience block structure:
                    cv-exp__company = degree (large, bold)
                    cv-exp__title   = specialization (subtitle)
                    cv-exp__meta    = years (top) + institution (bottom),
                                      analog of dates + location in Experience. */}
              <div className="cv-exp__heading">
                <div className="cv-exp__company">{edu.degree}</div>
                {edu.specialization && (
                  <div className="cv-exp__title">{edu.specialization}</div>
                )}
              </div>
              <div className="cv-exp__meta">
                <div>{getFormattedDateRange(edu.dateStart, edu.dateEnd)}</div>
                <div className="cv-exp__loc">
                  <MarkdownText as="span">{edu.institution}</MarkdownText>
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
