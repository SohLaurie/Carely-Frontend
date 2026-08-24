import React from 'react';
import HouseholdLayout from './layout/HouseholdLayout';
import ExploreTab from './components/ExploreTab';
import RequestsTab from './components/RequestsTab';
import BookingsTab from './components/BookingsTab';
import NotificationsTab from './components/NotificationsTab';
import SavedTab from './components/SavedTab';

import { useHouseholdDashboard } from './hooks/useHouseholdDashboard';

export default function HouseholdDashboard({ onNavigate, screenParams }) {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    selectedId,
    setSelectedId,
    filterSpecialty,
    setFilterSpecialty,
    filterLocation,
    setFilterLocation,
    date,
    setDate,
    showMobileDetail,
    setShowMobileDetail,
    showMobileFilters,
    setShowMobileFilters,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    availableOnly,
    setAvailableOnly,
    aiPrompt,
    setAiPrompt,
    aiLoading,
    aiResult,
    handleAiRecommend,
    requests,
    activeDropdownId,
    setActiveDropdownId,
    bookings,
    activeBookingDropdownId,
    setActiveBookingDropdownId,
    notifFilter,
    setNotifFilter,
    notifications,
    setNotifications,
    unreadCount,
    cancelDeleteRequest,
    archiveToggleNotification,
    readToggleNotification,
    deleteNotification,
    markAllNotificationsRead,
    archiveAllNotifications,
    clearNotifications
  } = useHouseholdDashboard(screenParams);

  return (
    <HouseholdLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      pendingRequestsCount={requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length}
      pendingBookingsCount={bookings.filter(b => b.status === 'Confirmed').length}
      unreadNotificationsCount={unreadCount}
      onNavigate={onNavigate}
    >
      {/* Explore view tab */}
      {activeTab === 'explore' && (
        <ExploreTab
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          filterSpecialty={filterSpecialty}
          setFilterSpecialty={setFilterSpecialty}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          date={date}
          setDate={setDate}
          showMobileDetail={showMobileDetail}
          setShowMobileDetail={setShowMobileDetail}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          minBudget={minBudget}
          setMinBudget={setMinBudget}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiLoading={aiLoading}
          aiResult={aiResult}
          handleAiRecommend={handleAiRecommend}
          onNavigate={onNavigate}
        />
      )}

      {/* Requests tab */}
      {activeTab === 'requests' && (
        <RequestsTab
          requests={requests}
          activeDropdownId={activeDropdownId}
          setActiveDropdownId={setActiveDropdownId}
          cancelDeleteRequest={cancelDeleteRequest}
          onNavigate={onNavigate}
        />
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          activeBookingDropdownId={activeBookingDropdownId}
          setActiveBookingDropdownId={setActiveBookingDropdownId}
          onNavigate={onNavigate}
        />
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <NotificationsTab
          notifications={notifications}
          setNotifications={setNotifications}
          notifFilter={notifFilter}
          setNotifFilter={setNotifFilter}
          unreadCount={unreadCount}
          archiveToggleNotification={archiveToggleNotification}
          readToggleNotification={readToggleNotification}
          deleteNotification={deleteNotification}
          markAllNotificationsRead={markAllNotificationsRead}
          archiveAllNotifications={archiveAllNotifications}
          clearNotifications={clearNotifications}
        />
      )}

      {/* Saved tab */}
      {activeTab === 'saved' && (
        <SavedTab
          setSelectedId={setSelectedId}
          setActiveTab={setActiveTab}
        />
      )}
    </HouseholdLayout>
  );
}
