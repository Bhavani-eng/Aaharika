import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { ORG_TYPES } from '../../utils/constants';

const roles = [
  { value: 'donor', label: 'Donor', desc: 'Restaurant, Hotel, Bakery, Supermarket', icon: '🏪', color: 'border-primary bg-primary/5' },
  { value: 'ngo', label: 'NGO / Shelter', desc: 'NGO, Orphanage, Shelter, Community Kitchen', icon: '🏠', color: 'border-secondary bg-secondary/5' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Help with food pickup and delivery', icon: '🚚', color: 'border-accent bg-accent/5' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: '', phone: '', organization: '', organizationType: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!form.role) return toast.error('Please select a role');
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const result = await register(data);
      toast.success('Account created successfully!');
      navigate(`/${result.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? 'Choose your role' : 'Create your account'}
      subtitle={step === 1 ? 'How would you like to contribute?' : `Registering as ${roles.find(r => r.value === form.role)?.label}`}
    >
      {step === 1 ? (
        <div className="space-y-3">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => { setForm({ ...form, role: r.value }); setStep(2); }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-sm border-border hover:border-primary/50 group`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background border border-border-light flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {r.icon}
                </div>
                <div>
                  <p className="font-semibold text-text">{r.label}</p>
                  <p className="text-xs text-text-light mt-0.5">{r.desc}</p>
                </div>
              </div>
            </button>
          ))}
          <p className="text-center text-sm text-text-light pt-3">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary">Sign in</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-primary hover:text-primary-dark mb-2">
            ← Change role
          </button>
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
          {(form.role === 'donor' || form.role === 'ngo') && (
            <>
              <Input label="Organization Name" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Your organization" />
              <Select label="Organization Type" value={form.organizationType}
                onChange={(e) => setForm({ ...form, organizationType: e.target.value })}
                options={[{ value: '', label: 'Select type' }, ...(ORG_TYPES[form.role] || [])]} />
            </>
          )}
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required hint="Minimum 6 characters" />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">Create Account</Button>
        </form>
      )}
    </AuthLayout>
  );
}
