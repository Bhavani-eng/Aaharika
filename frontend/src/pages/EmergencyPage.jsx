import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/Layout';
import { UrgencyBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../components/ui/Loading';
import { useAuth } from '../context/AuthContext';
import { emergencyAPI } from '../services/api';
import { URGENCY_LEVELS, formatDate } from '../utils/constants';
import { FiAlertTriangle } from 'react-icons/fi';

export default function EmergencyPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', urgencyLevel: 'high', quantityNeeded: '', servingsNeeded: '' });

  const fetchRequests = () => {
    emergencyAPI.getAll().then(({ data }) => setRequests(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await emergencyAPI.create(form);
      toast.success('Emergency request created!');
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    }
  };

  const handleRespond = async (id) => {
    const message = prompt('Your response message:');
    if (!message) return;
    try {
      await emergencyAPI.respond(id, { message });
      toast.success('Response sent!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Emergency Requests"
        subtitle="Urgent food needs for communities in crisis"
        action={user?.role === 'ngo' && (
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'ghost' : 'primary'}>
            {showForm ? 'Cancel' : 'Create Request'}
          </Button>
        )}
      />

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Urgent food needed for..." />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Urgency Level" value={form.urgencyLevel} onChange={(e) => setForm({ ...form, urgencyLevel: e.target.value })} options={URGENCY_LEVELS} />
            <Input label="Quantity Needed" value={form.quantityNeeded} onChange={(e) => setForm({ ...form, quantityNeeded: e.target.value })} required />
          </div>
          <Input label="Servings Needed" type="number" value={form.servingsNeeded} onChange={(e) => setForm({ ...form, servingsNeeded: e.target.value })} />
          <Button type="submit">Submit Request</Button>
        </form>
      )}

      {loading ? <PageLoader /> : requests.length === 0 ? (
        <EmptyState icon={FiAlertTriangle} title="No emergency requests" description="All communities are currently served." />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{r.title}</h3>
                    <UrgencyBadge level={r.urgencyLevel} />
                  </div>
                  <p className="text-sm text-text-light leading-relaxed">{r.description}</p>
                  <p className="text-sm mt-3"><span className="font-semibold">Needed:</span> {r.quantityNeeded}</p>
                  <p className="text-xs text-text-light mt-2">{r.ngo?.organization || r.ngo?.name} · {formatDate(r.createdAt)}</p>
                </div>
                <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold capitalize
                  ${r.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
              </div>
              {user?.role === 'donor' && r.status === 'open' && (
                <div className="mt-4 pt-4 border-t border-border-light">
                  <Button size="sm" variant="secondary" onClick={() => handleRespond(r._id)}>Respond to Request</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
