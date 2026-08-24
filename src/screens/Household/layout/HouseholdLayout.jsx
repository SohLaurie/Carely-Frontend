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
  onNavigate,
  children
}) {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] flex">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingRequestsCount={pendingRequestsCount}
        pendingBookingsCount={pendingBookingsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onNavigate={onNavigate}
      />

      {/* Main workspace area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          unreadCount={unreadNotificationsCount}
        />

        {/* Content screen */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
