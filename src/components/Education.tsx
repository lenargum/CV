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

interface EducationItem {
  degree: string | TranslatedText;
  institution: string;
  location: string;
  date_start: Date;
  date_end: Date;
  highlights: string[] | TranslatedArray;
  projects?: string[] | TranslatedArray;
}

interface EducationProps {
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
      <h2 className="section-title">{t.sections.education}</h2>
      <div>
        {education.map((edu, index) => (
          <div key={index}>
            <div className="mb-4">
              <h3 className="mb-1">{getTranslatedValue(edu.degree)}, {edu.institution}, {edu.location}</h3>
              <span className="period">{getFormattedDateRange(edu.date_start, edu.date_end)}</span>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {getTranslatedArray(edu.highlights).map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
            
            {edu.projects && (
              <ul className="list-disc ml-5 space-y-1.5 mt-3 pr-2">
                {getTranslatedArray(edu.projects).map((project, idx) => (
                  <li key={idx}>{project}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 