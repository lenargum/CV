---
name: lenar-cv-design
description: Use this skill to generate well-branded interfaces and assets for Lenar Gumerov's personal CV site (lenargum.me), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and a UI kit recreation of the CV for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key facts:
- Personal CV / portfolio site of Lenar Gumerov, Senior Frontend Engineer.
- Pure dark aesthetic — black/charcoal surfaces, white text, an animated WebGL simplex-noise field as the only background motif. No gradients, no marketing chrome, no emoji.
- Bilingual EN / RU. The "lava-lamp" toggle in the corner fades the entire CV out, leaving just the noise.
- No webfont — relies on the OS sans stack on purpose.
- Design tokens live in `colors_and_type.css`. Component recreations live in `ui_kits/cv-site/`.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Reuse the noise canvas, the categorical tag system, and the `cv-card` container — those are the brand.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. The original site is in the `CV/` codebase (Astro + React + Tailwind).

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
