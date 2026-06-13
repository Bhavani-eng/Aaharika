import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { complaintAPI } from '../../services/api';
import { formatDate } from '../../utils/constants';
import { FiAlertCircle } from 'react-icons/fi';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintAPI.getAll().then(({ data }) => setComplaints(data.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await complaintAPI.update(id, { status, resolution: `Marked as ${status} by admin` });
      toast.success('Complaint updated');
      const { data } = await complaintAPI.getAll();
      setComplaints(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const statusColors = {
    open: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-600',
  };

  return (
    <DashboardLayout>
      <PageHeader title="Complaints Management" subtitle="Review and resolve user complaints" />

      {loading ? <PageLoader /> : complaints.length === 0 ? (
        <EmptyState icon={FiAlertCircle} title="No complaints" description="All clear — no complaints to review." />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-text">{c.subject}</h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed">{c.description}</p>
                  <p className="text-xs text-text-light mt-3">
                    Filed by: <span className="font-medium">{c.filedBy?.name}</span> · {formatDate(c.createdAt)} · <span className="capitalize">{c.category?.replace('_', ' ')}</span>
                  </p>
                </div>
                <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[c.status]}`}>{c.status}</span>
              </div>
              {['open', 'investigating'].includes(c.status) && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-light">
                  <Button size="sm" variant="outline" onClick={() => updateStatus(c._id, 'investigating')}>Investigate</Button>
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(c._id, 'resolved')}>Resolve</Button>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(c._id, 'dismissed')}>Dismiss</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
