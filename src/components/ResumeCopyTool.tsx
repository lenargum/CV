import { useEffect, useMemo, useState } from 'react';
import { composeCv } from '../lib/composeCv';
import { buildCopyBlocks } from '../lib/resumeCopy';
import type { LangType, ProfileType } from '../lib/types';
import { withBasePath } from '../lib/utils';

const PROFILE_OPTIONS: ProfileType[] = ['react', 'vue', 'fullstack'];
const LANG_OPTIONS: LangType[] = ['en', 'ru'];

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

interface ResumeCopyToolProps {
  initialLang?: LangType;
  initialProfile?: ProfileType;
}

type CopyStatus = 'idle' | 'ok' | 'error';

function statusText(status: CopyStatus, fallback: string, lang: LangType): string {
  if (status === 'ok') return lang === 'ru' ? 'Скопировано' : 'Copied';
  if (status === 'error') return lang === 'ru' ? 'Ошибка' : 'Failed';
  return fallback;
}

function plainTitle(text: string): string {
  return text
    .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '$1')
    .replace(/\*\[([^\]]+)\]\(([^)]+)\)\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1');
}

const PROFILE_LABELS: Record<LangType, Record<ProfileType, string>> = {
  en: { all: 'All', react: 'React', vue: 'Vue', fullstack: 'Fullstack' },
  ru: { all: 'Всё', react: 'React', vue: 'Vue', fullstack: 'Fullstack' },
};

