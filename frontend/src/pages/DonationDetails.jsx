import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/Layout';
import { Badge, StarRating } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QRDisplay } from '../components/QRScanner';
import { MapView } from '../components/MapView';
import { PageLoader } from '../components/ui/Loading';
import { ConfirmModal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { donationAPI, claimAPI } from '../services/api';
import { formatDate } from '../utils/constants';

export default function DonationDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    donationAPI.getById(id).then(({ data }) => setDonation(data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimAPI.create(id, {});
      toast.success('Donation claimed!');
      const { data } = await donationAPI.getById(id);
      setDonation(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim');
    } finally {
      setClaiming(false);
    }
  };

  const handleCancel = async () => {
    try {
      await donationAPI.cancel(id, 'Cancelled by donor');
      toast.success('Donation cancelled');
      const { data } = await donationAPI.getById(id);
      setDonation(data.data);
      setShowCancel(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;
  if (!donation) return <DashboardLayout><div className="card text-center py-12 text-text-light">Donation not found</div></DashboardLayout>;

  const isDonor = user?._id === donation.donor?._id || user?._id === donation.donor;
  const canClaim = user?.role === 'ngo' && donation.status === 'available';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="card overflow-hidden p-0">
          {donation.image ? (
            <img src={donation.image} alt={donation.foodName} className="w-full h-56 sm:h-72 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-7xl opacity-50">🍽️</span>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-h1 mb-2">{donation.foodName}</h1>
                <p className="text-text-light capitalize">{donation.category?.replace('_', ' ')} · {donation.quantity} · {donation.servings} servings</p>
              </div>
              <Badge status={donation.status} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1">Expiry Time</p>
                  <p className="font-medium">{formatDate(donation.expiryTime)}</p>
                </div>
                {donation.instructions && (
                  <div>
                    <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1">Instructions</p>
                    <p className="text-sm text-text-light leading-relaxed">{donation.instructions}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1">Donor</p>
                  <p className="font-semibold">{donation.donor?.organization || donation.donor?.name}</p>
                  {donation.donor?.stats?.rating > 0 && <StarRating rating={donation.donor.stats.rating} readonly size="sm" />}
                </div>
                {donation.claimedBy && (
                  <div>
                    <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1">Claimed By</p>
                    <p className="font-semibold text-secondary">{donation.claimedBy.organization || donation.claimedBy.name}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Pickup Location</p>
                <p className="text-sm mb-3">{donation.pickupLocation?.address}</p>
                <MapView lat={donation.pickupLocation?.coordinates?.lat} lng={donation.pickupLocation?.coordinates?.lng}
                  address={donation.pickupLocation?.address} height="200px" />
              </div>
            </div>

            {donation.qrCode && isDonor && (
              <div className="mt-8 pt-6 border-t border-border-light">
                <QRDisplay qrCode={donation.qrCode} title="Pickup QR Code" subtitle="Show this to the volunteer at pickup" />
              </div>
            )}

            {donation.timeline?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border-light">
                <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-4">Timeline</p>
                <div className="space-y-4">
                  {donation.timeline.map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        {i < donation.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1 min-h-[24px]" />}
                      </div>
                      <div className="pb-2">
                        <p className="font-semibold text-sm capitalize">{t.status?.replace('_', ' ')}</p>
                        <p className="text-sm text-text-light">{t.message}</p>
                        <p className="text-xs text-text-light/70 mt-0.5">{formatDate(t.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border-light">
              {canClaim && <Button onClick={handleClaim} loading={claiming}>Claim Donation</Button>}
              {isDonor && donation.status === 'available' && (
                <Button variant="danger" onClick={() => setShowCancel(true)}>Cancel Donation</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Donation"
        message="Are you sure you want to cancel this donation? This action cannot be undone."
        confirmLabel="Yes, Cancel"
      />
    </DashboardLayout>
  );
}
