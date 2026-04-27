# CV Site UI Kit

A high-fidelity React recreation of `lenargum.me`. The components are pixel-faithful to the Astro/React source but trimmed to one-file JSX modules for easy reuse.

## Files

- `index.html` — full page recreation. Click the lava-lamp button (top-left) to fade out the CV and see only the noise field. Click the EN/RU pill (top-right) to swap language.
- `data.js` — sample CV data adapted from `personal-info.ts`, `experiences.ts`, etc.
- `NoiseBackground.jsx` — WebGL2 simplex-noise field, ported 1:1 from the source.
- `SocialIcon.jsx` — inline social SVG glyphs (`currentColor`).
- `Tag.jsx` — categorical and uniform tag variants.
- `Header.jsx` — avatar slab + content section with the Gaussian-fisheye hover.
- `Sections.jsx` — Summary, KeySkills, Experience, Education, Achievements.
- `LavaToggle.jsx` — round button that hides the CV when on.
- `LangSwitcher.jsx` — EN / RU pill.

## Visual fidelity notes

- All colors come from `../../colors_and_type.css`.
- The animated noise canvas is identical to the source shader (white speckles on opaque black, soft parallax to mouse and scroll).
- The CV outer card uses `bg-primary-bg/90 backdrop-blur-sm` over the noise.
- Tag colors track ecosystem family (React cyan, Vue emerald, Go blue, etc.) in the "all" profile; flatten to charcoal in single-profile views.
- No webfont — the CV intentionally uses the OS sans stack.
