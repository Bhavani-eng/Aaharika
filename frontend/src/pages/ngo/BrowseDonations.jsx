import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { Select, SearchInput } from '../../components/ui/Input';
import { PageHeader, Grid } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { DonationCard } from '../../components/DonationCard';
import { donationAPI } from '../../services/api';
import { DONATION_CATEGORIES } from '../../utils/constants';
import { FiSearch } from 'react-icons/fi';

export default function BrowseDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchDonations = () => {
    setLoading(true);
    const params = { status: 'available' };
    if (search) params.search = search;
    if (category) params.category = category;
    donationAPI.getAll(params).then(({ data }) => setDonations(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, [category]);

  return (
    <DashboardLayout>
      <PageHeader title="Browse Donations" subtitle="Find available food donations near you" />

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={fetchDonations} className="flex-1" />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}
            options={[{ value: '', label: 'All Categories' }, ...DONATION_CATEGORIES]} className="sm:w-48" />
          <Button onClick={fetchDonations} className="shrink-0"><FiSearch className="h-4 w-4" /> Search</Button>
        </div>
      </div>

      {loading ? <PageLoader /> : donations.length === 0 ? (
        <EmptyState icon={FiSearch} title="No donations found" description="Try adjusting your search or filters." />
      ) : (
        <Grid cols={3}>
          {donations.map((d) => <DonationCard key={d._id} donation={d} showDonor />)}
        </Grid>
      )}
    </DashboardLayout>
  );
}
