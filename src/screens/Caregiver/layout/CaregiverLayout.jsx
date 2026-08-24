import React from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function CaregiverLayout({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  notificationsCount = 5,
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
        notificationsCount={notificationsCount}
        onNavigate={onNavigate}
      />

      {/* Main Content Layout */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <TopNavbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          notificationsCount={notificationsCount}
          onBellClick={() => setActiveTab('notifications')}
        />

        {/* Content body */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
