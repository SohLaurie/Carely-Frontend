import React from 'react';
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
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] flex">
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
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
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
