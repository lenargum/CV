import type { ProfiledText } from '../lib/types';

export interface Summary {
    content: ProfiledText;
}

export const summary: Summary = {
    content: {
        base: {
            ru: "Frontend Engineer с 5+ годами опыта в UI-heavy продуктах: редакторы, дашборды, e‑commerce и Telegram Mini Apps.\nСпециализация — сложные интерфейсы, анимации, архитектура, дизайн-системы и оптимизация производительности.\nРаботаю с продуктами end-to-end, отвечаю за результат, а не за набор тасков.",
            en: "Frontend Engineer with 5+ years of experience in UI-heavy products: editors, dashboards, e‑commerce, and Telegram Mini Apps.\nFocused on complex interfaces, animations, architecture, design systems, and performance optimization.\nWork end-to-end and take ownership of product outcomes, not just tasks."
        },
        profiles: {
            fullstack: {
                ru: "Fullstack Engineer с сильным фокусом на frontend и UI-heavy продуктах.\nПомимо фронтенда разрабатываю backend-сервисы на Go и мобильные Flutter-приложения с полным CI/CD и деплоем.\nПодхожу для команд, где важна автономность и быстрый вывод продукта в продакшен.",
                en: "Fullstack Engineer with a strong frontend focus and experience in UI-heavy products.\nIn addition to frontend, build backend services in Go and Flutter mobile apps with full CI/CD and deployment.\nWell-suited for teams that value autonomy and fast delivery."
            },
            all: {
                ru: "Fullstack Engineer с сильным фокусом на frontend и UI-heavy продуктах.\nПомимо фронтенда разрабатываю backend на Go и мобильные Flutter-приложения с полным CI/CD и деплоем.\nПодхожу для команд, где важна автономность и быстрый вывод продукта в продакшен.",
                en: "Fullstack Engineer with a strong frontend focus and experience in UI-heavy products.\nIn addition to frontend, build backend services in Go and Flutter mobile apps with full CI/CD and deployment.\nWell-suited for teams that value autonomy and fast delivery."
            }
        }
    }
};
