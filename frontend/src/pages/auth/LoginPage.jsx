import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(`/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue making an impact">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter your password"
          required
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
        <p className="text-center text-sm text-text-light pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
