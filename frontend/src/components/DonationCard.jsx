import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils/constants';

export const DonationCard = ({ donation, showDonor = false, compact = false }) => (
  <Link
    to={`/donations/${donation._id}`}
    className="group block bg-surface rounded-xl border border-border-light overflow-hidden card-hover"
    style={{ boxShadow: 'var(--shadow-card)' }}
  >
    {donation.image ? (
      <div className={`overflow-hidden ${compact ? 'h-36' : 'h-44'}`}>
        <img
          src={donation.image}
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    ) : (
      <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${compact ? 'h-36' : 'h-44'}`}>
        <span className="text-5xl opacity-60">🍽️</span>
      </div>
    )}
    <div className="p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-text group-hover:text-primary transition-colors line-clamp-1">
          {donation.foodName}
        </h3>
        <Badge status={donation.status} />
      </div>
      <p className="text-sm text-text-light">
        {donation.quantity} · {donation.servings} servings
        <span className="capitalize"> · {donation.category?.replace('_', ' ')}</span>
      </p>
      {donation.pickupLocation?.address && (
        <p className="text-xs text-text-light mt-2 line-clamp-1">{donation.pickupLocation.address}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
        {showDonor && donation.donor && (
          <p className="text-xs font-medium text-primary truncate">
            {donation.donor.organization || donation.donor.name}
          </p>
        )}
        <p className="text-xs text-text-light ml-auto whitespace-nowrap">
          Exp: {formatDate(donation.expiryTime)}
        </p>
      </div>
    </div>
  </Link>
);

export const DonationListItem = ({ donation, showDonor = false }) => (
  <Link
    to={`/donations/${donation._id}`}
    className="group flex gap-4 bg-surface rounded-xl border border-border-light p-4 card-hover"
    style={{ boxShadow: 'var(--shadow-card)' }}
  >
    {donation.image ? (
      <img src={donation.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
    ) : (
      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">🍽️</div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-text group-hover:text-primary transition-colors truncate">
          {donation.foodName}
        </h3>
        <Badge status={donation.status} />
      </div>
      <p className="text-sm text-text-light mt-1">{donation.quantity} · {donation.servings} servings</p>
      <p className="text-xs text-text-light mt-1">Expires: {formatDate(donation.expiryTime)}</p>
      {showDonor && donation.claimedBy && (
        <p className="text-xs text-secondary mt-1 font-medium">
          Claimed by: {donation.claimedBy.organization || donation.claimedBy.name}
        </p>
      )}
    </div>
  </Link>
);

export const QuickActionCard = ({ to, icon: Icon, title, description, color = 'primary' }) => {
  const colors = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    secondary: 'from-secondary/10 to-secondary/5 text-secondary',
    accent: 'from-accent/10 to-accent/5 text-accent',
  };
  return (
    <Link
      to={to}
      className="group flex flex-col items-center text-center p-6 bg-surface rounded-xl border border-border-light card-hover"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-semibold text-text text-sm">{title}</p>
      <p className="text-xs text-text-light mt-1">{description}</p>
    </Link>
  );
};
