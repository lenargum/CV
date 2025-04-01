import { useTranslation } from '../i18n/useTranslation';
import { formatDateRange } from '../utils/formatters';

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

interface DateTranslations {
  [date: string]: string;
}

interface ExperienceItem {
  title: string | TranslatedText;
  company: string | TranslatedText;
  location: string;
  period: string;
  description: string[] | TranslatedArray;
  technologies?: string[];
}

interface ExperienceProps {
  experiences: ExperienceItem[];
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
  
  // Форматируем даты с использованием локализации
  const getFormattedDate = (period: string): string => {
    const locale = t.dateFormat?.locale || (currentLang === 'ru' ? 'ru-RU' : 'en-US');
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric' 
    };
    return formatDateRange(period, locale, options);
  };

  return (
    <section className="cv-section">
      <h2 className="section-title mb-8">{t.sections.experience}</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="subsection">
            <div className="flex flex-col mb-4">
              <h3 className="mb-1">{getTranslatedValue(exp.title)}, {getTranslatedValue(exp.company)}, {exp.location}</h3>
              <span className="period">{getFormattedDate(exp.period)}</span>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {getTranslatedArray(exp.description).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-text-secondary">
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