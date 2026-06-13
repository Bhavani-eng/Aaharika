import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiHeart, FiUsers, FiTruck, FiShield,
  FiBarChart2, FiClock, FiMenu, FiX, FiCheck,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { FeatureCard } from '../components/ui/Card';

const features = [
  { icon: FiHeart, title: 'Reduce Food Waste', desc: 'Connect surplus food from restaurants and hotels with those who need it most.' },
  { icon: FiUsers, title: 'Community Network', desc: 'Build bridges between donors, NGOs, and volunteers in your community.' },
  { icon: FiTruck, title: 'Volunteer Delivery', desc: 'Coordinate pickups and deliveries with our trusted volunteer network.' },
  { icon: FiShield, title: 'QR Verification', desc: 'Secure QR-based verification for every pickup and delivery step.' },
  { icon: FiBarChart2, title: 'Impact Analytics', desc: 'Track meals served, food saved, and your real contribution impact.' },
  { icon: FiClock, title: 'Real-Time Updates', desc: 'Instant notifications for donations, claims, and deliveries.' },
];

const steps = [
  { num: '01', title: 'Donors List Food', desc: 'Restaurants, hotels, and bakeries list surplus food with pickup details and expiry times.' },
  { num: '02', title: 'NGOs Discover & Claim', desc: 'NGOs and shelters browse available donations and claim what their community needs.' },
  { num: '03', title: 'Schedule Pickup', desc: 'Coordinate pickup times seamlessly between donors and recipient organizations.' },
  { num: '04', title: 'Volunteers Deliver', desc: 'Volunteers pick up and deliver food with QR verification at every step.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Restaurant Owner, Mumbai', text: 'Aaharika helped us redirect 500+ meals monthly. No more guilt about food waste!', avatar: 'P', rating: 5 },
  { name: 'Rajesh Kumar', role: 'NGO Director, Delhi', text: 'We now receive fresh food daily for our shelter. The platform is incredibly easy to use.', avatar: 'R', rating: 5 },
  { name: 'Anita Desai', role: 'Volunteer, Bangalore', text: 'Delivering food to those in need has been the most rewarding experience of my life.', avatar: 'A', rating: 5 },
];

