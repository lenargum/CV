import React, { memo } from 'react';
import { withBasePath } from '../../lib/utils';

interface AvatarSectionProps {
  name: string;
}

// Мемоизированный компонент для аватара, который не должен перерисовываться при смене языка
const AvatarSection = memo(({ name }: AvatarSectionProps) => {
  const imgSrc = withBasePath('resume_photo.png');
  
  return (
    <div className="w-full md:w-[250px] bg-primary relative min-h-[250px] print:min-h-[100px] print:h-[100px] print:w-[150px] print:rounded-lg">
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

export default AvatarSection; 