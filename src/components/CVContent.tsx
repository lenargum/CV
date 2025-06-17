import LanguageProvider from '../i18n/LanguageProvider';
import Header from './Header';
import Summary from './Summary';
import Tags from './Tags';
import Experience from './Experience';
import Education from './Education';
import Achievements from './Achievements';
import Languages from './Languages';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { PersonalInfo } from '../data/personal-info';
import type { Summary as SummaryType } from '../data/summary';
import type { Language as LanguageType } from '../data/languages';
import type { ExperienceItem as ExperienceType } from '../data/experiences';
import type { EducationItem as EducationType } from '../data/education';
import type { Achievement as AchievementType } from '../data/achievements';

interface CVContentProps {
  personalInfo: PersonalInfo;
  summary: SummaryType;
  languages: LanguageType[];
  experiences: ExperienceType[];
  education: EducationType[];
  achievements: AchievementType[];
  allTags: string[];
} 

export default function CVContent({ personalInfo, summary, languages, experiences, education, achievements, allTags }: CVContentProps) {
  const [isContentHidden, setIsContentHidden] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isContentHidden && <motion.div
          id="cv-content"
          className="shadow-md print:shadow-none my-0 md:my-6 max-w-[830px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <LanguageProvider>
            {/* CV Content */}
            <Header {...personalInfo} />

            <div className="flex flex-col bg-white/80 backdrop-blur-sm print:bg-white">
              <Summary summary={summary} />
              <Tags allTags={allTags} />
              <Experience experiences={experiences} />
              <Education education={education} />
              <Achievements achievements={achievements} />
              <Languages languages={languages} />
            </div>
          </LanguageProvider>
        </motion.div>}
      </AnimatePresence>
      <button
        className={`print:hidden absolute lg:fixed top-2 left-2 md:right-2 z-10 shadow-md w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white/80 backdrop-blur-sm active:scale-110 hover:opacity-100 transition-all duration-300
          ${isContentHidden ? "opacity-5" : "opacity-60"}`}
        onClick={() => setIsContentHidden(prev => !prev)}
      >
        <img src="/CV/lava-lamp.png" alt="lava-lamp" className='w-3/4 h-3/4 object-cover' />
      </button>
    </>
  );
} 