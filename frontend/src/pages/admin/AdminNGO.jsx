import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { adminAPI } from '../../services/api';
import { FiShield } from 'react-icons/fi';

export default function AdminNGOPage() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getPendingNgos().then(({ data }) => setNgos(data.data)).finally(() => setLoading(false));
  }, []);

  const verify = async (id, status, rejectionReason = '') => {
    try {
      await adminAPI.verifyNgo(id, { status, rejectionReason });
      toast.success(`NGO ${status}`);
      const { data } = await adminAPI.getPendingNgos();
      setNgos(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="NGO Verification" subtitle="Review and approve pending NGO registrations" />

      {loading ? <PageLoader /> : ngos.length === 0 ? (
        <EmptyState icon={FiShield} title="All caught up!" description="No pending NGO verifications at this time." />
      ) : (
        <div className="space-y-4">
          {ngos.map((n) => (
            <div key={n._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{n.organization || n.name}</h3>
                  <p className="text-sm text-text-light mt-1">{n.email}{n.phone && ` · ${n.phone}`}</p>
                  <p className="text-sm capitalize mt-1 text-text-light">{n.organizationType?.replace('_', ' ')}</p>
                </div>
                <span className="self-start px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending Review</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-light">
                <Button size="sm" variant="secondary" onClick={() => verify(n._id, 'approved')}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => {
                  const reason = prompt('Rejection reason:');
                  if (reason) verify(n._id, 'rejected', reason);
                }}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
