import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiShield, FiAlertCircle } from 'react-icons/fi';
import { DashboardLayout } from '../../components/Layout';
import { StatCard } from '../../components/ui/Card';
import { PageHeader, Grid } from '../../components/ui/PageHeader';
import { PageLoader } from '../../components/ui/Loading';
import { adminAPI } from '../../services/api';

const quickLinks = [
  { to: '/admin/users', label: 'User Management', desc: 'Manage all platform users', icon: FiUsers, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { to: '/admin/ngos', label: 'NGO Verification', desc: 'Approve pending NGOs', icon: FiShield, iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
  { to: '/admin/donations', label: 'Donation Monitor', desc: 'Track all donations', icon: FiPackage, iconBg: 'bg-accent/10', iconColor: 'text-accent' },
  { to: '/admin/complaints', label: 'Complaints', desc: 'Handle user complaints', icon: FiAlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and management tools" />

      <Grid cols={4} className="mb-8">
        <StatCard title="Total Users" value={data?.users?.total || 0} icon={FiUsers} color="primary" />
        <StatCard title="Active Donations" value={data?.donations?.active || 0} icon={FiPackage} color="accent" />
        <StatCard title="Pending NGO Verifications" value={data?.pendingNgoVerifications || 0} icon={FiShield} color="secondary" />
        <StatCard title="Open Complaints" value={data?.openComplaints || 0} icon={FiAlertCircle} color="red" />
      </Grid>

      <Grid cols={3} className="mb-8">
        <StatCard title="Donors" value={data?.users?.donors || 0} color="primary" />
        <StatCard title="NGOs" value={data?.users?.ngos || 0} color="secondary" />
        <StatCard title="Volunteers" value={data?.users?.volunteers || 0} color="accent" />
      </Grid>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}
            className="card card-hover flex flex-col items-center text-center p-6 group">
            <div className={`p-3 rounded-xl mb-3 ${link.iconBg} group-hover:scale-110 transition-transform`}>
              <link.icon className={`h-6 w-6 ${link.iconColor}`} />
            </div>
            <p className="font-semibold text-text text-sm">{link.label}</p>
            <p className="text-xs text-text-light mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
