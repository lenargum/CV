import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import type { ComposedExperience, ProfileType } from '../lib/types';
import Tag from './Tag/Tag';
import { withBasePath } from '../lib/utils';
import { TAGS_PRIORITY } from '@/data/tags';


interface ExperienceProps {
  experiences: ComposedExperience[];
  profile: ProfileType;
}

// Helper function to format duration in years and months
function formatDuration(months: number, lang: string, shorten: boolean = false): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (lang === 'ru') {
    // Russian format
    let result = '';
    if (years > 0) {
      // Basic Russian pluralization
      if (years === 1) {
        result += `${years} ${shorten ? 'г' : 'год'}`;
      } else if (years >= 2 && years <= 4) {
        result += `${years} ${shorten ? 'г' : 'года'}`;
      } else {
        result += `${years} лет`;
      }
    }

    if (remainingMonths > 0) {
      if (result) result += ' ';

      // Basic Russian pluralization for months
      if (remainingMonths === 1) {
        result += `${remainingMonths} ${shorten ? 'мес' : 'месяц'}`;
      } else if (remainingMonths >= 2 && remainingMonths <= 4) {
        result += `${remainingMonths} ${shorten ? 'мес' : 'месяца'}`;
      } else {
        result += `${remainingMonths} ${shorten ? 'мес' : 'месяцев'}`;
      }
    }

    return result || '< 1 ' + (shorten ? 'мес' : 'месяц');
  } else {
    // English format
    let result = '';
    if (years > 0) {
      result += `${years} ${shorten ? 'y' : years === 1 ? 'year' : 'years'}`;
    }

    if (remainingMonths > 0) {
      if (result) result += ' ';
      result += `${remainingMonths} ${shorten ? 'm' : remainingMonths === 1 ? 'month' : 'months'}`;
    }

    return result || '< 1 ' + (shorten ? 'm' : 'month');
  }
}

// Calculate months between two dates (rounded to nearest month from actual day-difference)
function monthsBetween(startDate: Date, endDate: Date | null): number {
  // Use current date if endDate is null (current position)
  const actualEndDate = endDate || new Date();

  const diffMs = actualEndDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diffDays / 30.44)); // average month length; min 1 to avoid "0 мес"
}

export default function Experience({ experiences, profile }: ExperienceProps) {
  const { t, currentLang } = useTranslation();

  // Format date range using date objects
  const getFormattedDateRange = (startDate: Date, endDate: Date | null): string => {
    const locale = t.dateFormat?.locale || (currentLang === 'ru' ? 'ru-RU' : 'en-US');
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric'
    };

    // Format start date
    const startFormatted = new Intl.DateTimeFormat(locale, options).format(startDate);

    // Format end date or use "Present" text if null
    let endFormatted;
    if (endDate) {
      endFormatted = new Intl.DateTimeFormat(locale, options).format(endDate);
    } else {
      endFormatted = currentLang === 'ru' ? 'По настоящее время' : 'Present';
    }

    if (endDate) {
      // Create the date range text without duration (duration will be added separately)
      return `${capitalizeFirstLetter(startFormatted)} — ${capitalizeFirstLetter(endFormatted)}`;
    } else {
      return `${currentLang === 'ru' ? 'С' : 'From'} ${capitalizeFirstLetter(startFormatted)}`;
    }


  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Calculate total experience in months - cumulative approach
  const calculateTotalExperience = (): number => {
    // Simply sum the duration of each position - this counts overlapping months multiple times
    // which better represents the cumulative experience gained across different roles
    return experiences.reduce((total, exp) => {
      const months = monthsBetween(exp.dateStart, exp.dateEnd);
      return total + months;
    }, 0);
  };

  const totalExperienceMonths = calculateTotalExperience();
  const totalExperienceText = formatDuration(totalExperienceMonths, currentLang);

  const compareByPriority = (a: string, b: string) => {
    const ai = TAGS_PRIORITY.indexOf(a);
    const bi = TAGS_PRIORITY.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  };

  return (
    <section className="cv-section">
      <div className="mb-4 print:mb-1 flex items-baseline">
        <h2 className="section-title !mb-0">{t.sections.experience}</h2>
        <span className="section-meta">{totalExperienceText}</span>
      </div>
      <div className="cv-stack">
        {experiences.map((exp, index) => (
          <article key={index} className="cv-exp print:break-inside-avoid">
            <div className="cv-exp__head">
              <img
                src={withBasePath(exp.icon || '')}
                alt={exp.company}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="cv-exp__icon"
              />
              <div className="cv-exp__heading">
                <div className="cv-exp__company"><MarkdownText>{exp.company}</MarkdownText></div>
                <div className="cv-exp__title"><MarkdownText>{exp.title}</MarkdownText></div>
              </div>
              <div className="cv-exp__meta">
                <div>
                  {/* Desktop: "duration · dates". Mobile (<=480): swap to
                      "dates · duration" so the most-scannable info (when)
                      comes first. CSS hides one or the other per breakpoint. */}
                  <span className="cv-exp__dates--desktop">
                    <span className="cv-exp__dur">{formatDuration(monthsBetween(exp.dateStart, exp.dateEnd), currentLang, true)} · </span>
                    {getFormattedDateRange(exp.dateStart, exp.dateEnd)}
                  </span>
                  <span className="cv-exp__dates--mobile">
                    {getFormattedDateRange(exp.dateStart, exp.dateEnd)}
                    <span className="cv-exp__dur"> · {formatDuration(monthsBetween(exp.dateStart, exp.dateEnd), currentLang, true)}</span>
                  </span>
                </div>
                <div className="cv-exp__loc">{exp.location}</div>
              </div>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="cv-exp__bullets">
                {exp.description.map((item, idx) => (
                  <li key={idx}>
                    <MarkdownText>{item}</MarkdownText>
                  </li>
                ))}
              </ul>
            )}
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="cv-exp__tags">
                {profile === 'all'
                  ? [...exp.technologies].sort(compareByPriority).map((tech, idx) => <Tag key={idx} tag={tech} profile={profile} />)
                  : [...exp.technologies].map((tech, idx) => <Tag key={idx} tag={tech} profile={profile} />)}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
