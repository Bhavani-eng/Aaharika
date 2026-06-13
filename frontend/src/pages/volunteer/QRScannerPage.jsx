import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMaximize2 } from 'react-icons/fi';
import { DashboardLayout } from '../../components/Layout';
import { QRScanner } from '../../components/QRScanner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/ui/PageHeader';
import { claimAPI, volunteerAPI } from '../../services/api';

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState('pickup');
  const [claimId, setClaimId] = useState('');
  const [taskId, setTaskId] = useState('');

  const handleScan = async (qrData) => {
    setScanning(false);
    try {
      if (scanType === 'pickup') {
        if (!claimId) return toast.error('Enter claim ID first');
        await claimAPI.verifyPickup(claimId, qrData);
        toast.success('Pickup verified!');
      } else {
        if (!taskId) return toast.error('Enter task ID first');
        await volunteerAPI.verifyDelivery(taskId, qrData);
        toast.success('Delivery verified!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="QR Scanner" subtitle="Verify pickup and delivery with QR codes" />

      <div className="max-w-lg mx-auto">
        <div className="card space-y-6">
          <div className="flex rounded-xl bg-background p-1 gap-1">
            {['pickup', 'delivery'].map((t) => (
              <button key={t} onClick={() => setScanType(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200
                  ${scanType === t ? 'bg-surface text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
                {t} Scan
              </button>
            ))}
          </div>

          {scanType === 'pickup' ? (
            <Input label="Claim ID" placeholder="Enter claim ID" value={claimId} onChange={(e) => setClaimId(e.target.value)} />
          ) : (
            <Input label="Task ID" placeholder="Enter task ID" value={taskId} onChange={(e) => setTaskId(e.target.value)} />
          )}

          <Button fullWidth size="lg" onClick={() => setScanning(true)}>
            <FiMaximize2 className="h-4 w-4" /> Open Scanner
          </Button>
          <p className="text-xs text-text-light text-center">You can also paste QR data manually in the scanner dialog</p>
        </div>
      </div>

      {scanning && <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />}
    </DashboardLayout>
  );
}
