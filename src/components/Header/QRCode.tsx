export default function QRCode() {
    return (
        <div className="hidden print:flex justify-center items-center ">
            <img src="/CV/qr-code.png" style={{ flexGrow: 1, maxWidth: '100px', maxHeight: '100px' }} alt="QR Code" />
        </div>
    )
}
