import React, { useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function CaregiverLayout({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  notificationsCount = 5,
  requestsCount = 0,
  bookingsCount = 0,
  unreadMessagesCount = 0,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onReplyClick,
  onNavigate,
  onPaySubscription,
  children
}) {
  const scrollContainerRef = useRef(null)

  // Scroll to top whenever active tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }, [activeTab])

  return (
    <div className="bg-[#FAF8F5] h-screen w-full overflow-hidden text-[#1C1A17] flex">
      {/* Sidebar Layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationsCount={notificationsCount}
        requestsCount={requestsCount}
        bookingsCount={bookingsCount}
        unreadMessagesCount={unreadMessagesCount}
        onNavigate={onNavigate}
      />

      {/* Main Content Layout */}
      <div ref={scrollContainerRef} className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto">
        <TopNavbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          notificationsCount={notificationsCount}
          notifications={notifications}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
          onReplyClick={onReplyClick}
          onViewAllNotifications={() => setActiveTab('notifications')}
          onProfileClick={() => setActiveTab('profile')}
          onPaySubscription={onPaySubscription}
        />

        {/* Content body */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
