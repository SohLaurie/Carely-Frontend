import React, { useState } from 'react';
import HouseholdLayout from './layout/HouseholdLayout';
import ExploreTab from './components/ExploreTab';
import HomeTab from './components/HomeTab';
import BookingWizard from './components/booking/BookingWizard';
import DiscussionsTab from './components/DiscussionsTab';
import RequestsTab from './components/RequestsTab';
import BookingsTab from './components/BookingsTab';
import NotificationsTab from './components/NotificationsTab';
import SavedTab from './components/SavedTab';
import ProfileTab from './components/ProfileTab';
import ReferEarnTab from './components/ReferEarnTab';

// Workflow Screens (Rendered inside the Household layout!)
import BookingForm from './screens/BookingForm';
import RequestPending from './screens/RequestPending';
import Payment from './screens/Payment';
import BookingConfirmed from './screens/BookingConfirmed';
import OTPArrival from './screens/OTPArrival';
import Completion from './screens/Completion';
import RateReview from './screens/RateReview';

import { useHouseholdDashboard } from './hooks/useHouseholdDashboard';
import { getStoredUser } from '../../services/api';

export default function HouseholdDashboard({ onNavigate: topNavigate, screenParams }) {
  // Booking wizard overlay state
  const [wizardOpen, setWizardOpen]     = useState(false);
  const [wizardParams, setWizardParams] = useState({});

  const openBookingWizard = (params = {}) => {
    setWizardParams(params);
    setWizardOpen(true);
  };

  const handleWizardComplete = (bookingData) => {
    setWizardOpen(false);

    let formattedDate = bookingData.date || 'Today';
    let formattedTime = '09:00 – 12:00';
    
    if (bookingData.bookingType === 'recurring' && bookingData.selectedDays) {
      const days = Object.keys(bookingData.selectedDays);
      const shortMap = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
      const dayLabels = days.map(d => shortMap[d] || d);
      formattedDate = `Every ${dayLabels.join(', ')}`;
      const firstDay = bookingData.selectedDays[days[0]];
      if (firstDay?.startTime && firstDay?.endTime) {
        formattedTime = `${firstDay.startTime} – ${firstDay.endTime}`;
      }
    } else {
      if (bookingData.startTime && bookingData.endTime) {
        formattedTime = `${bookingData.startTime} – ${bookingData.endTime}`;
      }
    }

    const formattedPrice = bookingData.totalPrice
      ? (bookingData.totalPrice.toLocaleString() + ' XAF')
      : '11,000 XAF';

    const realBookingId = bookingData.bookingId || bookingData.backendBooking?.id || ('R_' + Date.now());

    const providerProfession = bookingData.provider?.profession || bookingData.provider?.professionOther || (Array.isArray(bookingData.provider?.specialties) ? bookingData.provider?.specialties[0] : bookingData.provider?.specialties) || 'Cleaner';
    const providerInitials = bookingData.provider?.name
      ? bookingData.provider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : 'NZ';
    const providerPhoto = bookingData.provider?.photo || bookingData.provider?.photoUrl || null;

    const newRequest = {
      id: realBookingId,
      bookingId: realBookingId,
      name: bookingData.provider?.name || 'Verified Provider',
      profession: providerProfession,
      specialty: providerProfession,
      initials: providerInitials,
      date: formattedDate,
      time: formattedTime,
      status: 'Pending',
      timeSent: 'Sent Just Now',
      location: bookingData.addressText || bookingData.address?.full || 'Yaoundé / Douala',
      pricePerHour: bookingData.provider?.pricePerHour || 50,
      totalPrice: formattedPrice,
      patientNotes: bookingData.notes || 'No specific instructions provided.',
      photo: providerPhoto,
      caregiver: {
        id: bookingData.provider?.id,
        name: bookingData.provider?.name || 'Verified Provider',
        profession: providerProfession,
        specialty: providerProfession,
        initials: providerInitials,
        pricePerHour: bookingData.provider?.pricePerHour || 50,
        photo: providerPhoto,
        rating: bookingData.provider?.rating || 5.0,
      },
      rawBooking: bookingData.backendBooking || null,
    };

    setRequests(prev => [newRequest, ...prev.filter(x => x.id !== realBookingId)]);
    setWorkflowParams({
      activeBookingId: realBookingId,
      booking: newRequest,
      activeRequest: newRequest,
    });
    setActiveTab('pending');
  };

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
    setRequests,
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
    unreadMessagesCount,
    loadBookings
  } = useHouseholdDashboard(screenParams);

  // Workflow state parameters (keeps booking data flowing seamlessly inside layout)
  const [workflowParams, setWorkflowParams] = useState(screenParams || {});

  // Internal navigator that keeps the Sidebar and TopNavbar visible
  const handleInternalNavigate = (target, params = {}) => {
    const internalTabs = [
      'home', 'explore', 'discussions', 'requests', 'bookings',
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

  return (<>
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
      {/* 0. Home Tab */}
      {activeTab === 'home' && (
        <HomeTab
          onNavigate={handleInternalNavigate}
          openBookingWizard={openBookingWizard}
          userFirstName={getStoredUser()?.firstName || getStoredUser()?.first_name || 'there'}
          bookings={bookings}
        />
      )}

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
          openBookingWizard={openBookingWizard}
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
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
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

      {/* Refer & Earn Tab */}
      {activeTab === 'refer' && (
        <ReferEarnTab />
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
          loadBookings={loadBookings}
        />
      )}

      {/* 11. Booking Confirmed (Inside Dashboard Layout) */}
      {activeTab === 'confirmed' && (
        <BookingConfirmed
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
          loadBookings={loadBookings}
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

    {/* ── Booking Wizard Overlay ─────────────────────────── */}
    {wizardOpen && (
      <BookingWizard
        {...wizardParams}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    )}
  </>);
}
