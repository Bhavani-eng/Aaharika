export const ROLES = {
  DONOR: 'donor',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  donor: 'Donor',
  ngo: 'NGO',
  volunteer: 'Volunteer',
  admin: 'Admin',
};

export const DONATION_CATEGORIES = [
  { value: 'prepared', label: 'Prepared Food' },
  { value: 'raw', label: 'Raw Ingredients' },
  { value: 'baked', label: 'Baked Goods' },
  { value: 'packaged', label: 'Packaged Food' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'other', label: 'Other' },
];

export const DONATION_STATUS = {
  available: { label: 'Available', color: 'bg-green-100 text-green-800' },
  claimed: { label: 'Claimed', color: 'bg-blue-100 text-blue-800' },
  scheduled: { label: 'Scheduled', color: 'bg-purple-100 text-purple-800' },
  picked_up: { label: 'Picked Up', color: 'bg-yellow-100 text-yellow-800' },
  delivered: { label: 'Delivered', color: 'bg-teal-100 text-teal-800' },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
};

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
];

export const ORG_TYPES = {
  donor: [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'supermarket', label: 'Supermarket' },
    { value: 'event', label: 'Event Organizer' },
    { value: 'other', label: 'Other' },
  ],
  ngo: [
    { value: 'ngo', label: 'NGO' },
    { value: 'orphanage', label: 'Orphanage' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'community_kitchen', label: 'Community Kitchen' },
    { value: 'other', label: 'Other' },
  ],
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const formatRelative = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const getDashboardPath = (role) => {
  const paths = { donor: '/donor', ngo: '/ngo', volunteer: '/volunteer', admin: '/admin' };
  return paths[role] || '/';
};
