import React, { useState, useEffect, useRef } from 'react';
import { Menu, ShieldCheck, Bell, Clock, Check, Trash2, Reply, MessageSquare } from 'lucide-react';
import { getStoredUser, getUserDisplayName, getUserInitials, getAvatarUrl } from '../../../services/api.js';

const titleMap = {
  explore:       'Explore Caregivers',
  discussions:   'Discussions & Chat',
  requests:      'My Requests',
  bookings:      'My Bookings',
  notifications: 'Notifications',
  saved:         'Saved Caregivers',
  profile:       'My Profile & Settings',
  booking:       'Book Care Service',
  pending:       'Request Status & Hold',
  payment:       'Authorize Escrow Payment',
  confirmed:     'Booking Confirmed',
  otp:           'Arrival OTP Verification',
  completion:    'Service Confirmation & Escrow Release',
  review:        'Rate & Review Caregiver',
};

export default function TopNavbar({
  activeTab,
  setSidebarOpen,
  setActiveTab,
  unreadCount = 0,
  notifications = [],
  readToggleNotification,
  deleteNotification,
  clearNotifications,
  openDiscussionWithCaregiver
}) {
  const [time, setTime]                       = useState('');
  const [dateStr, setDateStr]                 = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [confirmDialog, setConfirmDialog]     = useState(null);
  const dropdownRef                           = useRef(null);

  const [user, setUser]                       = useState(getStoredUser());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setUser(e.detail);
    };
    window.addEventListener('carely_user_updated', handleUpdate);
    return () => window.removeEventListener('carely_user_updated', handleUpdate);
  }, []);

  const displayName = getUserDisplayName(user, 'Aïcha');
  const initials = getUserInitials(user, 'AK');
  const avatarUrl = getAvatarUrl(user?.photoUrl);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const confirmDelete = (id) => {
    setConfirmDialog({
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification? This cannot be undone.',
      onConfirm: () => { if (deleteNotification) deleteNotification(id); setConfirmDialog(null); },
    });
  };

  const confirmClearAll = () => {
    setConfirmDialog({
      title: 'Clear All Notifications',
      message: 'This will permanently delete all notifications. This action cannot be undone.',
      onConfirm: () => { if (clearNotifications) clearNotifications(); setNotifDropdownOpen(false); setConfirmDialog(null); },
    });
  };

  const visibleNotifs = notifications.filter((n) => !n.archived).slice(0, 6);

  return (
    <>
      <header className="bg-white border-b border-[#E2D9CF] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#1C1A17] hover:text-[#1E4030] transition-colors cursor-pointer">
            <Menu size={22} />
          </button>
          <h1 className="font-display text-lg font-bold text-[#1C1A17] hidden sm:block">
            {titleMap[activeTab] || 'Dashboard'}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Time & Date */}
          <div className="hidden md:flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-1.5 rounded-full text-xs">
            <Clock size={12} className="text-[#1E4030]" />
            <span className="font-bold text-[#1C1A17]">{time}</span>
            <span className="text-[#D4CAC0] select-none">|</span>
            <span className="text-[#8A7E74]">{dateStr}</span>
          </div>

          {/* System online */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#EDF7F2] border border-green-200/60 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-[#1E4030] font-semibold">System online</span>
          </div>

          {/* Verified network */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#8A7E74]">
            <ShieldCheck size={14} className="text-[#1E4030]" />
            <span>Verified network</span>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotifDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full border border-[#E2D9CF] flex items-center justify-center text-[#1C1A17] hover:bg-[#FAF8F5] transition-all relative cursor-pointer"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-[380px] bg-white border border-[#E2D9CF] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                {/* Dropdown header */}
                <div className="px-4 py-3.5 border-b border-[#E2D9CF] flex items-center justify-between bg-[#FAF8F5]">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-[#1E4030]" />
                    <h3 className="font-bold text-sm text-[#1C1A17]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">{unreadCount}</span>
                    )}
                  </div>
                  <button onClick={confirmClearAll} className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
                    <Trash2 size={11} />Clear all
                  </button>
                </div>

                {/* Notification list */}
                <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F1EC]">
                  {visibleNotifs.length === 0 ? (
                    <div className="p-10 text-center text-[#8A7E74]">
                      <Bell size={22} className="mx-auto mb-2 text-[#8A7E74]/30 animate-pulse" />
                      <p className="text-xs font-semibold">All caught up!</p>
                    </div>
                  ) : (
                    visibleNotifs.map((n) => (
                      <div key={n.id} className={`px-4 py-3.5 flex items-start gap-3 transition-all group ${n.unread ? 'bg-[#EDF7F2]/40' : 'hover:bg-[#FAF8F5]/70'}`}>
                        <div className="mt-1.5 shrink-0 w-2">
                          {n.unread ? <span className="w-2 h-2 rounded-full bg-[#1E4030] block"></span> : <span className="w-2 h-2 block"></span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${n.unread ? 'text-[#1C1A17]' : 'text-[#4A4340]'}`}>{n.title}</p>
                          <p className="text-[10px] text-[#8A7E74] leading-relaxed mt-0.5 line-clamp-2">{n.text}</p>
                          <span className="text-[9px] text-[#8A7E74]/60 font-medium mt-0.5 block">{n.time}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                          {readToggleNotification && (
                            <button onClick={() => readToggleNotification(n.id)} title={n.unread ? 'Mark read' : 'Mark unread'} className="w-6 h-6 rounded-full bg-[#EDF7F2] text-[#1E4030] flex items-center justify-center hover:bg-[#1E4030] hover:text-white transition-all cursor-pointer">
                              <Check size={10} />
                            </button>
                          )}
                          {openDiscussionWithCaregiver && (
                            <button
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                openDiscussionWithCaregiver(n.recipient || n.title);
                              }}
                              title="Go to Discussions"
                              className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                            >
                              <MessageSquare size={10} />
                            </button>
                          )}
                          {setActiveTab && (
                            <button onClick={() => { setNotifDropdownOpen(false); setActiveTab('notifications'); }} title="View in Notifications" className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8A7E74] flex items-center justify-center hover:bg-[#1E4030] hover:text-white transition-all cursor-pointer">
                              <Reply size={10} />
                            </button>
                          )}
                          <button onClick={() => confirmDelete(n.id)} title="Delete" className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.filter((n) => !n.archived).length > 0 && (
                  <div className="px-4 py-3 border-t border-[#E2D9CF] bg-[#FAF8F5]">
                    <button onClick={() => { setNotifDropdownOpen(false); if (setActiveTab) setActiveTab('notifications'); }} className="w-full text-center text-xs font-bold text-[#1E4030] hover:underline cursor-pointer">
                      See all notifications &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Pill - Opens Profile Tab directly! */}
          <div
            onClick={() => setActiveTab && setActiveTab('profile')}
            className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] pl-1.5 pr-3 py-1.5 rounded-full cursor-pointer hover:border-[#1E4030]/40 transition-colors shadow-2xs"
            title="Open Profile Settings"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-8 h-8 rounded-full object-cover border border-[#E2D9CF] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1E4030] text-white flex items-center justify-center text-xs font-bold font-display">
                {initials}
              </div>
            )}
            <span className="text-xs font-semibold text-[#1C1A17] hidden md:inline">{displayName}</span>
          </div>

        </div>
      </header>

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#1C1A17]">{confirmDialog.title}</h3>
              <p className="text-sm text-[#8A7E74] leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog(null)} className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-sm font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

