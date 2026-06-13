const variants = {
  primary:
    'bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-secondary text-white shadow-sm hover:bg-secondary-dark hover:shadow-md active:scale-[0.98]',
  accent:
    'bg-accent text-white shadow-sm hover:bg-accent-dark hover:shadow-md active:scale-[0.98]',
  outline:
    'bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]',
  'outline-secondary':
    'bg-surface border-2 border-secondary text-secondary hover:bg-secondary hover:text-white active:scale-[0.98]',
  ghost:
    'text-text-light hover:text-primary hover:bg-primary/8 active:scale-[0.98]',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md active:scale-[0.98]',
  white:
    'bg-white text-text border border-border shadow-sm hover:bg-gray-50 active:scale-[0.98]',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  loading,
  type = 'button',
  fullWidth = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center rounded-lg font-semibold
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
      ${variants[variant] || variants.primary}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
    {...props}
  >
    {loading && (
      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full shrink-0" />
    )}
    {children}
  </button>
);
