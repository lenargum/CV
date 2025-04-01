import { useTranslation } from '../i18n/useTranslation';

interface TranslatedText {
  en: string;
  ru: string;
  [key: string]: string;
}

interface Skill {
  name: string;
  level: number; // 0-5
}

interface SkillsProps {
  skills: {
    category: string;
    items: Skill[];
  }[];
  allTags?: string[]; // Add new prop for all unique tags
}

export default function Skills({ skills, allTags = [] }: SkillsProps) {
  const { t } = useTranslation();
  
  // Function to render 5 tiles based on skill level
  const renderSkillLevel = (level: number) => {
    const tiles = [];
    for (let i = 0; i < 5; i++) {
      tiles.push(
        <div 
          key={i} 
          className={`h-2 flex-1 rounded-sm ${i < level ? 'bg-primary' : 'bg-gray-200'}`}
        />
      );
    }
    return (
      <div className="flex gap-1">
        {tiles}
      </div>
    );
  };

  return (
    <section className="cv-section">
      <h2 className="section-title">{t.sections.skills}</h2>
      <div className="space-y-8">
        {skills.map((category) => (
          <div key={category.category} className="subsection">
            <h3 className="mb-4">{category.category}</h3>
            <div className="space-y-5">
              {category.items.map((skill) => (
                <div key={skill.name} className="mb-3">
                  <div className="mb-1">
                    <span className="text-sm">{skill.name}</span>
                  </div>
                  {renderSkillLevel(skill.level)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Display all unique tags from work experiences */}
        {allTags.length > 0 && (
          <div className="subsection">
            <h3 className="mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs rounded-md bg-gray-100 text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 