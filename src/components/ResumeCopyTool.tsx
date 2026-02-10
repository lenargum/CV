import { useEffect, useMemo, useState, type MouseEventHandler } from 'react';
import LanguageProvider from '../i18n/LanguageProvider';
import QuickLanguageSwitcher from './QuickLanguageSwitcher';
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

function statusText(status: CopyStatus, fallback: string): string {
  if (status === 'ok') return 'Copied';
  if (status === 'error') return 'Failed';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    const profileParam = params.get('profile');
    if (langParam && LANG_OPTIONS.includes(langParam as LangType)) setLang(langParam as LangType);
    if (profileParam && PROFILE_OPTIONS.includes(profileParam as ProfileType)) setProfile(profileParam as ProfileType);
  }, []);

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

  const sectionTitle = {
    summary: lang === 'ru' ? 'Обо мне' : 'Summary',
    keySkills: lang === 'ru' ? 'Ключевые навыки' : 'Key Skills',
    experience: lang === 'ru' ? 'Опыт' : 'Experience',
    education: lang === 'ru' ? 'Образование' : 'Education',
    awards: lang === 'ru' ? 'Достижения' : 'Achievements',
    teaching: lang === 'ru' ? 'Преподавание' : 'Teaching',
  } as const;

  const expMetaLabel = {
    company: lang === 'ru' ? 'Компания' : 'Company',
    role: lang === 'ru' ? 'Должность' : 'Role',
    location: lang === 'ru' ? 'Локация' : 'Location',
    dates: lang === 'ru' ? 'Даты' : 'Dates',
  } as const;

  const eduMetaLabel = {
    institution: lang === 'ru' ? 'Учебное заведение' : 'Institution',
    degree: lang === 'ru' ? 'Степень' : 'Degree',
    specialization: lang === 'ru' ? 'Специализация' : 'Specialization',
    dates: lang === 'ru' ? 'Даты' : 'Dates',
  } as const;

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
          metaItems: metaItems as Array<{ key: keyof typeof expMetaLabel; block: (typeof blocks)[number] }>,
          body,
          stack: exp.technologies,
        };
      }),
    [blocks, cv.experiences]
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
          metaItems: metaItems as Array<{ key: keyof typeof eduMetaLabel; block: (typeof blocks)[number] }>,
          body,
          stack: edu.technologies,
        };
      }),
    [blocks, cv.education]
  );

  const handleSwitcherClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (!link || !link.href) return;

    const url = new URL(link.href, window.location.origin);
    const base = withBasePath('');
    const normalizedPath = url.pathname.startsWith(base)
      ? url.pathname.slice(base.length)
      : url.pathname.replace(/^\/+/, '');

    const parts = normalizedPath.split('/').filter(Boolean);
    if (parts.length < 2) return;

    const nextLang = parts[0];
    const nextProfile = parts[1];

    if (!LANG_OPTIONS.includes(nextLang as LangType)) return;
    if (![...PROFILE_OPTIONS, 'all'].includes(nextProfile as ProfileType | 'all')) return;

    event.preventDefault();
    setLang(nextLang as LangType);
    if (nextProfile !== 'all') setProfile(nextProfile as ProfileType);
  };

  const handleCopyBlock = async (id: string, text: string) => {
    const ok = await writeToClipboard(text);
    setCopyStatusById((prev) => ({ ...prev, [id]: ok ? 'ok' : 'error' }));
    window.setTimeout(() => setCopyStatusById((prev) => ({ ...prev, [id]: 'idle' })), 1400);
  };

  return (
    <section className="p-4 md:p-6 rounded-2xl bg-primary-bg/90 text-text-primary shadow-md mt-6 mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">Resume Copy</h1>
      <p className="text-text-tertiary mb-4">Separate blocks for copying: summary, each experience, education, achievements, teaching.</p>

      <div className="mb-4" onClickCapture={handleSwitcherClickCapture}>
        <LanguageProvider initialLang={lang} key={lang}>
          <QuickLanguageSwitcher profile="all" activeProfile={profile}/>
        </LanguageProvider>
      </div>

      <label className="inline-flex items-center gap-2 mb-6 select-none">
        <input type="checkbox" checked={useMarkdown} onChange={(event) => setUseMarkdown(event.target.checked)} />
        <span>Use markdown</span>
      </label>
      <label className="inline-flex items-center gap-2 mb-6 ml-4 select-none">
        <input type="checkbox" checked={numericDates} onChange={(event) => setNumericDates(event.target.checked)} />
        <span>Dates as DD.MM.YYYY</span>
      </label>
      <label className="inline-flex items-center gap-2 mb-6 ml-4 select-none">
        <input type="checkbox" checked={stackAsText} onChange={(event) => setStackAsText(event.target.checked)} />
        <span>Stack as comma text</span>
      </label>

      <div className="space-y-7">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">{sectionTitle.summary}</h2>
            <button type="button" onClick={() => handleCopyBlock(summaryBlock.id, summaryBlock.text)} className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm">
              {statusText(summaryCopyStatus, 'Copy block')}
            </button>
          </div>
          <textarea readOnly value={summaryBlock.text} rows={5} className="w-full bg-black/60 border border-white/20 rounded-lg p-3 font-mono text-xs md:text-sm leading-relaxed" />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{sectionTitle.keySkills}</h2>
          {!stackAsText ? (
            <div className="flex flex-wrap gap-2">
              {cv.tags.map((skill, idx) => {
                const skillId = `key-skills-${idx}`;
                return (
                  <button
                    key={skillId}
                    type="button"
                    onClick={() => handleCopyBlock(skillId, skill)}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-xs md:text-sm transition-colors"
                    title={statusText(copyStatusById[skillId] ?? 'idle', 'Copy')}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={cv.tags.join(', ')}
                className="flex-1 h-9 bg-black/60 border border-white/20 rounded-md px-2 font-mono text-xs md:text-sm"
              />
              <button
                type="button"
                onClick={() => handleCopyBlock('key-skills-all', cv.tags.join(', '))}
                className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm"
              >
                {statusText(copyStatusById['key-skills-all'] ?? 'idle', 'Copy skills')}
              </button>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{sectionTitle.experience}</h2>
          {experienceCards.map((card) => (
            <article key={card.id} className="border border-white/20 rounded-xl p-3 bg-black/40 space-y-3">
              <h3 className="text-base md:text-lg font-semibold">{card.title}</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {card.metaItems.map(({ key, block }) => {
                  const status = copyStatusById[block.id] ?? 'idle';
                  return (
                    <div key={block.id} className="flex items-center gap-2">
                      <label className="text-xs text-text-tertiary min-w-[72px]">{expMetaLabel[key]}:</label>
                      <input readOnly value={block.text} className="flex-1 h-9 bg-black/60 border border-white/20 rounded-md px-2 font-mono text-xs md:text-sm" />
                      <button type="button" onClick={() => handleCopyBlock(block.id, block.text)} className="px-2 py-1 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-xs">
                        {statusText(status, 'Copy')}
                      </button>
                    </div>
                  );
                })}
              </div>

              {card.body && (
                <div className="">
                  <div className="flex items-center justify-end mb-2">
                    <button type="button" onClick={() => handleCopyBlock(card.body!.id, card.body!.text)} className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm">
                      {statusText(copyStatusById[card.body.id] ?? 'idle', 'Copy body')}
                    </button>
                  </div>
                  <textarea readOnly value={card.body.text} rows={6} className="w-full bg-black/60 border border-white/20 rounded-lg p-3 font-mono text-xs md:text-sm leading-relaxed" />
                </div>
              )}

              {card.stack.length > 0 && (
                <div>
                  {!stackAsText ? (
                    <div className="flex flex-wrap gap-2">
                      {card.stack.map((tech, idx) => {
                        const techId = `${card.id}-stack-${idx}`;
                        return (
                          <button
                            key={techId}
                            type="button"
                            onClick={() => handleCopyBlock(techId, tech)}
                            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-xs md:text-sm transition-colors"
                            title={statusText(copyStatusById[techId] ?? 'idle', 'Copy')}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={card.stack.join(', ')}
                        className="flex-1 h-9 bg-black/60 border border-white/20 rounded-md px-2 font-mono text-xs md:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(`${card.id}-stack-all`, card.stack.join(', '))}
                        className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm"
                      >
                        {statusText(copyStatusById[`${card.id}-stack-all`] ?? 'idle', 'Copy stack')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{sectionTitle.education}</h2>
          {educationCards.map((card) => (
            <article key={card.id} className="border border-white/20 rounded-xl p-3 bg-black/40 space-y-3">
              <h3 className="text-base md:text-lg font-semibold">{card.title}</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {card.metaItems.map(({ key, block }) => {
                  const status = copyStatusById[block.id] ?? 'idle';
                  return (
                    <div key={block.id} className="flex items-center gap-2">
                      <label className="text-xs text-text-tertiary min-w-[92px]">{eduMetaLabel[key]}:</label>
                      <input readOnly value={block.text} className="flex-1 h-9 bg-black/60 border border-white/20 rounded-md px-2 font-mono text-xs md:text-sm" />
                      <button type="button" onClick={() => handleCopyBlock(block.id, block.text)} className="px-2 py-1 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-xs">
                        {statusText(status, 'Copy')}
                      </button>
                    </div>
                  );
                })}
              </div>

              {card.body && (
                <div className="pt-1">
                  <div className="flex items-center justify-end mb-2">
                    <button type="button" onClick={() => handleCopyBlock(card.body!.id, card.body!.text)} className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm">
                      {statusText(copyStatusById[card.body.id] ?? 'idle', 'Copy body')}
                    </button>
                  </div>
                  <textarea readOnly value={card.body.text} rows={4} className="w-full bg-black/60 border border-white/20 rounded-lg p-3 font-mono text-xs md:text-sm leading-relaxed" />
                </div>
              )}

              {card.stack.length > 0 && (
                <div className="pt-1">
                  <div className="text-sm font-semibold mb-2">Tech stack</div>
                  {!stackAsText ? (
                    <div className="flex flex-wrap gap-2">
                      {card.stack.map((tech, idx) => {
                        const techId = `${card.id}-stack-${idx}`;
                        return (
                          <button
                            key={techId}
                            type="button"
                            onClick={() => handleCopyBlock(techId, tech)}
                            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-xs md:text-sm transition-colors"
                            title={statusText(copyStatusById[techId] ?? 'idle', 'Copy')}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={card.stack.join(', ')}
                        className="flex-1 h-9 bg-black/60 border border-white/20 rounded-md px-2 font-mono text-xs md:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyBlock(`${card.id}-stack-all`, card.stack.join(', '))}
                        className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm"
                      >
                        {statusText(copyStatusById[`${card.id}-stack-all`] ?? 'idle', 'Copy stack')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>

        {[{ title: sectionTitle.awards, items: awardsBlocks }, { title: sectionTitle.teaching, items: teachingBlocks }].map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-xl font-semibold">{group.title}</h2>
            {group.items.map((block) => {
              const status = copyStatusById[block.id] ?? 'idle';
              return (
                <article key={block.id} className="border border-white/20 rounded-xl p-3 bg-black/40">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-base md:text-lg font-semibold">{block.title}</h3>
                    <button type="button" onClick={() => handleCopyBlock(block.id, block.text)} className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-colors text-sm">
                      {statusText(status, 'Copy block')}
                    </button>
                  </div>
                  <textarea readOnly value={block.text} rows={2} className="w-full bg-black/60 border border-white/20 rounded-lg p-3 font-mono text-xs md:text-sm leading-relaxed" />
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </section>
  );
}
