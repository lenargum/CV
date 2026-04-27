# Lenar CV — Design System

A design system distilled from **Lenar Gumerov's interactive CV** (`lenargum.me`) — a single‑page, dark‑mode, print‑ready resume site built with Astro + React + Tailwind. The aesthetic is **bold black slabs, generous whitespace, mono‑photo portrait, an animated WebGL noise field behind everything, and a single playful "lava lamp" easter egg** that hides the CV when toggled.

> ебашу себе пиздатейшее резюме потому что я крутой.
> The vibe: punchy, opinionated, technical, slightly mischievous.

## Sources

| What | Where |
|------|-------|
| Astro/React codebase | `CV/` (mounted, read‑only) — origin: `lenargum/CV` on GitHub |
| Live site | https://lenargum.me/ |
| Tailwind theme | `CV/tailwind.config.mjs` |
| Global CSS / print rules | `CV/src/styles/global.css` |
| Components | `CV/src/components/` (Header, Tag, Experience, Tags, NoiseBackground, …) |
| Content data | `CV/src/data/{personal-info,experiences,education,achievements,tags}.ts` |
| i18n strings | `CV/src/i18n/{en,ru}.ts` |
| Visual assets | `CV/public/` (avatar, resume photo, lava lamp, company icons) |

## Index

- `colors_and_type.css` — design tokens (CSS vars) for colors, type, spacing, radii, shadows.
- `assets/` — brand imagery (avatar, resume photo, lava lamp), favicon, company/school icons.
- `preview/` — design‑system preview cards rendered in the Design System tab.
- `ui_kits/cv-site/` — high‑fidelity React recreation of the resume page with all key sections.
- `SKILL.md` — Agent‑Skill‑compatible entry point.

---

## Content fundamentals

The CV speaks in **first‑person Russian and English** with a deliberate **technical, no‑bullshit, slightly cocky** tone. It's not corporate. It's a personal product.

- **Bilingual by design.** Every public string lives in both `en.ts` and `ru.ts`. Russian is the primary author voice; English is the export. Always design with both lengths in mind (Russian runs ~20–30% longer).
- **Profiled content.** The CV swaps bullets per "profile" (`react`, `vue`, `fullstack`, `all`) — same source, different emphasis. Copy the pattern: write a `base` line, override per audience.
- **First person, but compact.** "Built…", "Owned…", "Led…", "Optimized…". Verbs first. No "I am a passionate engineer who…".
  - EN: *"Led the frontend of a Telegram gaming platform from pre‑launch to **1M users**, owning UI and core business logic"*
  - RU: *"Возглавил фронтенд игровой платформы в Telegram: от prelaunch до **1M пользователей**"*
- **Numbers do the bragging.** `−42% LCP`, `+18% CTR`, `1.1MB → 490KB gz`, `~10 → ~2 minutes`. Bold the metric.
- **Markdown inline.** Bold for impact (`**1M users**`), `[link text](url)` for proofs (certificates, repos, posts). Renders via a custom `MarkdownText` component.
- **Casing.** Title‑case for section headings ("Key Skills", "Experience", "Awards"). Sentence‑case for bullets. Lower‑case for tags ("React", "Next.js", "TypeScript" — keep the canonical brand casing).
- **No emoji in the product UI.** README files in the source repo use a few (🌟 🛠️ 🚀) but the rendered CV itself has zero emoji. Don't introduce them in artifacts.
- **No Unicode‑decoration icons.** Only real SVG/PNG.
- **Tone in micro‑copy.** "Copied!" / "Failed to copy" — short, friendly. Russian: "Скопировано!" — never apologetic.
- **Profanity is allowed in private notes** (cf. user description). Not in shipped product copy.

### Tone examples — how to write a new bullet

- ✅ *"Reduced initial JS payload by **55%** (1.1MB → 490KB gz) via code‑splitting and asset deduplication."*
- ✅ *"Owned 6+ end‑to‑end product features across 17 epics — onboarding, banner system, referral program."*
- ❌ *"Worked on various features and helped improve performance using modern best practices."*

---

## Visual foundations

### Palette
Two surfaces dominate: **`#0A0A0A` ("primary‑bg")** and **`#222222` ("secondary")**. White text on black. The body sits on `gray‑100` (`#F3F4F6`) but you only ever see it via the noise canvas.

A **categorical accent palette** colors technology tags in the "all" profile only. Each ecosystem family gets one swatch:
- React ecosystem → `#61DBFB` (React cyan, black text)
- Vue ecosystem → `emerald‑500` (`#10B981`, white text)
- Backend → `#00ADD8` (Go blue, white text)
- Architecture → `orange‑500` (white text)
- Principles → `violet‑500` (white text)
- Process → `zinc‑700` (white text)
- Mobile → `blue‑500` (white text)
- Rendering → `blue‑600` (white text)
- UX & Visual → `yellow‑400` (black text)
- Tools → `slate‑500` (white text)
- Core / Frontend Core → transparent on black with `zinc‑900` border

In single‑profile views (`/react/`, `/vue/`, …) the rainbow collapses to a **uniform charcoal pill** so the page reads as a single confident voice.

### Typography
- Tailwind default `font-sans` — **no custom webfont**. The native UI stack (system‑ui / Segoe / Roboto) is the design choice. This keeps the site under 500KB initial JS and prints cleanly.
- Hierarchy: `4xl/700` for the name, `2xl/600` for section titles, `xl/500` for h3, `base` body. Dates and sub‑details use `text-sm` in `text-tertiary` (`#718096`).
- **No font substitution needed** — system stack is the system stack.

