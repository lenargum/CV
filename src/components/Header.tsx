import { useTranslation } from '../i18n/useTranslation';
import { useEffect, useState, memo } from 'react';

interface HeaderProps {
  name: string;
  title: string;
  location: string;
  email: string;
  links: { name: string; url: string }[];
}

// Мемоизированный компонент для аватара, который не должен перерисовываться при смене языка
const AvatarSection = memo(({ name }: { name: string }) => {
  const imgSrc = `/CV/resume_photo.png`;
  
  return (
    <div className="w-full md:w-[250px] print:w-[250px] bg-primary relative min-h-[250px]" style={{ height: '250px' }}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={imgSrc}
          alt={name} 
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover', width: '100%', height: '100%', objectPosition: 'top' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              const fallback = document.createElement('div');
              fallback.className = "w-full h-full flex items-center justify-center text-white";
              fallback.innerHTML = `<span class="text-5xl font-bold">${name.charAt(0)}</span>`;
              e.currentTarget.parentElement.appendChild(fallback);
            }
          }}
        />
      </div>
    </div>
  );
});

// Компонент для текстового содержимого, который будет обновляться при смене языка
const ContentSection = ({ name, title, location, email }: Omit<HeaderProps, 'links'>) => {
  const { t, currentLang, _forceUpdateCounter } = useTranslation();
  const [renderKey, setRenderKey] = useState(0);
  
  // Force re-render when language changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [currentLang, _forceUpdateCounter]);

  // Get translated values with defensive coding
  const translatedName = t?.personalInfo?.name || name;
  const translatedTitle = t?.personalInfo?.title || title;
  const translatedLocation = t?.personalInfo?.location || location;

  return (
    <div key={`header-content-${renderKey}-${currentLang}`} className="flex-1 p-10 flex flex-col justify-center bg-secondary">
      <h1 className="mb-2">{translatedName}</h1>
      <h2 className="mb-6">{translatedTitle}</h2>
      <div className="text-lg">
        <p>{translatedLocation}</p>
        <p><a href={`mailto:${email}`}>{email}</a></p>
      </div>
    </div>
  );
};

export default function Header({ name, title, location, email, links }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row print:flex-row">
      <AvatarSection name={name} />
      <ContentSection name={name} title={title} location={location} email={email} />
    </header>
  );
} 