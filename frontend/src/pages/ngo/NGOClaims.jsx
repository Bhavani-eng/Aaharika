import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/Layout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { claimAPI } from '../../services/api';
import { formatDate } from '../../utils/constants';
import { FiClipboard } from 'react-icons/fi';

export default function NGOClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    claimAPI.getAll().then(({ data }) => setClaims(data.data)).finally(() => setLoading(false));
  }, []);

  const handleSchedule = async (claimId) => {
    try {
      await claimAPI.schedule(claimId, { scheduledAt: scheduleDate });
      const { data } = await claimAPI.getAll();
      setClaims(data.data);
      setScheduling(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="My Claims" subtitle="Manage your claimed donations and pickup schedules" />

      {loading ? <PageLoader /> : claims.length === 0 ? (
        <EmptyState icon={FiClipboard} title="No claims yet" description="Browse available donations and claim what your community needs." />
      ) : (
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <Link to={`/donations/${c.donation?._id || c.donation}`}
                    className="font-semibold text-lg text-text hover:text-primary transition-colors">
                    {c.donation?.foodName || 'Donation'}
                  </Link>
                  <p className="text-sm text-text-light mt-1">{c.donation?.quantity} · {c.donation?.servings} servings</p>
                  {c.pickupSchedule?.scheduledAt && (
                    <p className="text-sm text-secondary font-medium mt-2">
                      Scheduled: {formatDate(c.pickupSchedule.scheduledAt)}
                    </p>
                  )}
                </div>
                <Badge status={c.status} />
              </div>
              {['confirmed', 'scheduled'].includes(c.status) && (
                <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-2 items-end">
                  {scheduling === c._id ? (
                    <>
                      <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="sm:w-auto flex-1" />
                      <Button size="sm" onClick={() => handleSchedule(c._id)}>Confirm</Button>
                      <Button size="sm" variant="ghost" onClick={() => setScheduling(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setScheduling(c._id)}>Schedule Pickup</Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
