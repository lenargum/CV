import type { ProfiledText } from '../lib/types';

export interface Summary {
    content: ProfiledText;
}

export const summary: Summary = {
    content: {
        base: {
            ru: "Frontend Engineer с 5+ годами опыта в UI-heavy продуктах: редакторы, дашборды, e‑commerce и Telegram Mini Apps.\nСпециализация — сложные интерфейсы, анимации, архитектура, дизайн-системы и оптимизация производительности.",
            en: "Frontend Engineer with 5+ years of experience in UI-heavy products: editors, dashboards, e‑commerce, and Telegram Mini Apps.\nFocused on complex interfaces, animations, architecture, design systems, and performance optimization."
        },
        profiles: {
            fullstack: {
                ru: "Fullstack Engineer с сильным фокусом на frontend и UI-heavy продуктах.\nПомимо фронтенда разрабатываю backend-сервисы на Go и мобильные Flutter-приложения с полным CI/CD и деплоем.",
                en: "Fullstack Engineer with a strong frontend focus and experience in UI-heavy products.\nIn addition to frontend, build backend services in Go and Flutter mobile apps with full CI/CD and deployment."
            },
            all: {
                ru: "Fullstack Engineer с сильным фокусом на frontend и UI-heavy продуктах.\nПомимо фронтенда разрабатываю backend на Go и мобильные Flutter-приложения с полным CI/CD и деплоем.",
                en: "Fullstack Engineer with a strong frontend focus and experience in UI-heavy products.\nIn addition to frontend, build backend services in Go and Flutter mobile apps with full CI/CD and deployment."
            }
        }
    }
};
