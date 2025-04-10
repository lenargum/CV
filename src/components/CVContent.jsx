import React from 'react';
import LanguageProvider from '../i18n/LanguageProvider';
import Header from './Header';
import SocialLinks from './SocialLinks';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Achievements from './Achievements';

export default function CVContent({ personalInfo, skills, experiences, education, achievements, allTags }) {
  return (
    <LanguageProvider>
      {/* CV Content */}
      <Header {...personalInfo} />
      
      <div className="flex flex-col md:flex-row print:flex-row">
        <div className="w-full md:w-[250px] print:w-[250px]">
          <SocialLinks links={personalInfo.links} />
          <Skills skills={skills} allTags={allTags} />
        </div>
        <div className="flex-1">
          <Experience experiences={experiences} />
          <Education education={education} />
          <Achievements achievements={achievements} />
        </div>
      </div>
    </LanguageProvider>
  );
} 