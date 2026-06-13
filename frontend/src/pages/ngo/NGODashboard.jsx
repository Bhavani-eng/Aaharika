import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/Layout';
import { StatCard } from '../../components/ui/Card';
import { PageHeader, Grid, Section } from '../../components/ui/PageHeader';
import { PageLoader } from '../../components/ui/Loading';
import { DonationCard } from '../../components/DonationCard';
import { Badge } from '../../components/ui/Badge';
import { donationAPI, claimAPI } from '../../services/api';
import { formatDate } from '../../utils/constants';

export default function NGODashboard() {
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      donationAPI.getAll({ status: 'available', limit: 6 }),
      claimAPI.getAll({ limit: 5 }),
    ]).then(([dRes, cRes]) => {
      setDonations(dRes.data.data);
      setClaims(cRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title="NGO Dashboard" subtitle="Discover and claim food donations for your community" />

      <Grid cols={3} className="mb-8">
        <StatCard title="Available Now" value={donations.length} color="primary" />
        <StatCard title="Active Claims" value={claims.filter((c) => !['delivered', 'cancelled'].includes(c.status)).length} color="accent" />
        <StatCard title="Completed" value={claims.filter((c) => c.status === 'delivered').length} color="secondary" />
      </Grid>

      <Section
        title="Available Donations"
        action={<Link to="/ngo/donations" className="text-sm font-semibold text-primary hover:text-primary-dark">Browse all →</Link>}
      >
        {donations.length === 0 ? (
          <div className="card text-center py-10 text-text-light">No donations available right now. Check back soon!</div>
        ) : (
          <Grid cols={3}>
            {donations.map((d) => <DonationCard key={d._id} donation={d} showDonor compact />)}
          </Grid>
        )}
      </Section>

      <Section title="Recent Claims" className="mt-8">
        <div className="space-y-3">
          {claims.map((c) => (
            <Link key={c._id} to={`/donations/${c.donation?._id || c.donation}`}
              className="flex items-center justify-between card card-hover p-4">
              <div>
                <p className="font-semibold text-text">{c.donation?.foodName || 'Donation'}</p>
                {c.pickupSchedule?.scheduledAt && (
                  <p className="text-xs text-text-light mt-1">Pickup: {formatDate(c.pickupSchedule.scheduledAt)}</p>
                )}
              </div>
              <Badge status={c.status} />
            </Link>
          ))}
          {claims.length === 0 && <p className="text-text-light text-center py-6">No claims yet</p>}
        </div>
      </Section>
    </DashboardLayout>
  );
}
