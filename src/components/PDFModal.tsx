import { useEffect, useRef, useState } from 'react';
import type { LangType, ProfileType } from '../lib/types';

interface PDFModalProps {
  /** Initial language for the embedded PDF route. */
  lang: LangType;
  /** Initial profile (currently-viewed page). */
  profile: ProfileType;
  /** Base path (Astro's `import.meta.env.BASE_URL` cannot reach client islands;
   *  passed in from the wrapping Astro file via prop). */
  base?: string;
}

/**
 * PDF preview modal — listens for `cv-pdf-open` window events to mount.
 *
 * The chrome cluster's PDF icon button (`#cv-pdf-btn` in Layout.astro) fires
 * `window.dispatchEvent(new CustomEvent('cv-pdf-open'))` instead of calling
 * `window.print()` directly. This decouples the static button from the React
 * island below it and keeps the modal lazy: nothing renders until the user
 * actually clicks "Print / PDF".
 *
 * Inside the modal: an iframe loads `/pdf/{lang}/{profile}/` (a separate
 * static route, light theme, A4-friendly). Toolbar exposes:
 *   - Download — triggers `iframe.contentWindow.print()` so the user can pick
 *     "Save as PDF" in the browser's print dialog
 *   - Close — unmounts the modal (Esc key also works)
 */
export default function PDFModal({ lang, profile, base = '/' }: PDFModalProps) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const baseSlash = base.endsWith('/') ? base : `${base}/`;
  const pdfUrl = `${baseSlash}pdf/${lang}/${profile}/`;

  // Direct-download URL — points at the build-time pre-generated PDF in
  // public/downloads/. Filename matches scripts/generate-pdfs.mjs naming.
  const SPEC: Record<ProfileType, string> = {
    all: 'CV',
    react: 'CV_React',
    vue: 'CV_Vue',
    fullstack: 'CV_Fullstack',
  };
  const langSuffix = lang === 'ru' ? '_RU' : '';
  const downloadName = `LenarGumerov_${SPEC[profile]}${langSuffix}.pdf`;
  const downloadUrl = `${baseSlash}downloads/${downloadName}`;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('cv-pdf-open', onOpen);
    return () => window.removeEventListener('cv-pdf-open', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const labels = lang === 'ru'
    ? { title: downloadName, download: 'Скачать PDF', close: 'Закрыть' }
    : { title: downloadName, download: 'Download PDF', close: 'Close' };

  return (
    <div
      className="cv-pdf-modal"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div className="cv-pdf-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cv-pdf-modal__bar">
          <div className="cv-pdf-modal__title">{labels.title}</div>
          <div className="cv-pdf-modal__bar-actions">
            {/* Download — desktop shows label, mobile collapses to icon-only.
                aria-label keeps the action discoverable to assistive tech. */}
            <a
              className="cv-pdf-btn cv-pdf-btn--icon-mobile"
              href={downloadUrl}
              download={downloadName}
              aria-label={labels.download}
              title={labels.download}
            >
              <svg className="cv-pdf-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="12" x2="12" y2="18" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              <span className="cv-pdf-btn__label">{labels.download}</span>
            </a>
            <button
              type="button"
              className="cv-pdf-btn cv-pdf-btn--ghost cv-pdf-btn--icon-mobile"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              title={labels.close}
            >
              <svg className="cv-pdf-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="6"  y1="6"  x2="18" y2="18" />
                <line x1="18" y1="6"  x2="6"  y2="18" />
              </svg>
              <span className="cv-pdf-btn__label">{labels.close}</span>
            </button>
          </div>
        </div>
        {/* Wrapper scrolls horizontally on small screens so the iframe can
            render at its native A4 width (~794px) and the user can pan to
            the side instead of seeing a squashed PDF. */}
        <div className="cv-pdf-modal__frame-wrap">
          <iframe
            ref={iframeRef}
            className="cv-pdf-modal__frame"
            src={pdfUrl}
            title={labels.title}
          />
        </div>
      </div>
    </div>
  );
}
