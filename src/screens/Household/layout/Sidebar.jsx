import React from 'react';
import { Home, Compass, ClipboardList, Calendar, Bell, Heart, User, LogOut, X, MessageSquare } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingRequestsCount = 2,
  pendingBookingsCount = 1,
  unreadNotificationsCount = 4,
  unreadMessagesCount = 1,
  onNavigate
}) {
  const menuItems = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'explore', label: 'Explore', Icon: Compass },
    { id: 'discussions', label: 'Discussions', Icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'requests', label: 'Requests', Icon: ClipboardList, badge: pendingRequestsCount },
    { id: 'bookings', label: 'Bookings', Icon: Calendar, badge: pendingBookingsCount },
    { id: 'notifications', label: 'Notifications', Icon: Bell, badge: unreadNotificationsCount },
    { id: 'saved', label: 'Saved', Icon: Heart },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F1A14] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setActiveTab('home');
              setSidebarOpen(false);
            }}
          >
            <div className="w-10 h-10 bg-[#1E4030] rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
              <Heart size={18} className="fill-white text-[#1E4030]" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wide">Carely</h2>
              <p className="text-[10px] text-white/40 font-medium">Trusted care</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map(({ id, label, Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active 
                    ? 'bg-white/10 text-white shadow-sm font-semibold' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {badge > 0 && (
                  <span className="bg-[#1E4030] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Configuration: Profile stays inside dashboard layout! */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => {
              setActiveTab('profile');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white/10 text-white shadow-sm font-semibold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={18} />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
}
