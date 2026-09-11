import React, { useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function AdminLayout({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingApplicationsCount = 7,
  openDisputesCount = 3,
  notifications,
  notificationsOpen,
  setNotificationsOpen,
  setNotifications,
  unreadCount = 9,
  onNavigate,
  children
}) {
  const scrollContainerRef = useRef(null);

  // Scroll to top whenever active tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="bg-[#FAF8F5] h-screen w-full overflow-hidden text-[#1C1A17] flex">
      {/* Sidebar Layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingApplicationsCount={pendingApplicationsCount}
        openDisputesCount={openDisputesCount}
        onNavigate={onNavigate}
      />

      {/* Main Content Layout */}
      <div ref={scrollContainerRef} className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
        <TopNavbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          setNotifications={setNotifications}
          unreadCount={unreadCount}
        />

        {/* Content body */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
