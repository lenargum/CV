export type Lang = 'en' | 'ru';

export interface Translation {
  personalInfo: {
    name: string;
    title: string;
    email: string;
  };
  sections: {
    summary: string;
    contacts: string;
    skills: string;
    experience: string;
    education: string;
    awards: string;
    teaching: string;
    technologies: string;
    extra: string;
  };
  dateFormat: {
    locale: string;
    options: Intl.DateTimeFormatOptions;
  };
  clipboard: {
    copied: string;
    failed: string;
  };
}
