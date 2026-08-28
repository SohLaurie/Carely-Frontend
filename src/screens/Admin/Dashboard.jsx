import React from 'react';
import AdminLayout from './layout/AdminLayout';
import OverviewTab from './components/OverviewTab';
import ApplicationsTab from './components/ApplicationsTab';
import DisputesTab from './components/DisputesTab';
import UsersTab from './components/UsersTab';
import BookingsTab from './components/BookingsTab';
import PaymentsTab from './components/PaymentsTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import AdminProfileTab from './components/AdminProfileTab';

import ReviewApplicationModal from './components/ReviewApplicationModal';
import DisputeModal from './components/DisputeModal';
import UserModal from './components/UserModal';
import AdminBookingModal from './components/AdminBookingModal';

import { useAdminDashboard } from './hooks/useAdminDashboard';

export default function AdminDashboard({ onNavigate }) {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    applications,
    disputes,
    users,
    bookings,
    recentActivity,
    revenueStats,
    selectedApplication,
    setSelectedApplication,
    selectedDispute,
    setSelectedDispute,
    selectedUser,
    setSelectedUser,
    selectedBooking,
    setSelectedBooking,
    editUserModalOpen,
    setEditUserModalOpen,
    appSearchQuery,
    setAppSearchQuery,
    appServiceFilter,
    setAppServiceFilter,
    userSearchQuery,
    setUserSearchQuery,
    userRoleFilter,
    setUserRoleFilter,
    userStatusFilter,
    setUserStatusFilter,
    notifications,
    setNotifications,
    notificationsOpen,
    setNotificationsOpen,
    unreadCount,
    approveApplication,
    rejectApplication,
    askForInfo,
    resolveDispute,
    toggleUserStatus,
    toggleUser2FA,
    deleteUser,
    editUser
  } = useAdminDashboard();

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      pendingApplicationsCount={applications.length}
      openDisputesCount={disputes.length}
      notifications={notifications}
      notificationsOpen={notificationsOpen}
      setNotificationsOpen={setNotificationsOpen}
      setNotifications={setNotifications}
      unreadCount={unreadCount}
      onNavigate={onNavigate}
    >
      {/* Overview tab */}
      {activeTab === 'overview' && (
        <OverviewTab
          applications={applications}
          disputes={disputes}
          users={users}
          bookings={bookings}
          recentActivity={recentActivity}
          revenueStats={revenueStats}
          setActiveTab={setActiveTab}
          setSelectedApplication={setSelectedApplication}
          setSelectedDispute={setSelectedDispute}
        />
      )}

      {/* Applications tab */}
      {activeTab === 'applications' && (
        <ApplicationsTab
          applications={applications}
          setSelectedApplication={setSelectedApplication}
          appSearchQuery={appSearchQuery}
          setAppSearchQuery={setAppSearchQuery}
          appServiceFilter={appServiceFilter}
          setAppServiceFilter={setAppServiceFilter}
        />
      )}

      {/* Disputes tab */}
      {activeTab === 'disputes' && (
        <DisputesTab
          disputes={disputes}
          setSelectedDispute={setSelectedDispute}
        />
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <UsersTab
          users={users}
          setSelectedUser={setSelectedUser}
          setEditUserModalOpen={setEditUserModalOpen}
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          userRoleFilter={userRoleFilter}
          setUserRoleFilter={setUserRoleFilter}
          userStatusFilter={userStatusFilter}
          setUserStatusFilter={setUserStatusFilter}
          toggleUserStatus={toggleUserStatus}
          toggleUser2FA={toggleUser2FA}
          deleteUser={deleteUser}
        />
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          setSelectedUser={setSelectedUser}
          onSelectBooking={setSelectedBooking}
        />
      )}

      {/* Payments tab */}
      {activeTab === 'payments' && (
        <PaymentsTab revenueStats={revenueStats} />
      )}

      {/* Analytics tab */}
      {activeTab === 'analytics' && (
        <AnalyticsTab />
      )}
      
      {/* Settings tab */}
      {activeTab === 'settings' && (
        <SettingsTab />
      )}

      {/* Profile tab view details */}
      {activeTab === 'profile' && (
        <AdminProfileTab onNavigate={onNavigate} />
      )}

      {/* MODALS RENDERING */}
      <ReviewApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onApprove={approveApplication}
        onReject={rejectApplication}
        onAsk={askForInfo}
      />

      <DisputeModal
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
        onResolve={resolveDispute}
      />

      <UserModal
        user={selectedUser}
        editMode={editUserModalOpen}
        onClose={() => {
          setSelectedUser(null);
          setEditUserModalOpen(false);
        }}
        onSave={editUser}
      />

      <AdminBookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onSelectUser={setSelectedUser}
      />
    </AdminLayout>
  );
}
