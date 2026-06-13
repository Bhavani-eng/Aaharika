import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select, FileInput } from '../../components/ui/Input';
import { PageHeader } from '../../components/ui/PageHeader';
import { LocationPicker } from '../../components/MapView';
import { donationAPI } from '../../services/api';
import { DONATION_CATEGORIES } from '../../utils/constants';

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    foodName: '', category: 'prepared', quantity: '', servings: '', expiryTime: '',
    instructions: '', pickupLocation: { address: '', city: '', coordinates: { lat: 19.076, lng: 72.8777 } },
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'pickupLocation') formData.append(key, JSON.stringify(val));
        else formData.append(key, val);
      });
      if (image) formData.append('image', image);
      const { data } = await donationAPI.create(formData);
      toast.success('Donation created!');
      navigate(`/donations/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Create Donation" subtitle="Share surplus food with those who need it most" />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <Input label="Food Name" value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })}
            required placeholder="e.g., Vegetable Biryani, Fresh Bread" />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={DONATION_CATEGORIES} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required placeholder="e.g., 5 kg, 20 boxes" />
            <Input label="Servings" type="number" min="1" value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })} required placeholder="50" />
          </div>
          <Input label="Expiry Time" type="datetime-local" value={form.expiryTime}
            onChange={(e) => setForm({ ...form, expiryTime: e.target.value })} required />
          <LocationPicker
            lat={form.pickupLocation.coordinates.lat}
            lng={form.pickupLocation.coordinates.lng}
            address={form.pickupLocation.address}
            onLocationChange={(coords) => setForm({ ...form, pickupLocation: { ...form.pickupLocation, coordinates: coords } })}
            onAddressChange={(address) => setForm({ ...form, pickupLocation: { ...form.pickupLocation, address } })}
          />
          <FileInput label="Food Image" onChange={handleImage} preview={preview} hint="PNG, JPG up to 5MB" />
          <Textarea label="Special Instructions" rows={3} value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            placeholder="Allergen info, storage instructions, handling notes..." />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/donor')}>Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1 sm:flex-none">Create Donation</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
