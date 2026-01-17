import type { ProfileType } from '@/lib/types';
import { withBasePath } from '../../lib/utils';
import { useTranslation } from '@/i18n/useTranslation';

export default function QRCode({ profile }: { profile: ProfileType }) {
    const { currentLang } = useTranslation();

    return (
        <a className="hidden print:flex justify-center items-center" href={`https://lenargum.github.io/CV/${currentLang}/${profile}/`} target="_blank" rel="noopener noreferrer" title="Open CV in browser">
            <img src={withBasePath(`/qr/qr-code-${currentLang}-${profile}.png`)} style={{ flexGrow: 1, maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }} alt="Open CV in browser" />
        </a>
    )
}
