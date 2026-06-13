import { useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/Layout';
import { StarRating, RoleBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, FileInput } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { ROLE_LABELS } from '../utils/constants';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', organization: user?.organization || '', bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (avatar) formData.append('avatar', avatar);
      const { data } = await authAPI.updateProfile(formData);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Profile Settings" subtitle="Manage your account information and security" />

      <div className="max-w-2xl">
        {/* Profile header card */}
        <div className="card mb-6 flex items-center gap-5">
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/10 shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-h2">{user?.name}</h2>
            <p className="text-sm text-text-light mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <RoleBadge role={ROLE_LABELS[user?.role]} />
              {user?.stats?.rating > 0 && <StarRating rating={user.stats.rating} readonly size="sm" />}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-background p-1 mb-6 gap-1">
          {[{ id: 'profile', label: 'Edit Profile' }, { id: 'password', label: 'Change Password' }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${tab === t.id ? 'bg-surface text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === 'profile' ? (
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              <Input label="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
              <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." />
              <FileInput label="Profile Photo" onChange={handleAvatar} accept="image/*" preview={avatarPreview !== user?.avatar ? avatarPreview : ''} />
              <Button type="submit" loading={loading}>Save Changes</Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <Input label="Current Password" type="password" value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
              <Input label="New Password" type="password" value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required hint="Minimum 6 characters" />
              <Input label="Confirm New Password" type="password" value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
              <Button type="submit" loading={loading} variant="secondary">Update Password</Button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
