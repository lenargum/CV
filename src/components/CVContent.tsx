import LanguageProvider from '../i18n/LanguageProvider';
import Header from './Header';
import Summary from './Summary';
import Tags from './Tags';
import Experience from './Experience';
import Education from './Education';
import Achievements from './Achievements';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { withBasePath } from '../lib/utils';
import type { PersonalInfo } from '../data/personal-info';
import type { Summary as SummaryType } from '../data/summary';
import type { ExperienceItem as ExperienceType } from '../data/experiences';
import type { EducationItem as EducationType } from '../data/education';
import type { Achievement as AchievementType } from '../data/achievements';

interface CVContentProps {
  personalInfo: PersonalInfo;
  summary: SummaryType;
  experiences: ExperienceType[];
  education: EducationType[];
  awards: AchievementType[];
  teaching: AchievementType[];
  allTags: string[];
  initialLang?: 'en' | 'ru';
} 

export default function CVContent({ personalInfo, summary, experiences, education, awards, teaching, allTags, initialLang }: CVContentProps) {
  const [isContentHidden, setIsContentHidden] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { on?: boolean } | undefined;
      if (typeof detail?.on === 'boolean') setIsContentHidden(detail.on);
      else setIsContentHidden(document.body.classList.contains('lava-mode'));
    };
    window.addEventListener('lava-mode-change', handler as EventListener);
    // init sync
    setIsContentHidden(document.body.classList.contains('lava-mode'));
    return () => window.removeEventListener('lava-mode-change', handler as EventListener);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isContentHidden && <motion.div
          id="cv-content"
          className="shadow-md print:shadow-none my-0 md:my-6 max-w-[830px] mx-auto print:max-w-full print:m-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <LanguageProvider initialLang={initialLang}>
            {/* CV Content */}
            <Header {...personalInfo} />

            <div className="flex flex-col bg-primary-bg/90 backdrop-blur-sm print:bg-white">
              <Summary summary={summary} />
              <Tags allTags={allTags} />
              <Experience experiences={experiences} />
              <Education education={education} />
              <Achievements awards={awards} teaching={teaching} />
            </div>
          </LanguageProvider>
        </motion.div>}
      </AnimatePresence>
      {/* toggle button moved to Layout */}
    </>
  );
} 