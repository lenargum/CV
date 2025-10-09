import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import { type Achievement, type TranslatedText } from '../data/achievements';

export interface AchievementsProps {
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
      <ul className="list-disc">
        {achievements.map((achievement, index) => (
          <li key={index} className="achievement-item">
            <p><MarkdownText>{getTranslatedValue(achievement.details)}</MarkdownText></p>
            {achievement.subDetails && (
              <p className="text-text-tertiary text-sm">
                <MarkdownText>{getTranslatedValue(achievement.subDetails)}</MarkdownText>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
} 