export default function ResumeCopyTool({
  initialLang = 'en',
  initialProfile = 'react',
}: ResumeCopyToolProps) {
  const [lang, setLang] = useState<LangType>(initialLang);
  const [profile, setProfile] = useState<ProfileType>(initialProfile);
  const [useMarkdown, setUseMarkdown] = useState(true);
  const [numericDates, setNumericDates] = useState(true);
  const [stackAsText, setStackAsText] = useState(false);
  const [copyStatusById, setCopyStatusById] = useState<Record<string, CopyStatus>>({});

  // Read initial state from query params (?lang=en&profile=react) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    const profileParam = params.get('profile');
    if (langParam && LANG_OPTIONS.includes(langParam as LangType)) setLang(langParam as LangType);
    if (profileParam && PROFILE_OPTIONS.includes(profileParam as ProfileType)) setProfile(profileParam as ProfileType);
  }, []);

  // Reflect lang/profile in the URL so a copy-tool URL is shareable
  useEffect(() => {
    const path = withBasePath('copy/');
    const params = new URLSearchParams({ lang, profile });
    window.history.replaceState(null, '', `${path}?${params.toString()}`);
  }, [lang, profile]);

  const cv = useMemo(() => composeCv(profile, lang), [profile, lang]);
  const blocks = useMemo(
    () => buildCopyBlocks(cv, { markdown: useMarkdown, dateFormat: numericDates ? 'numeric' : 'month-year' }),
    [cv, useMarkdown, numericDates]
  );

  const t = useMemo(
    () =>
      lang === 'ru'
        ? {
            heading: 'Конструктор резюме',
            subtitle: 'Скопируй любую часть: саммари, опыт, образование, достижения, преподавание.',
            useMarkdown: 'Markdown',
            numericDates: 'Даты как ДД.ММ.ГГГГ',
            stackAsText: 'Стек одной строкой',
            copyBlock: 'Скопировать',
            copyBody: 'Скопировать описание',
            copySkills: 'Скопировать навыки',
            copyStack: 'Скопировать стек',
            copy: 'Копия',
            sections: {
              summary: 'Обо мне',
              keySkills: 'Ключевые навыки',
              experience: 'Опыт',
              education: 'Образование',
              awards: 'Достижения',
              teaching: 'Преподавание',
            },
            expMeta: { company: 'Компания', role: 'Должность', location: 'Локация', dates: 'Даты' },
            eduMeta: { institution: 'Учебное заведение', degree: 'Степень', specialization: 'Специализация', dates: 'Даты' },
            techStack: 'Технологии',
            controls: 'Настройки',
          }
        : {
            heading: 'Resume Copy',
            subtitle: 'Copy any block: summary, experience, education, awards, teaching.',
            useMarkdown: 'Markdown',
            numericDates: 'Dates as DD.MM.YYYY',
            stackAsText: 'Stack as comma text',
            copyBlock: 'Copy',
            copyBody: 'Copy body',
            copySkills: 'Copy skills',
            copyStack: 'Copy stack',
            copy: 'Copy',
            sections: {
              summary: 'Summary',
              keySkills: 'Key Skills',
              experience: 'Experience',
              education: 'Education',
              awards: 'Awards',
              teaching: 'Teaching',
            },
            expMeta: { company: 'Company', role: 'Role', location: 'Location', dates: 'Dates' },
            eduMeta: { institution: 'Institution', degree: 'Degree', specialization: 'Specialization', dates: 'Dates' },
            techStack: 'Tech stack',
            controls: 'Settings',
          },
    [lang]
  );

  const summaryBlock = blocks.filter((block) => block.section === 'summary')[0];
  const awardsBlocks = blocks.filter((block) => block.section === 'awards');
  const teachingBlocks = blocks.filter((block) => block.section === 'teaching');

  const summaryCopyStatus = copyStatusById[summaryBlock.id] ?? 'idle';

  const experienceCards = useMemo(
    () =>
      cv.experiences.map((exp, index) => {
        const metaItems = [
          { key: 'company' as const, block: blocks.find((b) => b.id === `experience-meta-company-${index}`) },
          { key: 'role' as const, block: blocks.find((b) => b.id === `experience-meta-role-${index}`) },
          { key: 'location' as const, block: blocks.find((b) => b.id === `experience-meta-location-${index}`) },
          { key: 'dates' as const, block: blocks.find((b) => b.id === `experience-meta-dates-${index}`) },
        ].filter((item) => Boolean(item.block));

        const body = blocks.find((b) => b.id === `experience-${index}`);

        return {
          id: `experience-card-${index}`,
          title: plainTitle(exp.company),
          metaItems: metaItems as Array<{ key: keyof typeof t.expMeta; block: (typeof blocks)[number] }>,
          body,
          stack: exp.technologies,
        };
      }),
    [blocks, cv.experiences, t]
  );

  const educationCards = useMemo(
    () =>
      cv.education.map((edu, index) => {
        const metaItems = [
          { key: 'institution' as const, block: blocks.find((b) => b.id === `education-meta-institution-${index}`) },
          { key: 'degree' as const, block: blocks.find((b) => b.id === `education-meta-degree-${index}`) },
          { key: 'specialization' as const, block: blocks.find((b) => b.id === `education-meta-specialization-${index}`) },
          { key: 'dates' as const, block: blocks.find((b) => b.id === `education-meta-dates-${index}`) },
        ].filter((item) => Boolean(item.block));

        const body = blocks.find((b) => b.id === `education-${index}`);

        return {
          id: `education-card-${index}`,
          title: plainTitle(edu.institution),
          metaItems: metaItems as Array<{ key: keyof typeof t.eduMeta; block: (typeof blocks)[number] }>,
          body,
          stack: edu.technologies,
        };
      }),
    [blocks, cv.education, t]
  );

  const handleCopyBlock = async (id: string, text: string) => {
    const ok = await writeToClipboard(text);
    setCopyStatusById((prev) => ({ ...prev, [id]: ok ? 'ok' : 'error' }));
    window.setTimeout(() => setCopyStatusById((prev) => ({ ...prev, [id]: 'idle' })), 1400);
  };

  return (
    <article className="cv-card my-0 md:my-16 max-w-[920px] mx-auto">
      {/* === HEADER === */}
      <header className="cv-inset !rounded-none cv-copy-header">
        <h1 className="cv-copy-title">{t.heading}</h1>
        <p className="cv-copy-subtitle">{t.subtitle}</p>

        {/* Switchers — pure state, NO navigation. Uses the design-system
            pill styles (cv-profile-inline / cv-lang) so it matches every
            other switcher on the site. */}
        <div className="cv-copy-switchers">
          <div className="cv-profile-inline" role="radiogroup" aria-label="Profile">
            {(['all', ...PROFILE_OPTIONS] as ProfileType[]).map((p) => {
              const isActive = profile === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`cv-profile-inline__btn custom-link ${isActive ? 'is-active' : ''}`}
                  onClick={() => setProfile(p)}
                >
                  {PROFILE_LABELS[lang][p]}
                </button>
              );
            })}
          </div>

          <div className="cv-lang" role="radiogroup" aria-label="Language">
            {LANG_OPTIONS.map((l) => {
              const isActive = lang === l;
              return (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`cv-lang__btn custom-link ${isActive ? 'is-active' : ''}`}
                  onClick={() => setLang(l)}
                >
                  {l === 'en' ? 'EN' : 'РУС'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format toggles */}
        <div className="cv-copy-toggles">
          <span className="cv-copy-toggles__label">{t.controls}:</span>
          <label className="cv-copy-toggle">
            <input type="checkbox" checked={useMarkdown} onChange={(e) => setUseMarkdown(e.target.checked)} />
            <span>{t.useMarkdown}</span>
          </label>
          <label className="cv-copy-toggle">
            <input type="checkbox" checked={numericDates} onChange={(e) => setNumericDates(e.target.checked)} />
            <span>{t.numericDates}</span>
          </label>
          <label className="cv-copy-toggle">
            <input type="checkbox" checked={stackAsText} onChange={(e) => setStackAsText(e.target.checked)} />
            <span>{t.stackAsText}</span>
          </label>
        </div>
      </header>

      <div className="cv-copy-body">
        {/* === SUMMARY === */}
        <section className="cv-section">
          <div className="cv-copy-section-head">
            <h2 className="section-title">{t.sections.summary}</h2>
            <button
              type="button"
              onClick={() => handleCopyBlock(summaryBlock.id, summaryBlock.text)}
              className="cv-copy-btn cv-copy-btn--primary"
            >
              {statusText(summaryCopyStatus, t.copyBlock, lang)}
            </button>
          </div>
          <article className="cv-inset cv-copy-card">
            <textarea readOnly value={summaryBlock.text} rows={5} className="cv-copy-textarea" />
          </article>
        </section>

        {/* === KEY SKILLS === */}
        <section className="cv-section">
          <div className="cv-copy-section-head">
            <h2 className="section-title">{t.sections.keySkills}</h2>
            {stackAsText && (
              <button
                type="button"
                onClick={() => handleCopyBlock('key-skills-all', cv.tags.join(', '))}
                className="cv-copy-btn cv-copy-btn--primary"
              >
                {statusText(copyStatusById['key-skills-all'] ?? 'idle', t.copySkills, lang)}
              </button>
            )}
          </div>
          <article className="cv-inset cv-copy-card">
            {!stackAsText ? (
              <div className="cv-copy-chips">
                {cv.tags.map((skill, idx) => {
                  const skillId = `key-skills-${idx}`;
                  const status = copyStatusById[skillId] ?? 'idle';
                  return (
                    <button
                      key={skillId}
                      type="button"
                      onClick={() => handleCopyBlock(skillId, skill)}
                      className={`cv-copy-chip ${status === 'ok' ? 'is-copied' : ''}`}
                      title={statusText(status, t.copy, lang)}
                    >
                      {status === 'ok' ? `✓ ${skill}` : skill}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input readOnly value={cv.tags.join(', ')} className="cv-copy-input" />
            )}
          </article>
        </section>

        {/* === EXPERIENCE === */}
        <section className="cv-section">
          <h2 className="section-title">{t.sections.experience}</h2>
          <div className="cv-stack">
            {experienceCards.map((card) => (
              <article key={card.id} className="cv-inset cv-copy-card">
                <h3 className="cv-copy-card-title">{card.title}</h3>
                <div className="cv-copy-meta-grid">
                  {card.metaItems.map(({ key, block }) => (
                    <div key={block.id} className="cv-copy-meta-row">
                      <label className="cv-copy-meta-label">{t.expMeta[key]}</label>
                      <input readOnly value={block.text} className="cv-copy-input" />
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(block.id, block.text)}
                        className="cv-copy-btn cv-copy-btn--ghost"
                      >
                        {statusText(copyStatusById[block.id] ?? 'idle', t.copy, lang)}
                      </button>
                    </div>
                  ))}
                </div>

                {card.body && (
                  <div className="cv-copy-block">
                    <div className="cv-copy-block__bar">
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(card.body!.id, card.body!.text)}
                        className="cv-copy-btn cv-copy-btn--primary"
                      >
                        {statusText(copyStatusById[card.body.id] ?? 'idle', t.copyBody, lang)}
                      </button>
                    </div>
                    <textarea readOnly value={card.body.text} rows={6} className="cv-copy-textarea" />
                  </div>
                )}

                {card.stack.length > 0 && (
                  <div className="cv-copy-stack">
                    <div className="cv-copy-stack__label">{t.techStack}</div>
                    {!stackAsText ? (
                      <div className="cv-copy-chips">
                        {card.stack.map((tech, idx) => {
                          const techId = `${card.id}-stack-${idx}`;
                          const status = copyStatusById[techId] ?? 'idle';
                          return (
                            <button
                              key={techId}
                              type="button"
                              onClick={() => handleCopyBlock(techId, tech)}
                              className={`cv-copy-chip ${status === 'ok' ? 'is-copied' : ''}`}
                              title={statusText(status, t.copy, lang)}
                            >
                              {status === 'ok' ? `✓ ${tech}` : tech}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="cv-copy-inline">
                        <input readOnly value={card.stack.join(', ')} className="cv-copy-input" />
                        <button
                          type="button"
                          onClick={() => handleCopyBlock(`${card.id}-stack-all`, card.stack.join(', '))}
                          className="cv-copy-btn cv-copy-btn--primary"
                        >
                          {statusText(copyStatusById[`${card.id}-stack-all`] ?? 'idle', t.copyStack, lang)}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* === EDUCATION === */}
        <section className="cv-section">
          <h2 className="section-title">{t.sections.education}</h2>
          <div className="cv-stack">
            {educationCards.map((card) => (
              <article key={card.id} className="cv-inset cv-copy-card">
                <h3 className="cv-copy-card-title">{card.title}</h3>
                <div className="cv-copy-meta-grid">
                  {card.metaItems.map(({ key, block }) => (
                    <div key={block.id} className="cv-copy-meta-row">
                      <label className="cv-copy-meta-label">{t.eduMeta[key]}</label>
                      <input readOnly value={block.text} className="cv-copy-input" />
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(block.id, block.text)}
                        className="cv-copy-btn cv-copy-btn--ghost"
                      >
                        {statusText(copyStatusById[block.id] ?? 'idle', t.copy, lang)}
                      </button>
                    </div>
                  ))}
                </div>

                {card.body && (
                  <div className="cv-copy-block">
                    <div className="cv-copy-block__bar">
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(card.body!.id, card.body!.text)}
                        className="cv-copy-btn cv-copy-btn--primary"
                      >
                        {statusText(copyStatusById[card.body.id] ?? 'idle', t.copyBody, lang)}
                      </button>
                    </div>
                    <textarea readOnly value={card.body.text} rows={4} className="cv-copy-textarea" />
                  </div>
                )}

                {card.stack.length > 0 && (
                  <div className="cv-copy-stack">
                    <div className="cv-copy-stack__label">{t.techStack}</div>
                    {!stackAsText ? (
                      <div className="cv-copy-chips">
                        {card.stack.map((tech, idx) => {
                          const techId = `${card.id}-stack-${idx}`;
                          const status = copyStatusById[techId] ?? 'idle';
                          return (
                            <button
                              key={techId}
                              type="button"
                              onClick={() => handleCopyBlock(techId, tech)}
                              className={`cv-copy-chip ${status === 'ok' ? 'is-copied' : ''}`}
                              title={statusText(status, t.copy, lang)}
                            >
                              {status === 'ok' ? `✓ ${tech}` : tech}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="cv-copy-inline">
                        <input readOnly value={card.stack.join(', ')} className="cv-copy-input" />
                        <button
                          type="button"
                          onClick={() => handleCopyBlock(`${card.id}-stack-all`, card.stack.join(', '))}
                          className="cv-copy-btn cv-copy-btn--primary"
                        >
                          {statusText(copyStatusById[`${card.id}-stack-all`] ?? 'idle', t.copyStack, lang)}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* === AWARDS + TEACHING === Each section has a single combined block;
              header carries the title + Copy button (mirrors Summary). */}
        {[
          { title: t.sections.awards, block: awardsBlocks[0] },
          { title: t.sections.teaching, block: teachingBlocks[0] },
        ]
          .filter(({ block }) => Boolean(block))
          .map(({ title, block }) => {
            const status = copyStatusById[block!.id] ?? 'idle';
            return (
              <section key={title} className="cv-section">
                <div className="cv-copy-section-head">
                  <h2 className="section-title">{title}</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyBlock(block!.id, block!.text)}
                    className="cv-copy-btn cv-copy-btn--primary"
                  >
                    {statusText(status, t.copyBlock, lang)}
                  </button>
                </div>
                <article className="cv-inset cv-copy-card">
                  <textarea readOnly value={block!.text} rows={3} className="cv-copy-textarea" />
                </article>
              </section>
            );
          })}
      </div>
    </article>
  );
}
