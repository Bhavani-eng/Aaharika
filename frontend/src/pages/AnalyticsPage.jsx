import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/Layout';
import { StatCard } from '../components/ui/Card';
import { PageHeader, Grid } from '../components/ui/PageHeader';
import { PageLoader } from '../components/ui/Loading';
import { analyticsAPI } from '../services/api';

const COLORS = ['#D97706', '#2F855A', '#0F766E', '#FBBF24', '#48BB78', '#0D5D56'];

const ChartCard = ({ title, children, empty }) => (
  <div className="card h-full">
    <h3 className="text-h3 mb-6">{title}</h3>
    {empty ? (
      <div className="flex items-center justify-center h-64 text-text-light text-sm">No data available yet</div>
    ) : children}
  </div>
);

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.get().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title="Analytics" subtitle="Track your impact and performance metrics" />

      <Grid cols={4} className="mb-8">
        <StatCard title="Food Saved (kg)" value={data?.foodSavedKg || 0} color="primary" />
        <StatCard title="Meals Served" value={data?.mealsServed || 0} color="secondary" />
        <StatCard title="Total Delivered" value={data?.totalDelivered || 0} color="accent" />
        <StatCard title="Delivery Success" value={`${data?.deliveryStats?.successRate || 0}%`} color="secondary"
          subtitle={`${data?.deliveryStats?.delivered || 0} of ${data?.deliveryStats?.total || 0} claims`} />
      </Grid>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Trends" empty={!data?.monthlyTrends?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
              <Line type="monotone" dataKey="servings" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4 }} name="Meals" />
              <Line type="monotone" dataKey="donations" stroke="#2F855A" strokeWidth={2.5} dot={{ r: 4 }} name="Donations" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Breakdown" empty={!data?.categoryBreakdown?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data?.categoryBreakdown} dataKey="count" nameKey="category" cx="50%" cy="50%"
                outerRadius={90} innerRadius={50} paddingAngle={3} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                {data?.categoryBreakdown?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {data?.topDonors?.length > 0 && (
        <ChartCard title="Top Donors">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topDonors} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
              <Bar dataKey="totalServings" fill="#D97706" name="Meals Served" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </DashboardLayout>
  );
}
