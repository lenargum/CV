import type { ComposedCV, LangType } from './types';

export interface ResumeCopyOptions {
  markdown: boolean;
  dateFormat: 'numeric' | 'month-year';
}

export interface CopyBlock {
  id: string;
  section:
    | 'summary'
    | 'experience-meta'
    | 'experience-body'
    | 'education-meta'
    | 'education-body'
    | 'awards'
    | 'teaching';
  title: string;
  text: string;
}

function formatText(text: string, markdown: boolean): string {
  if (markdown) return text;

  return text
    .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '$1')
    .replace(/\*\[([^\]]+)\]\(([^)]+)\)\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1');
}

function formatDateRange(
  startDate: Date,
  endDate: Date | null,
  lang: LangType,
  dateFormat: ResumeCopyOptions['dateFormat']
): string {
  const formatDate = (date: Date): string => {
    if (dateFormat === 'numeric') {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const start = formatDate(startDate);
  if (!endDate) {
    return lang === 'ru' ? `${start} - Сейчас` : `${start} - Present`;
  }

  return `${start} - ${formatDate(endDate)}`;
}

export function buildCopyBlocks(cv: ComposedCV, options: ResumeCopyOptions): CopyBlock[] {
  const { markdown, dateFormat } = options;

  const summaryBlock: CopyBlock = {
    id: 'summary',
    section: 'summary',
    title: cv.lang === 'ru' ? 'Summary (RU)' : 'Summary (EN)',
    text: formatText(cv.summary, markdown),
  };

  const experienceMetaBlocks: CopyBlock[] = cv.experiences.flatMap((exp, index) => {
    const prefix = `${index + 1}. ${formatText(exp.company, false)}`;

    return [
      {
        id: `experience-meta-company-${index}`,
        section: 'experience-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Компания' : 'Company'}`,
        text: formatText(exp.company, markdown),
      },
      {
        id: `experience-meta-role-${index}`,
        section: 'experience-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Должность' : 'Role'}`,
        text: formatText(exp.title, markdown),
      },
      {
        id: `experience-meta-location-${index}`,
        section: 'experience-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Локация' : 'Location'}`,
        text: formatText(exp.location, markdown),
      },
      {
        id: `experience-meta-dates-${index}`,
        section: 'experience-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Период' : 'Dates'}`,
        text: formatDateRange(exp.dateStart, exp.dateEnd, cv.lang, dateFormat),
      },
    ];
  });

  const experienceBlocks: CopyBlock[] = cv.experiences.map((exp, index) => ({
    id: `experience-${index}`,
    section: 'experience-body',
    title: `${cv.lang === 'ru' ? 'Experience Body' : 'Experience Body'} ${index + 1}: ${formatText(exp.company, false)}`,
    text: exp.description.length > 0
      ? exp.description.map((item) => `- ${formatText(item, markdown)}`).join('\n')
      : '',
  }));

  const educationMetaBlocks: CopyBlock[] = cv.education.flatMap((edu, index) => {
    const prefix = `${index + 1}. ${formatText(edu.institution, markdown)}`;
    const items: CopyBlock[] = [
      {
        id: `education-meta-institution-${index}`,
        section: 'education-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Учебное заведение' : 'Institution'}`,
        text: formatText(edu.institution, markdown),
      },
      {
        id: `education-meta-degree-${index}`,
        section: 'education-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Степень' : 'Degree'}`,
        text: formatText(edu.degree, markdown),
      },
      {
        id: `education-meta-dates-${index}`,
        section: 'education-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Период' : 'Dates'}`,
        text: formatDateRange(edu.dateStart, edu.dateEnd, cv.lang, dateFormat),
      },
    ];

    if (edu.specialization) {
      items.push({
        id: `education-meta-specialization-${index}`,
        section: 'education-meta',
        title: `${prefix} - ${cv.lang === 'ru' ? 'Специализация' : 'Specialization'}`,
        text: formatText(edu.specialization, markdown),
      });
    }

    return items;
  });

  const educationBlocks: CopyBlock[] = cv.education.map((edu, index) => {
    const lines: string[] = [];
    if (edu.highlights.length > 0) lines.push(...edu.highlights.map((item) => `- ${formatText(item, markdown)}`));
    if (edu.projects && edu.projects.length > 0) lines.push(...edu.projects.map((item) => `- ${formatText(item, markdown)}`));

    return {
      id: `education-${index}`,
      section: 'education-body',
      title: `${cv.lang === 'ru' ? 'Education Body' : 'Education Body'} ${index + 1}: ${formatText(edu.institution, markdown)}`,
      text: lines.join('\n'),
    };
  });

  const awardsBlock: CopyBlock = {
    id: 'awards',
    section: 'awards',
    title: cv.lang === 'ru' ? 'Achievements (RU)' : 'Achievements (EN)',
    text: cv.awards
      .flatMap((item) => {
        const lines = [`- ${formatText(item.details, markdown)}`];
        if (item.subDetails) lines.push(`  ${formatText(item.subDetails, markdown)}`);
        return lines;
      })
      .join('\n'),
  };

  const teachingBlock: CopyBlock = {
    id: 'teaching',
    section: 'teaching',
    title: cv.lang === 'ru' ? 'Teaching (RU)' : 'Teaching (EN)',
    text: cv.teaching
      .flatMap((item) => {
        const lines = [`- ${formatText(item.details, markdown)}`];
        if (item.subDetails) lines.push(`  ${formatText(item.subDetails, markdown)}`);
        return lines;
      })
      .join('\n'),
  };

  return [
    summaryBlock,
    ...experienceMetaBlocks,
    ...experienceBlocks,
    ...educationMetaBlocks,
    ...educationBlocks,
    awardsBlock,
    teachingBlock,
  ];
}
