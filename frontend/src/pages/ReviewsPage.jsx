import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/Layout';
import { StarRating } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../components/ui/Loading';
import { reviewAPI } from '../services/api';
import { formatDate } from '../utils/constants';
import { FiStar } from 'react-icons/fi';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reviewee: '', rating: 5, feedback: '', type: 'ngo_to_donor' });

  useEffect(() => {
    reviewAPI.getAll().then(({ data }) => setReviews(data.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create(form);
      toast.success('Review submitted!');
      setShowForm(false);
      const { data } = await reviewAPI.getAll();
      setReviews(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Reviews & Ratings"
        subtitle="Share feedback and build trust in the community"
        action={<Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Write Review'}</Button>}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div>
            <label className="text-label block mb-2">Rating</label>
            <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} />
          </div>
          <Input label="Reviewee User ID" value={form.reviewee} onChange={(e) => setForm({ ...form, reviewee: e.target.value })} required placeholder="User ID" />
          <Select label="Review Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: 'ngo_to_donor', label: 'NGO to Donor' },
              { value: 'donor_to_ngo', label: 'Donor to NGO' },
              { value: 'ngo_to_volunteer', label: 'NGO to Volunteer' },
              { value: 'volunteer_to_ngo', label: 'Volunteer to NGO' },
            ]} />
          <Textarea label="Feedback" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} rows={3} />
          <Button type="submit">Submit Review</Button>
        </form>
      )}

      {loading ? <PageLoader /> : reviews.length === 0 ? (
        <EmptyState icon={FiStar} title="No reviews yet" description="Reviews will appear here once submitted." />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.reviewer?.name} → {r.reviewee?.name}</p>
                  <StarRating rating={r.rating} readonly size="sm" />
                </div>
                <span className="text-xs text-text-light">{formatDate(r.createdAt)}</span>
              </div>
              {r.feedback && <p className="text-sm text-text-light mt-3 leading-relaxed">{r.feedback}</p>}
              {r.donation && <p className="text-xs text-primary font-medium mt-2">Re: {r.donation.foodName}</p>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
