import LanguageProvider from '../i18n/LanguageProvider';
import Header from './Header';
import Tags from './Tags';
import Experience from './Experience';
import Education from './Education';
import Achievements from './Achievements';
import Languages from './Languages';

export default function CVContent({ personalInfo, languages, experiences, education, achievements, allTags }) {
  return (
    <LanguageProvider>
      {/* CV Content */}
      <Header {...personalInfo} />

      <div className="flex flex-col">
        <Tags allTags={allTags} />
        <Experience experiences={experiences} />
        <Education education={education} />
        <Achievements achievements={achievements} />
        <Languages languages={languages} />
      </div>
    </LanguageProvider>
  );
} 