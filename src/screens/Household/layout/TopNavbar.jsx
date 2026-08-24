import React from 'react';
import { Menu, ShieldCheck, Bell } from 'lucide-react';

export default function TopNavbar({
  activeTab,
  setSidebarOpen,
  unreadCount = 4
}) {
  // Title mapping
  const titleMap = {
    explore: 'Explore',
    requests: 'Requests',
    bookings: 'Bookings',
    notifications: 'Notifications',
    saved: 'Saved'
  };

  return (
    <header className="bg-white border-b border-[#E2D9CF] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="lg:hidden text-[#1C1A17] hover:text-[#1E4030]"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-bold text-[#1C1A17] hidden sm:block">
          {titleMap[activeTab] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Verified network tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A7E74]">
          <ShieldCheck size={14} className="text-[#1E4030]" />
          <span>Verified network</span>
        </div>

        {/* Notification bell */}
        <button className="w-10 h-10 rounded-full border border-[#E2D9CF] flex items-center justify-center text-[#1C1A17] hover:bg-secondary transition-all relative cursor-pointer">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] pl-2 pr-3 py-1.5 rounded-full">
          <div className="w-8 h-8 rounded-full bg-[#1E4030] text-white flex items-center justify-center text-xs font-bold font-display">
            AK
          </div>
          <span className="text-xs font-semibold text-[#1C1A17] hidden md:inline">Aïcha</span>
        </div>
      </div>
    </header>
  );
}
