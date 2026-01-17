import { useTranslation } from '../i18n/useTranslation';
import { MarkdownText } from '@/utils/markdown';

interface SummaryProps {
    summary: string; // Now receives pre-composed string
}

export default function Summary({ summary }: SummaryProps) {
    const { t } = useTranslation();

    return (
        <section className="cv-section">
            <h2 className="section-title">{t.sections.summary}</h2>
            <div className="subsection">
                <MarkdownText as="div" className="text-text-primary leading-relaxed whitespace-pre-line">{summary}</MarkdownText>
            </div>
        </section>
    );
}
