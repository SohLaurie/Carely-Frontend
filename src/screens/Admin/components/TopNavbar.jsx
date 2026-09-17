import React, { useState, useEffect } from 'react';
import { Menu, Bell, Shield, X, Check } from 'lucide-react';
import { getStoredUser, getUserDisplayName, getUserInitials, getAvatarUrl } from '../../../services/api.js';
import { fetchCurrentProfile } from '../../../services/auth.service.js';

export default function TopNavbar({
  activeTab,
  setSidebarOpen,
  notifications,
  notificationsOpen,
  setNotificationsOpen,
  setNotifications,
  unreadCount
}) {
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    fetchCurrentProfile().then(fresh => {
      if (fresh) setUser(fresh);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setUser(e.detail);
    };
    window.addEventListener('carely_user_updated', handleUpdate);
    return () => window.removeEventListener('carely_user_updated', handleUpdate);
  }, []);

  const displayName = getUserDisplayName(user, 'Admin');
  const initials = getUserInitials(user, 'AD');
  const rawPhoto = user?.photoUrl || user?.photo_url;
  const avatarUrl = getAvatarUrl(rawPhoto);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Overview',
          subtitle: `Welcome back, ${displayName}. Platform health and items needing your attention.`
        };

      case 'applications':
        return {
          title: 'Provider Verification',
          subtitle: 'Review pending applications and approve, reject or request more information.'
        };
      case 'disputes':
        return {
          title: 'Open Disputes',
          subtitle: 'Review evidence, contact both parties and release escrow with a resolution note.'
        };
      case 'users':
        return {
          title: 'Users',
          subtitle: 'Households and providers on Carely.'
        };
      case 'bookings':
        return {
          title: 'Bookings Console',
          subtitle: 'Platform-wide service contract list.'
        };
      case 'payments':
        return {
          title: 'Payments & Escrow Escort',
          subtitle: 'Monitor escrow accounts, platform commission splits, and payouts.'
        };
      case 'analytics':
        return {
          title: 'Platform Analytics',
          subtitle: 'Overview of platform growth, performance, and key metrics.'
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Configure your admin dashboard preferences.'
        };
      case 'profile':
        return {
          title: 'Admin Profile',
          subtitle: 'Manage credentials and console preferences.'
        };
      default:
        return {
          title: 'Admin Dashboard',
          subtitle: 'Carely Admin Console'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleToggleNotification = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, unread: !n.unread };
      }
      return n;
    }));
  };

  const totalUnread = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E2D9CF] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-[#1C1A17] hover:text-[#1E4030]"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-display text-base font-bold text-[#1C1A17] leading-none">
            {headerInfo.title}
          </h1>
          {headerInfo.subtitle && (
            <p className="text-[10px] text-[#8A7E74] mt-0.5 font-medium">
              {headerInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Admin Badge */}
        <div className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2.5 py-1 rounded-full text-[10px] font-bold">
          <Shield size={11} />
          <span>Admin</span>
        </div>

        {/* Notifications Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-full bg-white border border-[#E2D9CF] flex items-center justify-center text-[#1C1A17] hover:bg-[#EFECE6] transition-all relative"
          >
            <Bell size={15} />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#991B1B] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Card */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2D9CF] rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-4 border-b border-[#EFECE6] bg-[#FAF8F5] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1A17]">System Alerts</span>
                {totalUnread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#1E4030] hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#EFECE6] max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleToggleNotification(n.id)}
                    className={`p-3 flex items-start gap-2.5 hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                      n.unread ? 'bg-[#EDF7F2]/40' : ''
                    }`}
                  >
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${n.unread ? 'text-[#1C1A17]' : 'text-[#8A7E74]'}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-[#8A7E74]">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-[#8A7E74] leading-relaxed">{n.desc}</p>
                    </div>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 self-center"></span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2.5 border-t border-[#EFECE6] text-center bg-[#FAF8F5]">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[10px] text-[#8A7E74] font-semibold hover:text-[#1C1A17]"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-8 h-8 rounded-full object-cover border border-[#E2D9CF] shrink-0 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1E4030] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
          )}
          <span className="hidden sm:inline text-xs font-semibold text-[#1C1A17]">{displayName}</span>
        </div>

      </div>
    </header>
  );
}
