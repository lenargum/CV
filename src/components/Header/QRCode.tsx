import { withBasePath } from '../../lib/utils';

export default function QRCode() {
    return (
        <a className="hidden print:flex justify-center items-center" href="https://lenargum.github.io/CV/" target="_blank" rel="noopener noreferrer" title="Open CV in browser">
            <img src={withBasePath('qr-code.png')} style={{ flexGrow: 1, maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }} alt="Open CV in browser" />
        </a>
    )
}
