import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../i18n/useTranslation';
import SocialIcon from './SocialIcon';
import QRCode from './QRCode';
import type { ProfileType } from '../../lib/types';

interface ContentSectionProps {
  name: string;
  title: string;
  email: string;
  links: {
    name: string;
    url: string;
    icon: string;
    displayText: string;
  }[];
  profile: ProfileType;
  /** Optional pill rendered to the right of name/title (e.g. ProfileSwitcher).
   *  Keeps the heading row aligned with the switcher on a shared baseline. */
  profileSwitcher?: ReactNode;
}

const ContentSection = ({ name, title, email, links, profile, profileSwitcher }: ContentSectionProps) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const translatedName = t?.personalInfo?.name || name;

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus("failed");
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  return (
    <div className="flex-1 min-w-0 flex justify-between items-stretch relative print:py-0">
      <div className="flex flex-col justify-start md:justify-between min-w-0 flex-1 gap-2 md:gap-4">
        {/* Name + title on the LEFT, profile switcher on the RIGHT, same baseline.
            Stacks below name on narrow screens (md:flex-row vs flex-col). */}
        {/* On mobile, reserve a slot on the right (pr-12) so the floating
            hamburger doesn't overlap the name/title text. */}
        <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-2 md:gap-4 pr-12 md:pr-0">
          {/* Mobile pl-3 visually aligns the name/role text column with the
              "All" button label inside the profile-switcher pill above (the
              pill has internal padding, so without this offset the text
              would sit flush-left while the pill text appears indented). */}
          <div className="min-w-0 flex-1 pl-2 md:pl-0">
            <h1 className="mb-1 md:mb-2 text-xl md:text-4xl font-bold tracking-tight leading-tight">{translatedName}</h1>
            <h2 className="text-text-primary text-sm md:text-xl font-medium opacity-85 mb-0 print:mb-1">{title}</h2>
          </div>
          {profileSwitcher && (
            <div className="hidden md:block flex-shrink-0 print:hidden self-end md:self-start md:pt-1">
              {profileSwitcher}
            </div>
          )}
        </div>

        {/* Social row — handoff "cv-social" style: clean rectangular pills,
            email shows text + icon, others icon-only with title tooltip.
            Negative margin pulls the FIRST pill's icon flush with text above
            (text starts at column 0; pill has internal padding). Hover-bg
            slight visual offset is intentional. */}
        <div className="flex flex-wrap items-center gap-2 print:hidden md:-ml-[10px]">
          {/* Email pill — wrapped in a relative container so the toast
              originates from the pill itself (not from the row's left edge).
              w-fit clamps the wrapper to button width so left-1/2 lands on
              the actual button center, not a stretched flex-item bbox. */}
          <div className="relative w-fit">
            <button
              type="button"
              className="cv-social custom-link"
              onClick={copyEmailToClipboard}
              aria-label={email}
            >
              <SocialIcon type="email" />
              <span className="hidden md:inline text-sm">{email}</span>
            </button>
            <AnimatePresence>
              {copyStatus && (
                <motion.div
                  /* x:'-50%' must live on the motion prop — Tailwind's
                     -translate-x-1/2 gets clobbered by the inline transform
                     motion writes for scale/y, which silently broke centring. */
                  initial={{ opacity: 0, scale: 0.5, y: -4, x: '-50%' }}
                  animate={{ opacity: 1, scale: 1,   y: 6,  x: '-50%' }}
                  exit={{    opacity: 0, scale: 0.5, y: -4, x: '-50%' }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                  className="absolute top-full left-1/2 z-10 origin-top whitespace-nowrap"
                >
                  {/* Toast styled to match the global .cv-tip hover tooltip
                      (rgba dark surface, no border, same type/padding/radius). */}
                  <span
                    className="font-medium"
                    style={{
                      font: '500 11px/1 var(--font-sans)',
                      color: 'var(--fg-primary)',
                      background: 'rgba(20, 20, 20, 0.92)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      display: 'inline-block',
                    }}
                  >
                    {t?.clipboard?.[copyStatus as keyof typeof t.clipboard] || copyStatus}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((link) => {
            // Telegram gets text+icon treatment matching email (alias is short
            // and verifiable). Other socials remain icon-only with tooltip.
            const isTelegram = link.name === 'Telegram';
            return (
              <a
                key={link.name}
                className={`cv-social custom-link ${isTelegram ? '' : 'cv-social--icon'}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.displayText}
                aria-label={link.displayText}
              >
                <SocialIcon type={link.icon} />
                {isTelegram && <span className="hidden md:inline text-sm">{link.displayText}</span>}
              </a>
            );
          })}
        </div>

        {/* Print-only contact line */}
        <div className="hidden print:flex print:flex-row print:items-center print:gap-x-2">
          <span className="text-text-primary text-sm">telegram: {links.filter(link => link.name === 'Telegram')[0]?.displayText},</span>
          <span className="text-text-primary text-sm">email: {email}</span>
        </div>
      </div>
      <QRCode profile={profile} />
    </div>
  );
};

export default ContentSection;
