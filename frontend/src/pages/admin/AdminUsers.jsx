import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/Layout';
import { StatusDot } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader, FilterPills } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { PageLoader } from '../../components/ui/Loading';
import { adminAPI } from '../../services/api';
import { ROLE_LABELS } from '../../utils/constants';

const filters = [
  { value: '', label: 'All' },
  { value: 'donor', label: 'Donors' },
  { value: 'ngo', label: 'NGOs' },
  { value: 'volunteer', label: 'Volunteers' },
  { value: 'admin', label: 'Admins' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = filter ? { role: filter } : {};
    adminAPI.getUsers(params).then(({ data }) => setUsers(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const toggleActive = async (id, isActive) => {
    try {
      await adminAPI.updateUser(id, { isActive: !isActive });
      toast.success('User updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (u) => <span className="font-medium">{u.name}</span> },
    { key: 'email', header: 'Email', render: (u) => <span className="text-text-light">{u.email}</span> },
    { key: 'role', header: 'Role', render: (u) => <span className="capitalize font-medium">{ROLE_LABELS[u.role]}</span> },
    { key: 'status', header: 'Status', render: (u) => <StatusDot active={u.isActive} /> },
    {
      key: 'actions', header: 'Actions',
      render: (u) => u.role !== 'admin' && (
        <Button size="xs" variant={u.isActive ? 'danger' : 'secondary'} onClick={() => toggleActive(u._id, u.isActive)}>
          {u.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="User Management" subtitle="View and manage all platform users" />
      <FilterPills options={filters} value={filter} onChange={setFilter} className="mb-6" />

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={users} emptyMessage="No users found" />
      )}
    </DashboardLayout>
  );
}
