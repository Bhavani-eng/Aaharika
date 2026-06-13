export const PageHeader = ({ title, subtitle, action, breadcrumbs, className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 ${className}`}>
    <div className="min-w-0">
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <h1 className="text-h1">{title}</h1>
      {subtitle && <p className="text-sm md:text-base text-text-light mt-2 max-w-2xl">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 flex flex-wrap gap-2">{action}</div>}
  </div>
);

export const FilterPills = ({ options, value, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${value === opt.value
            ? 'bg-primary text-white shadow-sm'
            : 'bg-surface text-text-light border border-border hover:border-primary/40 hover:text-primary'}
        `}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const Section = ({ title, subtitle, action, children, className = '' }) => (
  <section className={`${className}`}>
    {(title || action) && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          {title && <h2 className="text-h3">{title}</h2>}
          {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Grid = ({ cols = 4, gap = 4, children, className = '' }) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  const gapClasses = { 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' };
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};
