import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import type { ComposedAchievement } from '../lib/types';

export interface AchievementsProps {
  awards: ComposedAchievement[];
  teaching: ComposedAchievement[];
}

export default function Achievements({ awards, teaching }: AchievementsProps) {
  const { t } = useTranslation();

  return (
    <>
      <section className="cv-section">
        <h2 className="section-title">{t.sections.awards}</h2>
        <ul className="list-disc">
          {awards.map((achievement, index) => (
            <li key={index}>
              <p><MarkdownText>{achievement.details}</MarkdownText></p>
              {achievement.subDetails && (
                <p className="text-text-tertiary text-sm">
                  <MarkdownText>{achievement.subDetails}</MarkdownText>
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className="cv-section print:hidden">
        <h2 className="section-title">{t.sections.teaching}</h2>
        <ul className="list-disc">
          {teaching.map((achievement, index) => (
            <li key={index}>
              <p><MarkdownText>{achievement.details}</MarkdownText></p>
              {achievement.subDetails && (
                <p className="text-text-tertiary text-sm">
                  <MarkdownText>{achievement.subDetails}</MarkdownText>
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