### Backgrounds
- **Animated WebGL noise field** (3D simplex noise → soft bubble pattern) renders fullscreen behind the content. Color: white speckles on black. Subtle parallax to mouse and scroll. Honors `prefers-reduced-motion` (renders a static frame). Hidden in print.
- The CV card itself sits on top with `bg-primary-bg/90 backdrop-blur-sm`. The header‑right block uses `bg-secondary/80` for visual separation.
- **No gradients. No textures. No illustrations.** The only "decoration" is the noise.
- The "lava lamp" toggle (top‑left button with a tiny lava‑lamp PNG) hides the CV and shows only the noise field — a personality moment, not a feature.

### Animation
- Library: **`motion` (Motion One / Framer Motion v12)**.
- Page enter: `opacity 0 → 1`, `duration: 1s`, `ease: easeInOut` on the whole CV card.
- Lava toggle: same fade, opacity transition.
- Header social icons: **Gaussian "fisheye" hover** — a field of influence around the cursor scales nearby icons up to `1.35×` with a `sigma` of 70px. On entry, transition is `1000ms` (gentle rise); after settling, it drops to `150ms` (responsive). Easing: `cubic-bezier(0, 0, 0.2, 1)` (ease‑out).
- Copy‑email toast: `motion` `AnimatePresence`, scale 0.5 → 1, slight y‑drop, `duration: 0.3s`, `easeInOut`.
- Tag rendering: static (no animation).
- No bounces, no springs‑with‑overshoot. Everything is **ease‑out, gentle, deliberate**.

### Hover & press
- Links: color transitions from `blue-500` → `blue-400`.
- Lava toggle: opacity `0.6 → 0.3` when on; `active:scale-110` on press.
- Social icons: scale via Gaussian field (see Animation above), no color change on hover.
- Tags: static, no hover state.
- Email button: visual change is the toast that appears, not the button itself.

### Borders, shadows, radii
- **Cards** (skill groups): `rounded-xl` (`12px`), `bg-primary-bg/80`, `backdrop-blur-sm`, `p-4`. **No shadow, no border.** Translucency does the lifting.
- **Tags**: `rounded-md` (`6px`), `px-2 py-1`, `text-xs`. Borders only on transparent variants.
- **Company logos in experience**: `rounded-xl`, `w-10 h-10` mobile / `w-20 h-20` desktop.
- **CV outer container**: `shadow-md` on screen, none in print.
- **Avatar block**: hard rectangle on screen, `rounded-lg` only in print.
- No drop‑shadow on text, no glow effects.

### Transparency & blur
- Heavy use of `backdrop-blur-sm` over the noise field — `primary-bg/90` on the main card, `primary-bg/80` on skill chips, `secondary/80` on the header‑right block.
- Print stylesheet strips all transparency: `bg-secondary/80` and `bg-primary-bg/80` collapse to `transparent`.

### Layout
- Single column, **`max-width: 830px`**, centered. No grid system at the page level.
- The header splits **250px avatar block | flex‑1 content block** on desktop, stacks vertically on mobile.
- Skill groups inside the "all" view use a `grid-cols-12` with hand‑tuned column spans per group (Core 4, React 5, Vue 3, …) — intentional asymmetric rhythm.
- Sections: `p-6 md:p-8`, last‑but‑first padded `pb-10`. Print collapses everything to `p-0` + `pb-2`.
- A small fixed/absolute UI sits in the top‑left (lava toggle) and top‑right (language switcher).

### Print
- Print is a **first‑class output**. `@page { margin: 9mm; size: A4; }`. All transparency, shadows, and the noise canvas are stripped. Black text on white. A QR code linking to the live profile is rendered only in print (`hidden print:flex`).

### Imagery vibe
- Resume portrait: black‑and‑white, top‑aligned, full‑bleed inside the avatar slab. **Cool, contrasty, slightly cinematic.**
- The cover OG image is a stylized photo composition.
- All company logos are square, varied (PNG / SVG / JPG), shown at small sizes — they're identifiers, not features.

---

## Iconography

The CV uses **two sources of icons** and avoids emoji entirely.

1. **Hand‑authored inline SVG** for social platforms (`Header/SocialIcon.tsx`): LinkedIn, Telegram, Instagram, GitHub, plus a custom mail glyph. Mostly **filled** style (LinkedIn, Telegram, Instagram, GitHub use `fill="currentColor"`); the email icon is **stroked** (`strokeWidth="2"`). 24px default size, color via `currentColor` so the icon inherits text color.
2. **Raster company / school logos** in `public/icons/` (PNG, SVG, JPG mixed). Each experience entry references one via `icon: '/CV/icons/<name>'`. Square assets, displayed at 40px (mobile) / 80px (desktop) with `rounded-xl`.

Copies in this design system:
- `assets/favicon.svg` — site favicon.
- `assets/icons/cobalt.png`, `freelance.png`, `freelance_white.png`, `iu.jpg`, `mkskom.svg`, `portal.jpg`, `smartua.svg`, `icons8.svg` — all company/education logos.
- Inline SVGs for socials live in `ui_kits/cv-site/SocialIcon.jsx` (recreated 1:1 from source).

**No icon font, no Lucide/Heroicons, no Material icons.** The site keeps its surface area tiny: real logos for institutions, hand‑drawn glyphs for socials. **Do not introduce a generic icon library** — it would dilute the bespoke feel.

**Emoji**: zero in the rendered CV. README files in source use a few decorative ones; do not use them in artifacts that mimic the product.

**Unicode characters as glyphs**: only the em‑dash (`—`) used in date ranges and tag‑inline lists. No `→ • ★` etc.

---

## How to use

If you're an agent: read `SKILL.md`, then `colors_and_type.css`, then crack open `ui_kits/cv-site/index.html` to see the components in context. Copy assets out of `assets/` into your output project. Don't redraw what's already drawn.
