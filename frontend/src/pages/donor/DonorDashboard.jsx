import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiPackage, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { DashboardLayout } from '../../components/Layout';
import { StatCard, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader, Grid, Section } from '../../components/ui/PageHeader';
import { PageLoader } from '../../components/ui/Loading';
import { DonationListItem } from '../../components/DonationCard';
import { donationAPI } from '../../services/api';

export default function DonorDashboard() {
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([donationAPI.getStats(), donationAPI.getAll({ limit: 5 })])
      .then(([statsRes, donationsRes]) => {
        setStats(statsRes.data.data);
        setDonations(donationsRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader
        title="Donor Dashboard"
        subtitle="Manage your food donations and track your community impact"
        action={
          <Link to="/donor/create">
            <Button><FiPlus className="h-4 w-4" /> Create Donation</Button>
          </Link>
        }
      />

      <Grid cols={4} className="mb-8">
        <StatCard title="Total Donations" value={stats?.total || 0} icon={FiPackage} color="primary" />
        <StatCard title="Active" value={stats?.active || 0} icon={FiTrendingUp} color="accent" />
        <StatCard title="Delivered" value={stats?.delivered || 0} icon={FiCheckCircle} color="secondary" />
        <StatCard title="Meals Served" value={stats?.mealsServed || 0} icon={FiCheckCircle} color="secondary"
          subtitle={`${stats?.foodSavedKg?.toFixed(1) || 0} kg food saved`} />
      </Grid>

      <Section
        title="Recent Donations"
        action={<Link to="/donor/donations" className="text-sm font-semibold text-primary hover:text-primary-dark">View all →</Link>}
      >
        <div className="space-y-3">
          {donations.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-light mb-4">No donations yet. Start making an impact today!</p>
              <Link to="/donor/create"><Button size="sm"><FiPlus /> Create Donation</Button></Link>
            </div>
          ) : (
            donations.map((d) => <DonationListItem key={d._id} donation={d} />)
          )}
        </div>
      </Section>
    </DashboardLayout>
  );
}
