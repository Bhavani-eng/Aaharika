export const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`
      bg-surface rounded-xl border border-border-light
      ${padding ? 'p-6' : ''}
      ${hover ? 'card-hover cursor-pointer' : 'card'}
      ${className}
    `}
    style={!hover ? { boxShadow: 'var(--shadow-card)' } : undefined}
  >
    {children}
  </div>
);

const iconColors = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  red: 'bg-red-50 text-red-600',
  teal: 'bg-teal-50 text-teal-700',
};

export const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => (
  <Card className="animate-fade-in h-full">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-light truncate">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-text mt-2 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-text-light mt-2">{subtitle}</p>}
        {trend && <p className="text-xs font-medium text-secondary mt-1">{trend}</p>}
      </div>
      {Icon && (
        <div className={`shrink-0 p-3 rounded-xl ${iconColors[color]}`}>
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      )}
    </div>
  </Card>
);

export const FeatureCard = ({ icon: Icon, title, description, className = '' }) => (
  <Card hover className={`h-full ${className}`}>
    <div className={`inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-h3 mb-2">{title}</h3>
    <p className="text-sm text-text-light leading-relaxed">{description}</p>
  </Card>
);

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
    <div>
      {title && <h3 className="text-h3">{title}</h3>}
      {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
