import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/Layout';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../../components/ui/Loading';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/constants';
import { FiPackage } from 'react-icons/fi';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDonations().then(({ data }) => setDonations(data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Donation Monitoring" subtitle="Track all donations across the platform" />

      {loading ? <PageLoader /> : donations.length === 0 ? (
        <EmptyState icon={FiPackage} title="No donations" description="Donations will appear here once created." />
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <Link key={d._id} to={`/donations/${d._id}`}
              className="flex items-center justify-between card card-hover p-4 gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-text truncate">{d.foodName}</h3>
                <p className="text-sm text-text-light mt-0.5 truncate">
                  {d.donor?.organization || d.donor?.name} · {d.quantity}
                </p>
                <p className="text-xs text-text-light mt-1">{formatDate(d.createdAt)}</p>
              </div>
              <Badge status={d.status} />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
