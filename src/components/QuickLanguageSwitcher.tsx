import { useTranslation } from '../i18n/useTranslation';
import type { ProfileType, LangType } from '../lib/types';

interface SwitcherProps {
  profile?: ProfileType;
  activeProfile?: ProfileType | '';
  /** Override for currentLang when component runs OUTSIDE a LanguageProvider
   *  context (e.g. as a stand-alone client:load island in Layout.astro). */
  currentLang?: LangType;
}

// URL builder shared by both switchers.
// EN at root (/, /react/, ...); RU under /ru/ (/ru/, /ru/react/, ...).
function buildPath(lang: 'en' | 'ru', p: ProfileType): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const langSegment = lang === 'en' ? '' : 'ru/';
  const profileSegment = p === 'all' ? '' : `${p}/`;
  return `${base}${langSegment}${profileSegment}`;
}

/**
 * LangSwitcher — pill with EN / RU.
 * Lives in the floating top-right chrome cluster (Layout-level).
 */
export function LangSwitcher({ profile = 'all', currentLang: currentLangProp }: SwitcherProps) {
  // Prefer the prop (passed from Astro's frontmatter) over the context.
  // When this component lives in its own client:load island (Layout chrome),
  // it has NO LanguageProvider above it — the context falls back to 'en' and
  // the active state would never update. The prop fixes that.
  const ctx = useTranslation();
  const currentLang: LangType = currentLangProp ?? ctx.currentLang;
  return (
    <div className="cv-lang">
      <a
        href={buildPath('en', profile)}
        className={`cv-lang__btn custom-link ${currentLang === 'en' ? 'is-active' : ''}`}
      >
        EN
      </a>
      <a
        href={buildPath('ru', profile)}
        className={`cv-lang__btn custom-link ${currentLang === 'ru' ? 'is-active' : ''}`}
      >
        РУС
      </a>
    </div>
  );
}

/**
 * ProfileSwitcher — All / React / Vue / Fullstack pill.
 * Renders inline inside Header (only meaningful on the 'all' profile;
 * focused profiles intentionally hide it to keep the version's surface clean).
 */
export function ProfileSwitcher({ activeProfile = 'all', currentLang: currentLangProp }: SwitcherProps) {
  const ctx = useTranslation();
  const currentLang: LangType = currentLangProp ?? ctx.currentLang;
  const profiles: ProfileType[] = ['all', 'react', 'vue', 'fullstack'];
  const labels: Record<LangType, Record<ProfileType, string>> = {
    en: { all: 'All', react: 'React', vue: 'Vue', fullstack: 'Fullstack' },
    ru: { all: 'Всё', react: 'React', vue: 'Vue', fullstack: 'Fullstack' },
  };
  const lbl = labels[currentLang];
  return (
    <div className="cv-profile-inline">
      {profiles.map((p) => {
        const isActive = activeProfile === p;
        return (
          <a
            key={p}
            href={isActive ? undefined : buildPath(currentLang, p)}
            className={`cv-profile-inline__btn custom-link ${isActive ? 'is-active' : ''}`}
            aria-pressed={isActive}
          >
            {lbl[p]}
          </a>
        );
      })}
    </div>
  );
}

/**
 * Default export kept for backward compatibility — renders both inline
 * (used by ResumeCopyTool which doesn't have access to the floating chrome).
 */
export default function QuickLanguageSwitcher({ profile = 'all', activeProfile = '' }: SwitcherProps) {
  return (
    <div className="flex gap-2">
      {profile === 'all' && <ProfileSwitcher activeProfile={activeProfile || profile} />}
      <LangSwitcher profile={profile} />
    </div>
  );
}
