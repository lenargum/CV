import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import { type ExperienceItem, type TranslatedText, type TranslatedArray } from '../data/experiences';
import Tag from './Tag/Tag';


interface ExperienceProps {
  experiences: ExperienceItem[];
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

// Calculate months between two dates
function monthsBetween(startDate: Date, endDate: Date | null): number {
  // Use current date if endDate is null (current position)
  const actualEndDate = endDate || new Date();

  const startYear = startDate.getFullYear();
  const endYear = actualEndDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endMonth = actualEndDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1; // +1 to include both start and end months
}

export default function Experience({ experiences }: ExperienceProps) {
  const { t, currentLang } = useTranslation();

  const getTranslatedValue = (value: string | TranslatedText): string => {
    if (typeof value === 'string') return value;
    return value[currentLang as keyof TranslatedText] || value.en;
  };

  const getTranslatedArray = (value: string[] | TranslatedArray): string[] => {
    if (Array.isArray(value)) return value;
    return value[currentLang as keyof TranslatedArray] || value.en;
  };

  // Format date range using date objects
  const getFormattedDateRange = (startDate: Date, endDate: Date | null, showDuration: boolean = false): string => {
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

    // Create the date range text without duration (duration will be added separately)
    return `${capitalizeFirstLetter(startFormatted)} — ${endDate ? capitalizeFirstLetter(endFormatted) : endFormatted}`;
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
      const months = monthsBetween(exp.date_start, exp.date_end);
      return total + months;
    }, 0);
  };

  const totalExperienceMonths = calculateTotalExperience();
  const totalExperienceText = formatDuration(totalExperienceMonths, currentLang);

  return (
    <section className="cv-section">
      <div className="flex flex-col md:flex-row md:items-baseline gap-x-3 mb-6">
        <h2 className="section-title">{t.sections.experience}</h2>
        <span className="text-text-tertiary text-sm">{totalExperienceText}</span>
      </div>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="subsection">
            <div className="flex flex-row items-start md:items-center gap-x-3 mb-4">
              <img src={exp.icon} alt={getTranslatedValue(exp.company)} className="md:w-20 md:h-20 w-10 h-10 backdrop-blur-[2px] rounded-xl flex-shrink-0 mt-2 md:mt-0" />
              <div className="flex flex-col">
                <h3 className="mb-1"><MarkdownText>{getTranslatedValue(exp.title)}</MarkdownText></h3>
                <h4 className="mb-1"><MarkdownText>{`${getTranslatedValue(exp.company)}, ${getTranslatedValue(exp.location)}`}</MarkdownText></h4>

                <div className="flex flex-row items-baseline gap-x-2">
                  <span className="text-text-tertiary text-sm">{getFormattedDateRange(exp.date_start, exp.date_end)}</span>
                  <span className="text-text-tertiary text-sm">
                    ({formatDuration(monthsBetween(exp.date_start, exp.date_end), currentLang, true)})
                  </span>
                </div>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {getTranslatedArray(exp.description).map((item, idx) => (
                <li key={idx}>
                  <MarkdownText>{item}</MarkdownText>
                </li>
              ))}
            </ul>
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.technologies.map((tech, idx) => (
                  <Tag key={idx} tag={tech} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 