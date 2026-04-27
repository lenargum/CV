// Tag.jsx — 1:1 port of CV/src/components/Tag/Tag.tsx (color logic + uniform variant)
const CORE_TAGS = ["Frontend","Backend","Mobile","Data Structures & Algorithms","Game Development"];
const FRONTEND_CORE_TAGS = ["TypeScript","JavaScript","HTML","CSS","SCSS","Git","CI/CD"];
const REACT_ECOSYSTEM_TAGS = ["React","Redux","Zustand","Next.js","shadcn/ui","Aceternity UI"];
const VUE_ECOSYSTEM_TAGS = ["Vue","Vuex","Pinia","Nuxt","Vuetify"];
const BACKEND_TAGS = ["Go","PostgreSQL","Redis","MongoDB","Docker","REST API","Microservices","Message Queues","SQL","NoSQL","TimescaleDB","WebSockets"];
const TOOLING_TAGS = ["Vite","Vitest","Tailwind","Figma","Telegram Mini Apps (TMA)","Google Tag Manager","Yandex Metrica","PostHog","Motion.js","Paper.js","Chart.js","SVG","Cursor","Claude","ChatGPT"];
const RENDERING_TAGS = ["SPA","SSR","SSG","CSR"];
const UI_VISUAL_TAGS = ["UI/UX","Motion & Interaction Design","Responsive & Fluid Layout Systems","Themability & Runtime Theming","Accessibility"];
const ARCHITECTURE_TAGS = ["Design Systems","Feature-Sliced Design","Atomic Design","Clean Architecture","MVC","MVVM","State Management","Flux","Microfrontends","Modular Frontend"];
const MOBILE_TAGS = ["Flutter","Android","iOS"];
const PRINCIPLES_TAGS = ["Web Performance Optimization","SOLID","DRY","KISS","YAGNI"];
const PROCESS_TAGS = ["Agile","Scrum","Lean","Waterfall"];

window.CV_TAG_GROUPS = {
  CORE: CORE_TAGS, FRONTEND_CORE: FRONTEND_CORE_TAGS,
  REACT: REACT_ECOSYSTEM_TAGS, VUE: VUE_ECOSYSTEM_TAGS,
  BACKEND: BACKEND_TAGS, TOOLING: TOOLING_TAGS,
  RENDERING: RENDERING_TAGS, UI_VISUAL: UI_VISUAL_TAGS,
  ARCHITECTURE: ARCHITECTURE_TAGS, MOBILE: MOBILE_TAGS,
  PRINCIPLES: PRINCIPLES_TAGS, PROCESS: PROCESS_TAGS,
};

function Tag({ tag, profile = "all" }) {
  // Uniform style for narrowed profiles
  if (profile !== "all") {
    return <span className="cv-tag cv-tag--uniform">{tag}</span>;
  }
  let cls = "cv-tag cv-tag--default";
  if (CORE_TAGS.includes(tag) || FRONTEND_CORE_TAGS.includes(tag))
    cls = "cv-tag cv-tag--core";
  else if (MOBILE_TAGS.includes(tag))         cls = "cv-tag cv-tag--mobile";
  else if (ARCHITECTURE_TAGS.includes(tag))   cls = "cv-tag cv-tag--architecture";
  else if (PRINCIPLES_TAGS.includes(tag))     cls = "cv-tag cv-tag--principles";
  else if (PROCESS_TAGS.includes(tag))        cls = "cv-tag cv-tag--process";
  else if (REACT_ECOSYSTEM_TAGS.includes(tag))cls = "cv-tag cv-tag--react";
  else if (VUE_ECOSYSTEM_TAGS.includes(tag))  cls = "cv-tag cv-tag--vue";
  else if (BACKEND_TAGS.includes(tag))        cls = "cv-tag cv-tag--backend";
  else if (RENDERING_TAGS.includes(tag))      cls = "cv-tag cv-tag--rendering";
  else if (TOOLING_TAGS.includes(tag))        cls = "cv-tag cv-tag--tools";
  else if (UI_VISUAL_TAGS.includes(tag))      cls = "cv-tag cv-tag--ux";
  return <span className={cls}>{tag}</span>;
}

window.Tag = Tag;
