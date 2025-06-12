import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';

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
      <h2 className="section-title mb-6">{t.sections.achievements}</h2>
      <div className="space-y-4 pr-2">
        {achievements.map((achievement, index) => (
          <div key={index} className="mb-4 achievement-item">
            <h3 className="mb-1">
              <MarkdownText>{achievement.title}</MarkdownText>
            </h3>
            <p>
              <MarkdownText>{getTranslatedValue(achievement.details)}</MarkdownText>
            </p>
            {achievement.subDetails && (
              <p className="text-text-tertiary text-sm mt-1">
                • <MarkdownText>{getTranslatedValue(achievement.subDetails)}</MarkdownText>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 