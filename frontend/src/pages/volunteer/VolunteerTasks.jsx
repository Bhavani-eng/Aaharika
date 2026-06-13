import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/Layout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader, FilterPills } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { volunteerAPI } from '../../services/api';
import { FiTruck } from 'react-icons/fi';

const tabs = [
  { value: 'available', label: 'Available' },
  { value: 'mine', label: 'My Tasks' },
];

export default function VolunteerTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState('available');
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    setLoading(true);
    const params = tab === 'mine' ? { mine: 'true' } : {};
    volunteerAPI.getTasks(params).then(({ data }) => setTasks(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, [tab]);

  const acceptTask = async (id) => {
    try {
      await volunteerAPI.accept(id);
      toast.success('Task accepted!');
      setTab('mine');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await volunteerAPI.updateStatus(id, status);
      toast.success('Status updated!');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Delivery Tasks" subtitle="Accept and manage food delivery assignments" />
      <FilterPills options={tabs} value={tab} onChange={setTab} className="mb-6" />

      {loading ? <PageLoader /> : tasks.length === 0 ? (
        <EmptyState icon={FiTruck} title="No tasks found" description={tab === 'available' ? 'Check back later for new delivery tasks.' : 'Accept a task to get started.'} />
      ) : (
        <div className="space-y-4">
          {tasks.map((t) => (
            <div key={t._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-text">{t.donation?.foodName}</h3>
                  <p className="text-sm text-text-light mt-1">
                    <span className="font-medium text-text">Pickup:</span> {t.pickupLocation?.address}
                  </p>
                  <p className="text-sm text-text-light mt-0.5">
                    <span className="font-medium text-text">Deliver to:</span> {t.deliveryLocation?.address || t.claim?.ngo?.organization}
                  </p>
                </div>
                <Badge status={t.status} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-light">
                {t.status === 'available' && tab === 'available' && (
                  <Button size="sm" onClick={() => acceptTask(t._id)}>Accept Task</Button>
                )}
                {t.status === 'accepted' && (
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(t._id, 'in_transit')}>Start Delivery</Button>
                )}
                {t.status === 'in_transit' && (
                  <Button size="sm" variant="accent" onClick={() => updateStatus(t._id, 'delivered')}>Mark Delivered</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
