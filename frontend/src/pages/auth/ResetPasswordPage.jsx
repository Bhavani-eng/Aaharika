import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ token, password });
      localStorage.setItem('token', data.data.token);
      toast.success('Password reset successful!');
      navigate(`/${data.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid link">
        <div className="text-center py-4">
          <p className="text-red-500 font-medium mb-4">This reset link is invalid or has expired.</p>
          <Link to="/forgot-password"><Button fullWidth>Request New Link</Button></Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required hint="Minimum 6 characters" />
        <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <Button type="submit" fullWidth loading={loading} size="lg">Reset Password</Button>
      </form>
    </AuthLayout>
  );
}
