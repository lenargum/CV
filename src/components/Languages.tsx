import { useTranslation } from '../i18n/useTranslation';

interface LanguagesProps {
    languages: {
        name: string;
        level: number;
        label: string;
    }[];
}

export default function Languages({ languages }: LanguagesProps) {
    const { t } = useTranslation();

    // Function to render 5 tiles based on skill level
    const renderSkillLevel = (level: number) => {
        const tiles = [];
        for (let i = 0; i < 5; i++) {
            tiles.push(
                <div key={i} className={`h-2 flex-1 rounded-sm ${i < level ? 'bg-primary' : 'bg-gray-200'}`} />
            );
        }
        return (
            <div className="flex w-full md:w-1/2 gap-1">
                {tiles}
            </div>
        );
    };

    // Translate skill name if it's a language
    const getTranslatedLanguageName = (skillName: string): string => {
        return t?.languages && skillName in (t.languages as Record<string, string>)
            ? (t.languages as Record<string, string>)[skillName]
            : skillName;
    };

    // Translate language proficiency label
    const getTranslatedProficiencyLabel = (label: string): string => {
        return t?.languageLevels && label in (t.languageLevels as Record<string, string>)
            ? (t.languageLevels as Record<string, string>)[label]
            : label;
    };

    return (
        <section className="cv-section">
            <h2 className="section-title">{t.sections.languages}</h2>
            <div className="subsection">
                <div className="space-y-5">
                    {languages.map((language) => (
                        <div key={language.name} className="mb-3">
                            <div className="mb-1">
                                <span className="text-sm">
                                    {getTranslatedLanguageName(language.name)} - {getTranslatedProficiencyLabel(language.label)}
                                </span>
                            </div>
                            {renderSkillLevel(language.level)}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 