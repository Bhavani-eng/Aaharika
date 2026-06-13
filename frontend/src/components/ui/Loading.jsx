export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-10 w-10 border-[3px]', lg: 'h-14 w-14 border-4' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizes[size]}`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <LoadingSpinner size="lg" />
    <p className="text-sm text-text-light font-medium">Loading...</p>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    {Icon && (
      <div className="mb-4 p-4 rounded-2xl bg-primary/8">
        <Icon className="h-10 w-10 text-primary/60" />
      </div>
    )}
    <h3 className="text-h3 mb-2">{title}</h3>
    <p className="text-sm text-text-light max-w-sm leading-relaxed mb-6">{description}</p>
    {action}
  </div>
);

export const Skeleton = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export const SkeletonCard = () => (
  <div className="card space-y-4">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);
