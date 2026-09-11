import React, { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function HouseholdLayout({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingRequestsCount,
  pendingBookingsCount,
  unreadNotificationsCount,
  unreadMessagesCount,
  onNavigate,
  notifications = [],
  readToggleNotification,
  deleteNotification,
  clearNotifications,
  openDiscussionWithCaregiver,
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingRequestsCount={pendingRequestsCount}
        pendingBookingsCount={pendingBookingsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        onNavigate={onNavigate}
      />
      <div ref={scrollContainerRef} className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
        <TopNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          unreadCount={unreadNotificationsCount}
          notifications={notifications}
          readToggleNotification={readToggleNotification}
          deleteNotification={deleteNotification}
          clearNotifications={clearNotifications}
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
        />
        <main className="flex-1 p-5 sm:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
