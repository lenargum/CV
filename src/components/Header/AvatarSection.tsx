import React, { memo } from 'react';
import { withBasePath } from '../../lib/utils';

interface AvatarSectionProps {
  name: string;
}

// Мемоизированный компонент для аватара, который не должен перерисовываться при смене языка
const AvatarSection = memo(({ name }: AvatarSectionProps) => {
  const imgSrc = withBasePath('resume_photo.png');
  
  // Fixed square on both mobile and desktop. Auto-stretching the avatar to
  // the heading-column height blew up to ~400px when the right column had
  // multiple wrapped lines — pinning a sane fixed size avoids the runaway.
  return (
    <div className="cv-inset w-[150px] h-[150px] md:w-[132px] md:h-[132px] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 !p-0 print:w-[100px] print:h-[100px] print:rounded-lg">
      <img
        src={imgSrc}
        alt={name}
        // Mobile zooms in harder onto the face (scale 1.55 vs desktop 1.18) —
        // the smaller square would otherwise show too much shoulder/shirt.
        // transform-origin top-center keeps the head pinned and crops body.
        className="w-full h-full object-cover object-top scale-[1.55] md:scale-[1.18] origin-top"
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
  );
});

export default AvatarSection; 