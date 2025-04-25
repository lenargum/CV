import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../i18n/useTranslation';
import SocialIcon from './SocialIcon';

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
}

const ContentSection = ({ name, title, email, links }: ContentSectionProps) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Get translated values with defensive coding
  const translatedName = t?.personalInfo?.name || name;
  const translatedTitle = t?.personalInfo?.title || title;

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
    <div className="flex-1 p-10 flex flex-col justify-center bg-secondary relative">
      <div className="flex justify-between items-center mb-2">
        <h1 className="mb-0">{translatedName}</h1>
      </div>
      <h2 className="mb-6">{translatedTitle}</h2>
      <div className="text-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center relative">
            <button
              className="inline-flex items-center bg-transparent border-0 p-0 hover:scale-125 transition-all duration-300"
              onClick={copyEmailToClipboard}
              title={email}
            >
              <div className="text-text-primary">
                <SocialIcon type="email" />
              </div>
            </button>

            <AnimatePresence>
              {copyStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 10 }}
                  exit={{ opacity: 0, scale: 0.5, y: 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.3
                  }}
                  className="absolute top-[100%] left-0 z-10 origin-top-left"
                >
                  <span className="text-sm bg-primary text-text-primary font-medium px-3 py-1.5 rounded-md shadow-md">
                    {t?.clipboard?.[copyStatus as keyof typeof t.clipboard] || copyStatus}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>



          {links.map((link) => (
            <a
              key={link.name}
              className="inline-flex items-center hover:scale-125 transition-all duration-300"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.displayText}
            >
              <div className="text-text-primary">
                <SocialIcon type={link.icon} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSection; 