import { useTranslation } from '../i18n/useTranslation';
import type { ProfileType } from '../lib/types';

interface QuickLanguageSwitcherProps {
  profile?: ProfileType;
  activeProfile?: ProfileType | '';
}

export default function QuickLanguageSwitcher({
  profile = 'all',
  activeProfile = '',
}: QuickLanguageSwitcherProps) {
  const { currentLang } = useTranslation();

  const activeClasses = 'bg-white text-black';
  const inactiveClasses = 'bg-black hover:bg-white/10';

  const getHref = (lang: 'en' | 'ru') => {
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    return `${base}${lang}/${profile}/`;
  };

  const getProfileHref = (lang: 'en' | 'ru', nextProfile: ProfileType) => {
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    return `${base}${lang}/${nextProfile}/`;
  };

  return (
    <div className="flex gap-2 p-1 md:p-0 rounded-lg md:padding-0 bg-black md:bg-transparent">
      {profile === 'all' && <>
        {(['react', 'vue', 'fullstack'] as const).map((_profile) => (
          <a
            key={_profile}
            href={getProfileHref(currentLang, _profile)}
            className={`px-3 py-1 rounded-md text-sm font-medium custom-link ${activeProfile === _profile
              ? activeClasses
              : inactiveClasses
              } transition-colors duration-300 outline outline-1 outline-secondary`}
          >
            {_profile.charAt(0).toUpperCase() + _profile.slice(1)}
          </a>
        ))}
        <div className="w-px h-5 mt-1 bg-primary-bg"></div>
      </>}

      <a
        href={getHref('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium custom-link ${currentLang === 'en'
          ? activeClasses
          : inactiveClasses
          } transition-colors duration-300`}
      >
        EN
      </a>
      <a
        href={getHref('ru')}
        className={`px-3 py-1 rounded-md text-sm font-medium custom-link ${currentLang === 'ru'
          ? activeClasses
          : inactiveClasses
          } transition-colors duration-300`}
      >
        РУС
      </a>
    </div>
  );
}