export default function LandingPage() {
  const [stats, setStats] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    analyticsAPI.getPublic().then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  const statItems = [
    { label: 'Meals Served', value: stats.totalMealsServed || '10,000+', icon: '🍽️' },
    { label: 'Food Saved (kg)', value: stats.foodSavedKg || '3,500+', icon: '🌱' },
    { label: 'Active Donors', value: stats.donors || '200+', icon: '🏪' },
    { label: 'Partner NGOs', value: stats.ngos || '150+', icon: '🏠' },
  ];

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#features', label: 'Features' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-surface/90 backdrop-blur-lg z-50 border-b border-border-light">
        <div className="page-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-base shadow-sm">🍽️</div>
              <span className="font-bold text-text text-lg">Aaharika</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.href} href={item.href}
                  className="text-sm font-medium text-text-light hover:text-primary transition-colors">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started <FiArrowRight className="h-4 w-4" /></Button></Link>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-border-light bg-surface px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenu(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-text-light hover:text-primary hover:bg-primary/5">
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border-light mt-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" fullWidth>Sign In</Button></Link>
              <Link to="/register" className="flex-1"><Button size="sm" fullWidth>Get Started</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="gradient-hero pt-28 pb-20 lg:pt-36 lg:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-up max-w-xl lg:max-w-lg">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                From Excess to Access
              </span>
              <h1 className="text-display text-text mb-6">
                Turning Food Waste Into{' '}
                <span className="text-primary">Hope & Nourishment</span>
              </h1>
              <p className="text-body text-text-light mb-8 max-w-lg">
                Aaharika connects restaurants, hotels, and bakeries with NGOs, orphanages, and shelters
                to redistribute surplus food and fight hunger in our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button size="lg" fullWidth className="sm:w-auto">
                    Join as Donor <FiArrowRight />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-secondary" size="lg" fullWidth className="sm:w-auto">
                    Register as NGO
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {['Free to join', 'QR verified', 'Real-time tracking'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-text-light">
                    <FiCheck className="h-4 w-4 text-secondary shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="bg-surface rounded-3xl border border-border-light p-8 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {statItems.map((s) => (
                      <div key={s.label} className="bg-background rounded-2xl p-5 border border-border-light text-center">
                        <span className="text-2xl mb-2 block">{s.icon}</span>
                        <p className="text-2xl font-bold text-primary">{s.value}</p>
                        <p className="text-xs text-text-light mt-1 font-medium">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="grid grid-cols-2 gap-4 mt-12 lg:hidden">
            {statItems.map((s) => (
              <div key={s.label} className="bg-surface/80 backdrop-blur rounded-xl p-4 border border-border-light text-center">
                <p className="text-xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-text-light mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
              <h2 className="text-h1 mt-3 mb-6">Nourish. Connect. Impact.</h2>
              <p className="text-body text-text-light mb-4">
                Every day, tons of perfectly good food goes to waste while millions go hungry.
                Aaharika bridges this gap by creating a seamless platform for food redistribution.
              </p>
              <p className="text-body text-text-light">
                Our mission is simple: transform excess into access. We empower food businesses
                to donate surplus food, help NGOs receive fresh meals, and enable volunteers to
                make deliveries that change lives.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {['Donors', 'NGOs', 'Volunteers', 'Admin'].map((r) => (
                  <span key={r} className="px-4 py-2 rounded-lg bg-background border border-border-light text-sm font-semibold text-text">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/15 via-background to-secondary/15 rounded-3xl flex items-center justify-center border border-border-light">
                <div className="text-center p-8">
                  <span className="text-8xl block mb-4">🌱</span>
                  <p className="text-xl font-bold text-secondary">Building a hunger-free future</p>
                  <p className="text-sm text-text-light mt-2">One meal at a time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Process</span>
            <h2 className="text-h1 mt-3 mb-4">How It Works</h2>
            <p className="text-body text-text-light">Four simple steps from surplus food to those in need</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-4 z-0" />
                )}
                <div className="card h-full group-hover:shadow-md transition-shadow relative z-10">
                  <div className="w-12 h-12 rounded-xl gradient-primary text-white text-sm font-bold flex items-center justify-center mb-5 shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="text-h3 mb-2">{step.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-h1 mt-3 mb-4">Everything You Need</h2>
            <p className="text-body text-text-light">Powerful tools to manage food redistribution efficiently</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="text-h1 mt-3 mb-4">What People Say</h2>
            <p className="text-body text-text-light">Stories from our community of changemakers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-text-light leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border-light">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-text">{t.name}</p>
                    <p className="text-xs text-text-light">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="page-container">
          <div className="gradient-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-white/80 mb-8 text-base leading-relaxed">
                Join Aaharika today and be part of the movement to end food waste and hunger.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="white" className="w-full sm:w-auto">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-6">contact@aaharika.org</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="page-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-base">🍽️</div>
                <span className="font-bold text-lg">Aaharika</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                From Excess to Access. Fighting food waste and hunger together across communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Platform</h4>
              <div className="space-y-2.5">
                <Link to="/login" className="block text-sm text-gray-400 hover:text-primary transition-colors">Sign In</Link>
                <Link to="/register" className="block text-sm text-gray-400 hover:text-primary transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Roles</h4>
              <div className="space-y-2.5 text-sm text-gray-400">
                <p>Donors & Food Businesses</p>
                <p>NGOs & Shelters</p>
                <p>Volunteer Deliverers</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Contact</h4>
              <p className="text-sm text-gray-400">contact@aaharika.org</p>
              <p className="text-sm text-gray-400 mt-2">India</p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700/60 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 Aaharika. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ for a hunger-free world</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
