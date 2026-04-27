// Controls — LavaToggle (lava-lamp easter egg), LangSwitcher, PDFActions, PDFViewer
const { useEffect: useEffectC, useState: useStateC } = React;

// LavaToggle — clicking it adds .lava-mode to <body>; the noise canvas's
// `color` then changes per CSS, so the WebGL field repaints in saturated colors.
function LavaToggle({ on, onClick, t }) {
  return (
    <button
      className={"cv-lava " + (on ? "cv-lava--on" : "cv-lava--off")}
      onClick={onClick}
      aria-pressed={on}
      title={on ? "Lava lamp ON" : "Lava lamp OFF"}
    >
      <img src="../../assets/lava-lamp.png" alt="" />
    </button>
  );
}

function LangSwitcher({ lang, onChange }) {
  return (
    <div className="cv-lang">
      <button className={"cv-lang__btn " + (lang === "en" ? "is-active" : "")} onClick={() => onChange("en")}>EN</button>
      <button className={"cv-lang__btn " + (lang === "ru" ? "is-active" : "")} onClick={() => onChange("ru")}>RU</button>
    </div>
  );
}

// ProfileSwitcher — All / React / Vue / Fullstack focus versions.
// Active one is highlighted; clicking another navigates via ?profile=… so the
// page reloads cleanly (matches how Astro routes work in the real project).
const PROFILES = [
  { key: "all",       label: "All" },
  { key: "react",     label: "React" },
  { key: "vue",       label: "Vue" },
  { key: "fullstack", label: "Fullstack" },
];

function ProfileSwitcher({ profile }) {
  const go = (next) => {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("profile");
    else url.searchParams.set("profile", next);
    window.location.href = url.toString();
  };
  return (
    <div className="cv-profile">
      {PROFILES.map((p) => (
        <button
          key={p.key}
          className={"cv-profile__btn " + (profile === p.key ? "is-active" : "")}
          onClick={() => go(p.key)}
          aria-pressed={profile === p.key}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// PDFIconButton — single round icon button in the top-right chrome cluster.
// Clicking opens the in-page PDF viewer (which itself has a Download button).
function PDFIconButton({ t, onView }) {
  return (
    <button
      className="cv-pdf-iconbtn"
      onClick={onView}
      data-tip={t.viewPdf}
      aria-label={t.viewPdf}
    >
      {/* Document icon with download arrow — communicates "PDF you can preview & download" */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="12" x2="12" y2="18"/>
        <polyline points="9 15 12 18 15 15"/>
      </svg>
    </button>
  );
}

// PDFViewer — full-screen modal with embedded iframe + download/close
function PDFViewer({ open, onClose, pdfUrl, t }) {
  useEffectC(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="cv-pdf-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cv-pdf-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cv-pdf-modal__bar">
          <div className="cv-pdf-modal__title">resume.pdf</div>
          <div className="cv-pdf-modal__bar-actions">
            <a className="cv-pdf-btn" href={pdfUrl} download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>{t.downloadPdf}</span>
            </a>
            <button className="cv-pdf-btn cv-pdf-btn--ghost" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span>{t.closePdf}</span>
            </button>
          </div>
        </div>
        <div className="cv-pdf-modal__frame-wrap">
          <iframe className="cv-pdf-modal__frame" src={pdfUrl} title="Resume PDF" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LavaToggle, LangSwitcher, ProfileSwitcher, PDFIconButton, PDFViewer });
