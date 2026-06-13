import { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import { DashboardLayout } from '../../components/Layout';
import { PageHeader, FilterPills } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { DonationListItem } from '../../components/DonationCard';
import { donationAPI } from '../../services/api';

const filters = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function DonorDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    donationAPI.getAll(params).then(({ data }) => setDonations(data.data)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <DashboardLayout>
      <PageHeader title="My Donations" subtitle="Track and manage all your food donations" />
      <FilterPills options={filters} value={filter} onChange={setFilter} className="mb-6" />

      {loading ? <PageLoader /> : donations.length === 0 ? (
        <EmptyState icon={FiPackage} title="No donations found" description="Try changing the filter or create a new donation." />
      ) : (
        <div className="space-y-3">
          {donations.map((d) => <DonationListItem key={d._id} donation={d} showDonor />)}
        </div>
      )}
    </DashboardLayout>
  );
}
