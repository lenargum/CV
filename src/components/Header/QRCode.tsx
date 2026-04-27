import type { ProfileType } from '@/lib/types';
import { withBasePath } from '../../lib/utils';
import { useTranslation } from '@/i18n/useTranslation';

export default function QRCode({ profile }: { profile: ProfileType }) {
    const { currentLang } = useTranslation();

    return (
        <a className="hidden print:flex justify-center items-center" href={(() => {
            const langSegment = currentLang === 'en' ? '' : 'ru/';
            const profileSegment = profile === 'all' ? '' : `${profile}/`;
            return `https://lenargum.me/${langSegment}${profileSegment}`;
          })()} target="_blank" rel="noopener noreferrer" title="Open CV in browser">
            <img
              src={withBasePath(`/qr/qr-code-${currentLang}-${profile}.svg`)}
              width={100}
              height={100}
              loading="lazy"
              decoding="async"
              style={{ flexGrow: 1, maxWidth: '100px', maxHeight: '100px' }}
              alt="Open CV in browser"
            />
        </a>
    )
}
