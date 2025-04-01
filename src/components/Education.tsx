import { useTranslation } from '../i18n/useTranslation';

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

interface EducationItem {
  degree: string | TranslatedText;
  institution: string;
  location: string;
  period: string;
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
  
  // Translate dates using the translation mapping
  const getTranslatedDate = (date: string): string => {
    const dateTranslations = t?.experience?.dates as DateTranslations | undefined;
    return dateTranslations?.[date] || date;
  };
  
  return (
    <section className="cv-section">
      <h2 className="section-title">{t.sections.education}</h2>
      <div>
        {education.map((edu, index) => (
          <div key={index}>
            <div className="mb-4">
              <h3 className="mb-1">{getTranslatedValue(edu.degree)}, {edu.institution}, {edu.location}</h3>
              <span className="period">{getTranslatedDate(edu.period)}</span>
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