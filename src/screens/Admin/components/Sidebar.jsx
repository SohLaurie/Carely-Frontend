import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  AlertOctagon,
  Users,
  Calendar,
  Wallet,
  BarChart3,
  User,
  LogOut,
  X,
  Settings
} from 'lucide-react';
import { ADMIN_CONSTANTS } from '../constants/adminConstants';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingApplicationsCount = 7,
  openDisputesCount = 3,
  onNavigate
}) {
  const iconMap = {
    overview: LayoutDashboard,
    applications: ClipboardList,
    disputes: AlertOctagon,
    users: Users,
    bookings: Calendar,
    payments: Wallet,
    analytics: BarChart3,
    settings: Settings
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#11231A] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 lg:h-screen lg:shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-white/20 shadow-sm shrink-0">
              <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wide">
                {ADMIN_CONSTANTS.TITLE}
              </h2>
              <p className="text-[10px] text-white/40 font-medium">
                {ADMIN_CONSTANTS.SUBTITLE}
              </p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {ADMIN_CONSTANTS.NAV_ITEMS.map(({ key, label }) => {
            const active = activeTab === key;
            const Icon = iconMap[key] || LayoutDashboard;

            // Badges
            let displayBadge = null;
            if (key === 'applications' && pendingApplicationsCount > 0) {
              displayBadge = pendingApplicationsCount;
            }
            if (key === 'disputes' && openDisputesCount > 0) {
              displayBadge = openDisputesCount;
            }

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {displayBadge && (
                  <span className="bg-[#1D6F42] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {displayBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden"></div>
      )}
    </>
  );
}

function HeartIcon({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
    >
      <path d="M11.645 20.91l-.007-.003-.003-.001a11.4 11.4 0 01-1.124-.627 21.23 21.23 0 01-4.836-4.361C3.16 12.827 2 10.268 2 7.5 2 4.351 4.417 2 7.5 2c1.74 0 3.41.84 4.5 2.293C13.09 2.84 14.76 2 16.5 2 19.583 2 22 4.351 22 7.5c0 2.768-1.16 5.327-3.675 8.422a21.23 21.23 0 01-4.836 4.361 11.4 11.4 0 01-1.124.627l-.003.001-.007.003-.031.011a.75.75 0 01-.672 0l-.031-.011z" />
    </svg>
  );
}
