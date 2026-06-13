import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiX } from 'react-icons/fi';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const [manualData, setManualData] = useState('');
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const scannerId = 'qr-reader';
    const html5QrCode = new Html5Qrcode(scannerId);
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        onScan(decodedText);
        html5QrCode.stop().catch(() => {});
      },
      () => {}
    ).catch((err) => setError(err.message || 'Camera access denied'));

    return () => { html5QrCode.stop().catch(() => {}); };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-text/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md overflow-hidden animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h3 className="text-h3">Scan QR Code</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-text-light transition-colors">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {error ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
              <Input
                label="Paste QR data manually"
                value={manualData}
                onChange={(e) => setManualData(e.target.value)}
                placeholder="Paste QR code data here"
              />
              <Button fullWidth onClick={() => manualData && onScan(manualData)}>Verify</Button>
            </div>
          ) : (
            <div id="qr-reader" className="rounded-xl overflow-hidden" />
          )}
        </div>
        <div className="px-6 pb-6">
          <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export const QRDisplay = ({ qrCode, title, subtitle }) => {
  if (!qrCode) return null;
  return (
    <div className="text-center p-6 bg-background rounded-xl border border-border-light">
      {title && <h4 className="font-semibold text-text mb-1">{title}</h4>}
      {subtitle && <p className="text-sm text-text-light mb-4">{subtitle}</p>}
      <div className="inline-block p-3 bg-white rounded-xl border border-border-light">
        <img src={qrCode} alt="QR Code" className="w-44 h-44" />
      </div>
    </div>
  );
};
