import React from 'react';
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
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] flex">
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
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
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
