import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '../utils/markdown';
import type { ComposedAchievement } from '../lib/types';

export interface AchievementsProps {
  awards: ComposedAchievement[];
  teaching: ComposedAchievement[];
  nested?: boolean;
}

export default function Achievements({ awards, teaching, nested = false }: AchievementsProps) {
  const { t } = useTranslation();

  const Wrapper = nested ? 'div' : 'section';
  const wrapperClass = nested ? '' : 'cv-section';
  const teachingWrapperClass = nested ? 'print:hidden' : 'cv-section print:hidden';
  const HeadingTag = nested ? 'h3' : 'h2';
  const headingClass = nested ? 'subsection-title' : 'section-title';

  return (
    <>
      <Wrapper className={wrapperClass}>
        <HeadingTag className={headingClass}>{t.sections.awards}</HeadingTag>
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
      </Wrapper>
      <Wrapper className={teachingWrapperClass}>
        <HeadingTag className={headingClass}>{t.sections.teaching}</HeadingTag>
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
      </Wrapper>
    </>
  );
}
