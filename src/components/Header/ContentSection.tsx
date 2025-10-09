import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../i18n/useTranslation';
import SocialIcon from './SocialIcon';
import QRCode from './QRCode';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);

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

  useEffect(() => {
    // Initialize the buttonRefs array with the correct length
    buttonRefs.current = buttonRefs.current.slice(0, links.length + 1);
  }, [links]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getButtonScale = (buttonEl: HTMLElement | null): string => {
    if (!isHovering || !buttonEl) return '';
    
    const buttonRect = buttonEl.getBoundingClientRect();
    if (!containerRef.current) return '';
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the center of the button relative to the container
    const buttonCenterX = buttonRect.left + buttonRect.width / 2 - containerRect.left;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2 - containerRect.top;
    
    // Calculate the distance between mouse and button center
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - buttonCenterX, 2) + 
      Math.pow(mousePosition.y - buttonCenterY, 2)
    );
    
    // Maximum distance for scaling effect (adjust as needed)
    const maxDistance = 200;
    const hoverDistance = 15;
    
    if (distance > maxDistance) {
      return '';
    } else if (distance < hoverDistance) {
      return 'scale(1.5)';
    } else {
      return `scale(${1 + 0.35 * (1 - distance / maxDistance)})`;
    }
  };

  const setButtonRef = (index: number) => (el: HTMLElement | null) => {
    buttonRefs.current[index] = el;
  };

  return (
    <div className="flex-1 p-8 md:p-10 print:py-0 flex justify-between items-center bg-secondary/80 relative">
      <div className="flex flex-col justify-center">
        <div className="flex justify-between items-center mb-2">
          <h1 className="mb-0">{translatedName}</h1>
        </div>
        <h2 className="mb-8 print:mb-1">{translatedTitle}</h2>
        <div className="text-lg">
          <div
            ref={containerRef}
            className="flex print:flex-col items-center print:items-start gap-6 print:gap-2"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center relative">
              <button
                ref={setButtonRef(0)}
                className="inline-flex items-center bg-transparent border-0 p-0 transition-all duration-300 print:hidden"
                onClick={copyEmailToClipboard}
                title={email}
                style={{ transform: getButtonScale(buttonRefs.current[0]) }}
              >
                <div className="text-text-primary">
                  <SocialIcon type="email" />
                </div>
              </button>
              <span className="text-text-primary text-md print:inline-block hidden">Telegram: {links.filter(link => link.name === 'Telegram')[0].displayText}</span>

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

            <div className="flex items-center gap-6 print:hidden">
              {links.map((link, index) => (
                <a
                  key={link.name}
                  ref={setButtonRef(index + 1)}
                  className="inline-flex items-center bg-transparent border-0 p-0 transition-all duration-300"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.displayText}
                  style={{ transform: getButtonScale(buttonRefs.current[index + 1]) }}
                >
                  <div className="text-text-primary">
                    <SocialIcon type={link.icon} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <QRCode />
    </div>
  );
};

export default ContentSection; 