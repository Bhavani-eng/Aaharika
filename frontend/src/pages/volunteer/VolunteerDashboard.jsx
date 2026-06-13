import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import { DashboardLayout } from '../../components/Layout';
import { StatCard } from '../../components/ui/Card';
import { PageHeader, Grid, Section } from '../../components/ui/PageHeader';
import { PageLoader } from '../../components/ui/Loading';
import { Badge } from '../../components/ui/Badge';
import { volunteerAPI } from '../../services/api';

export default function VolunteerDashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      volunteerAPI.getStats(),
      volunteerAPI.getTasks({ mine: 'true', limit: 5 }),
    ]).then(([sRes, tRes]) => {
      setStats(sRes.data.data);
      setTasks(tRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  const activeTasks = tasks.filter((t) => t.status !== 'delivered');

  return (
    <DashboardLayout>
      <PageHeader title="Volunteer Dashboard" subtitle="Help deliver food to those who need it most" />

      <Grid cols={3} className="mb-8">
        <StatCard title="Total Tasks" value={stats?.total || 0} icon={FiTruck} color="primary" />
        <StatCard title="Completed" value={stats?.completed || 0} icon={FiCheck} color="secondary" />
        <StatCard title="Active" value={stats?.active || 0} icon={FiClock} color="accent" />
      </Grid>

      <Section
        title="Active Deliveries"
        action={<Link to="/volunteer/tasks" className="text-sm font-semibold text-primary hover:text-primary-dark">View all tasks →</Link>}
      >
        {activeTasks.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-text-light mb-3">No active deliveries.</p>
            <Link to="/volunteer/tasks" className="text-sm font-semibold text-primary">Browse available tasks →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((t) => (
              <div key={t._id} className="card flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-text truncate">{t.donation?.foodName}</p>
                  <p className="text-sm text-text-light truncate mt-0.5">{t.pickupLocation?.address}</p>
                </div>
                <Badge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </Section>
    </DashboardLayout>
  );
}
