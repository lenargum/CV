import { withBasePath } from '../../lib/utils';

export default function QRCode() {
    return (
        <div className="hidden print:flex justify-center items-center">
            <img src={withBasePath('qr-code.png')} style={{ flexGrow: 1, maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }} alt="QR Code" />
        </div>
    )
}
