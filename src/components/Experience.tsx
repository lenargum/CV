import { useTranslation } from '../i18n/useTranslation';
import { formatDateRange } from '../utils/formatters';
import { MarkdownText } from '../utils/markdown';

interface TranslatedText {
  en: string;
  ru: string;
  [key: string]: string;
}

interface TranslatedArray {
  en: string[];
  ru: string[];
  [key: string]: string[];
}

interface ExperienceItem {
  title: string | TranslatedText;
  company: string | TranslatedText;
  location: string;
  date_start: Date;
  date_end: Date | null;
  description: string[] | TranslatedArray;
  technologies?: string[];
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

// Helper function to format duration in years and months
function formatDuration(months: number, lang: string): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (lang === 'ru') {
    // Russian format
    let result = '';
    if (years > 0) {
      // Basic Russian pluralization
      if (years === 1) {
        result += `${years} год`;
      } else if (years >= 2 && years <= 4) {
        result += `${years} года`;
      } else {
        result += `${years} лет`;
      }
    }
    
    if (remainingMonths > 0) {
      if (result) result += ' ';
      
      // Basic Russian pluralization for months
      if (remainingMonths === 1) {
        result += `${remainingMonths} месяц`;
      } else if (remainingMonths >= 2 && remainingMonths <= 4) {
        result += `${remainingMonths} месяца`;
      } else {
        result += `${remainingMonths} месяцев`;
      }
    }
    
    return result || '< 1 месяц';
  } else {
    // English format
    let result = '';
    if (years > 0) {
      result += `${years} ${years === 1 ? 'year' : 'years'}`;
    }
    
    if (remainingMonths > 0) {
      if (result) result += ' ';
      result += `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    }
    
    return result || '< 1 month';
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
      month: 'long', 
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
            <div className="flex flex-col mb-4">
              <h3 className="mb-1"><MarkdownText>{`${getTranslatedValue(exp.title)}, ${getTranslatedValue(exp.company)}, ${exp.location}`}</MarkdownText></h3>
              <div className="flex flex-col md:flex-row md:items-baseline gap-x-3">
                <span className="text-text-secondary">{getFormattedDateRange(exp.date_start, exp.date_end)}</span>
                <span className="text-text-tertiary text-sm">
                  {formatDuration(monthsBetween(exp.date_start, exp.date_end), currentLang)}
                </span>
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
                  <span key={idx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 