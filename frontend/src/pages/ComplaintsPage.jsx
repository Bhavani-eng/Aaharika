import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../components/ui/Loading';
import { complaintAPI } from '../services/api';
import { formatDate } from '../utils/constants';
import { FiMessageSquare } from 'react-icons/fi';

const categories = [
  { value: 'food_quality', label: 'Food Quality' },
  { value: 'no_show', label: 'No Show' },
  { value: 'late_pickup', label: 'Late Pickup' },
  { value: 'misconduct', label: 'Misconduct' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'other', label: 'Other' },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', against: '', donation: '' });

  useEffect(() => {
    complaintAPI.getAll().then(({ data }) => setComplaints(data.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.against) delete payload.against;
      if (!payload.donation) delete payload.donation;
      await complaintAPI.create(payload);
      toast.success('Complaint filed');
      setShowForm(false);
      const { data } = await complaintAPI.getAll();
      setComplaints(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file complaint');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Complaints"
        subtitle="Report issues and track resolution status"
        action={<Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'File Complaint'}</Button>}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Against User ID (optional)" value={form.against} onChange={(e) => setForm({ ...form, against: e.target.value })} />
            <Input label="Donation ID (optional)" value={form.donation} onChange={(e) => setForm({ ...form, donation: e.target.value })} />
          </div>
          <Button type="submit">Submit Complaint</Button>
        </form>
      )}

      {loading ? <PageLoader /> : complaints.length === 0 ? (
        <EmptyState icon={FiMessageSquare} title="No complaints" description="You haven't filed any complaints yet." />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-text">{c.subject}</h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed">{c.description}</p>
                  <p className="text-xs text-text-light mt-2">{formatDate(c.createdAt)} · <span className="capitalize">{c.category?.replace('_', ' ')}</span></p>
                </div>
                <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold capitalize
                  ${c.status === 'resolved' ? 'bg-green-100 text-green-800' : c.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {c.status}
                </span>
              </div>
              {c.resolution && (
                <p className="text-sm text-secondary mt-4 pt-4 border-t border-border-light">
                  <span className="font-semibold">Resolution:</span> {c.resolution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
