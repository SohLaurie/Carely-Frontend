import React, { useState } from 'react';
import HouseholdLayout from './layout/HouseholdLayout';
import ExploreTab from './components/ExploreTab';
import DiscussionsTab from './components/DiscussionsTab';
import RequestsTab from './components/RequestsTab';
import BookingsTab from './components/BookingsTab';
import NotificationsTab from './components/NotificationsTab';
import SavedTab from './components/SavedTab';
import ProfileTab from './components/ProfileTab';

// Workflow Screens (Rendered inside the Household layout!)
import BookingForm from './screens/BookingForm';
import RequestPending from './screens/RequestPending';
import Payment from './screens/Payment';
import BookingConfirmed from './screens/BookingConfirmed';
import OTPArrival from './screens/OTPArrival';
import Completion from './screens/Completion';
import RateReview from './screens/RateReview';

import { useHouseholdDashboard } from './hooks/useHouseholdDashboard';

export default function HouseholdDashboard({ onNavigate: topNavigate, screenParams }) {
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
    clearNotifications,
    addMessageNotification,
    markAsReplied,
    // Discussions
    discussions,
    activeDiscussionId,
    setActiveDiscussionId,
    sendMessage,
    deleteDiscussion,
    clearDiscussionChat,
    deleteMessage,
    openDiscussionWithCaregiver,
    unreadMessagesCount
  } = useHouseholdDashboard(screenParams);

  // Workflow state parameters (keeps booking data flowing seamlessly inside layout)
  const [workflowParams, setWorkflowParams] = useState(screenParams || {});

  // Internal navigator that keeps the Sidebar and TopNavbar visible
  const handleInternalNavigate = (target, params = {}) => {
    const internalTabs = [
      'explore', 'discussions', 'requests', 'bookings',
      'notifications', 'saved', 'profile', 'booking',
      'pending', 'payment', 'confirmed', 'otp',
      'completion', 'review', 'search'
    ];

    if (target === 'search') {
      setActiveTab('explore');
      setWorkflowParams(params);
    } else if (internalTabs.includes(target)) {
      setActiveTab(target);
      setWorkflowParams(prev => ({ ...prev, ...params }));
    } else if (topNavigate) {
      topNavigate(target, params);
    }
  };

  return (
    <HouseholdLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      pendingRequestsCount={requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length}
      pendingBookingsCount={bookings.filter(b => b.status === 'Confirmed').length}
      unreadNotificationsCount={unreadCount}
      unreadMessagesCount={unreadMessagesCount}
      onNavigate={handleInternalNavigate}
      notifications={notifications}
      readToggleNotification={readToggleNotification}
      deleteNotification={deleteNotification}
      clearNotifications={clearNotifications}
      openDiscussionWithCaregiver={openDiscussionWithCaregiver}
    >
      {/* 1. Explore Tab */}
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
          onNavigate={handleInternalNavigate}
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
        />
      )}

      {/* 2. Discussions Tab (WhatsApp style messaging) */}
      {activeTab === 'discussions' && (
        <DiscussionsTab
          discussions={discussions}
          activeDiscussionId={activeDiscussionId}
          setActiveDiscussionId={setActiveDiscussionId}
          sendMessage={sendMessage}
          deleteDiscussion={deleteDiscussion}
          clearDiscussionChat={clearDiscussionChat}
          deleteMessage={deleteMessage}
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* 3. Requests Tab */}
      {activeTab === 'requests' && (
        <RequestsTab
          requests={requests}
          activeDropdownId={activeDropdownId}
          setActiveDropdownId={setActiveDropdownId}
          cancelDeleteRequest={cancelDeleteRequest}
          onNavigate={handleInternalNavigate}
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
        />
      )}

      {/* 4. Bookings Tab */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          activeBookingDropdownId={activeBookingDropdownId}
          setActiveBookingDropdownId={setActiveBookingDropdownId}
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* 5. Notifications Tab */}
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
          addMessageNotification={addMessageNotification}
          markAsReplied={markAsReplied}
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
        />
      )}

      {/* 6. Saved Caregivers Tab */}
      {activeTab === 'saved' && (
        <SavedTab
          setSelectedId={setSelectedId}
          setActiveTab={setActiveTab}
        />
      )}

      {/* 7. Current User Profile Tab */}
      {activeTab === 'profile' && (
        <ProfileTab
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* 8. Booking Form (Inside Dashboard Layout) */}
      {activeTab === 'booking' && (
        <BookingForm
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 9. Request Pending (Inside Dashboard Layout) */}
      {activeTab === 'pending' && (
        <RequestPending
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 10. Payment (Inside Dashboard Layout) */}
      {activeTab === 'payment' && (
        <Payment
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 11. Booking Confirmed (Inside Dashboard Layout) */}
      {activeTab === 'confirmed' && (
        <BookingConfirmed
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 12. Arrival OTP Verification (Inside Dashboard Layout) */}
      {activeTab === 'otp' && (
        <OTPArrival
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 13. Completion & Escrow Release (Inside Dashboard Layout) */}
      {activeTab === 'completion' && (
        <Completion
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* 14. Rate & Review (Inside Dashboard Layout) */}
      {activeTab === 'review' && (
        <RateReview
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}
    </HouseholdLayout>
  );
}
