import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent if email exists');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="We'll send you a reset link">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <p className="font-semibold text-text mb-2">Check your email</p>
          <p className="text-sm text-text-light mb-6">If an account exists for {email}, you'll receive a reset link shortly.</p>
          <Link to="/login"><Button variant="outline" fullWidth>Back to Sign In</Button></Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          <Button type="submit" fullWidth loading={loading} size="lg">Send Reset Link</Button>
          <Link to="/login" className="block text-center text-sm font-medium text-primary hover:text-primary-dark">← Back to Sign In</Link>
        </form>
      )}
    </AuthLayout>
  );
}
