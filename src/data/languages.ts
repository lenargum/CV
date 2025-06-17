export interface Language {
    name: string;
    level: number;
    label: string;
}

export const languages: Language[] = [
    { name: "Russian", level: 5, label: 'Native' },
    { name: "English", level: 4, label: 'C1' },
    { name: "Tatar", level: 3, label: 'B1' },
]
