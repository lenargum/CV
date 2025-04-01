import { useTranslation } from '../i18n/useTranslation';

interface TranslatedText {
  en: string;
  ru: string;
  [key: string]: string;
}

interface Achievement {
  title: string;
  details: string | TranslatedText;
  subDetails?: string | TranslatedText;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  const { t, currentLang } = useTranslation();
  
  const getTranslatedValue = (value: string | TranslatedText): string => {
    if (typeof value === 'string') return value;
    return value[currentLang as keyof TranslatedText] || value.en;
  };
  
  return (
    <section className="cv-section achievements-section">
      <h2 className="section-title">{t.sections.achievements}</h2>
      <div className="space-y-4 pr-2">
        {achievements.map((achievement, index) => (
          <div key={index} className="mb-4 achievement-item">
            <h3 className="mb-1">{achievement.title}</h3>
            <p>{getTranslatedValue(achievement.details)}</p>
            {achievement.subDetails && (
              <p className="subtle-text mt-1">• {getTranslatedValue(achievement.subDetails)}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 