import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex">
    {/* Left panel - branding */}
    <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-xl shadow-md">
            🍽️
          </div>
          <div>
            <span className="font-bold text-xl text-text">Aaharika</span>
            <p className="text-xs text-text-light">From Excess to Access</p>
          </div>
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-text leading-tight mb-4">
            Transforming food waste into hope for communities in need
          </h2>
          <p className="text-text-light leading-relaxed">
            Join thousands of donors, NGOs, and volunteers working together to reduce hunger and food waste across India.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '10K+', label: 'Meals Served' },
              { value: '200+', label: 'Donors' },
              { value: '150+', label: 'NGO Partners' },
            ].map((s) => (
              <div key={s.label} className="bg-white/60 backdrop-blur rounded-xl p-4 text-center border border-white/80">
                <p className="text-xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-text-light mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-text-light">© 2026 Aaharika. Fighting food waste together.</p>
      </div>
    </div>

    {/* Right panel - form */}
    <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="lg:hidden mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-lg">🍽️</div>
            <span className="font-bold text-xl text-primary">Aaharika</span>
          </Link>
        </div>
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-h1 mb-2">{title}</h1>}
            {subtitle && <p className="text-text-light">{subtitle}</p>}
          </div>
        )}
        <div className="bg-surface rounded-2xl border border-border-light p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  </div>
);
