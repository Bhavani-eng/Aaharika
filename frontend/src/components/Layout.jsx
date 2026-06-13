import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBell, FiMenu, FiX, FiLogOut, FiChevronRight, FiHome,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { ROLE_LABELS } from '../utils/constants';
import { formatRelative } from '../utils/constants';

const navLinks = {
  donor: [
    { to: '/donor', label: 'Dashboard', icon: FiHome },
    { to: '/donor/create', label: 'Create Donation' },
    { to: '/donor/donations', label: 'My Donations' },
    { to: '/emergency', label: 'Emergency' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/certificates', label: 'Certificates' },
    { to: '/complaints', label: 'Complaints' },
    { to: '/profile', label: 'Profile' },
  ],
  ngo: [
    { to: '/ngo', label: 'Dashboard', icon: FiHome },
    { to: '/ngo/donations', label: 'Browse Donations' },
    { to: '/ngo/claims', label: 'My Claims' },
    { to: '/emergency', label: 'Emergency' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/certificates', label: 'Certificates' },
    { to: '/complaints', label: 'Complaints' },
    { to: '/profile', label: 'Profile' },
  ],
  volunteer: [
    { to: '/volunteer', label: 'Dashboard', icon: FiHome },
    { to: '/volunteer/tasks', label: 'Tasks' },
    { to: '/volunteer/scanner', label: 'QR Scanner' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/certificates', label: 'Certificates' },
    { to: '/complaints', label: 'Complaints' },
    { to: '/profile', label: 'Profile' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: FiHome },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/ngos', label: 'NGO Verification' },
    { to: '/admin/donations', label: 'Donations' },
    { to: '/admin/complaints', label: 'Complaints' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/profile', label: 'Profile' },
  ],
};

const SidebarLink = ({ link, active, onClick }) => (
  <Link
    to={link.to}
    onClick={onClick}
    className={`
      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
      ${active
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-light hover:text-text hover:bg-gray-100'}
    `}
  >
    {link.icon && <link.icon className="h-4 w-4 shrink-0" />}
    <span className="truncate">{link.label}</span>
    {active && <FiChevronRight className="h-4 w-4 ml-auto shrink-0 opacity-70" />}
  </Link>
);

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationAPI.getAll({ limit: 10 });
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const handler = () => fetchNotifications();
    window.addEventListener('new-notification', handler);
    return () => window.removeEventListener('new-notification', handler);
  }, [fetchNotifications]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const links = navLinks[user?.role] || [];

  const markAllRead = async () => {
    await notificationAPI.markAllRead();
    fetchNotifications();
  };

  const isActive = (path) => {
    if (path === `/${user?.role}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-text/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-light
          flex flex-col transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border-light shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-base shadow-sm shrink-0">
              🍽️
            </div>
            <div className="min-w-0">
              <p className="font-bold text-text text-sm leading-tight truncate">Aaharika</p>
              <p className="text-[10px] text-text-light leading-tight truncate">From Excess to Access</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-text-light"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              link={link}
              active={isActive(link.to)}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border-light shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
              <p className="text-xs text-text-light capitalize">{ROLE_LABELS[user?.role]}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-md border-b border-border-light px-4 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-text-light transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-text-light font-medium">Welcome back</p>
              <p className="text-sm font-semibold text-text">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
              {ROLE_LABELS[user?.role]}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 text-text-light hover:text-text transition-colors"
              >
                <FiBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl border border-border-light z-50 overflow-hidden animate-slide-up"
                    style={{ boxShadow: 'var(--shadow-lg)' }}>
                    <div className="px-4 py-3 border-b border-border-light flex justify-between items-center bg-gray-50/50">
                      <span className="font-semibold text-sm text-text">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:text-primary-dark">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center">
                          <FiBell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-text-light">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`px-4 py-3 border-b border-border-light last:border-0 hover:bg-gray-50/80 transition-colors ${!n.isRead ? 'bg-primary/4 border-l-2 border-l-primary' : ''}`}
                          >
                            <p className="text-sm font-semibold text-text">{n.title}</p>
                            <p className="text-xs text-text-light mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-text-light/70 mt-1.5 font-medium">{formatRelative(n.createdAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link to="/profile" className="sm:hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto overflow-x-hidden">
          <div className="page-container animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-background">{children}</div>
);
