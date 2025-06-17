import { useTranslation } from '../i18n/useTranslation';
import type { Summary } from '../data/summary';
import { MarkdownText } from '@/utils/markdown';

interface SummaryProps {
    summary: Summary;
}

export default function Summary({ summary }: SummaryProps) {
    const { t, currentLang } = useTranslation();

    const translatedContent = typeof summary.content === 'string' ? summary.content : summary.content[currentLang as keyof typeof summary.content];

    return (
        <section className="cv-section">
            <h2 className="section-title mb-6">{t.sections.summary}</h2>
            <div className="subsection mt-0">
                <MarkdownText as="p" className="text-text-secondary leading-relaxed whitespace-pre-line">{translatedContent}</MarkdownText>
            </div>
        </section>
    );
} 